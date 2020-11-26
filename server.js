const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const {mongoose, postSchema, tokenSchema, userSchema, communitySchema} = require('./mongoose')
const url = 'mongodb://127.0.0.1:27017/jibjab'

mongoose.connect(url, { useNewUrlParser: true , useFindAndModify: false })

const conn = mongoose.connection
let PostModel
let UserModel
let CommunityModel

conn.once('open', () => {
	console.log('Database connected', url)
	PostModel = conn.model('posts', postSchema)
	UserModel = conn.model('users', userSchema)
	CommunityModel = conn.model('communities', communitySchema)
})

conn.on('error', () => {
	console.log('Database error' , url)
})

const app = express()

const myPort = process.env.PORT || 3000

/*MiddleWare*/
app.use(cors())
app.use(bodyParser.json())

function timeDifference(date, dateType) {
	const dateNow = new Date()
	const postDate = new Date(date)
    let difference = dateNow.getTime() - postDate.getTime();
    let daysDifference = Math.floor(difference/1000/60/60/24);
/*    difference -= daysDifference*1000*60*60*24
*/
    let hoursDifference = Math.floor(difference/1000/60/60);
/*    difference -= hoursDifference*1000*60*60
*/
    let minutesDifference = Math.floor(difference/1000/60);
/*    difference -= minutesDifference*1000*60*/

    let secondsDifference = Math.floor(difference/1000);
    if(dateType === undefined){
    	return secondsDifference
    } else if (dateType === 'days'){
    	return daysDifference
    } else if (dateType === 'hours'){
    	return hoursDifference
    } else if (dateType === 'minutes'){
    	return minutesDifference
    } else if (dateType === 'seconds'){
    	return secondsDifference
    }
}

function sortPosts(posts, sortType, sortTypeCont){
	function sortBy(newSortOrder, type){
		let n = newSortOrder.length
		for(i = 0; i < n; i++){
			let current = newSortOrder[i]
			let j = i - 1
			if(type ==='score'){
				while((j > -1) && (current.score > newSortOrder[j].score)){
					newSortOrder[j+1] = newSortOrder[j]
					j--
				}
				newSortOrder[j+1] = current
				console.log(newSortOrder)
			} else if(type === 'age'){
				while((j > -1) && (current.age < newSortOrder[j].age)){
					newSortOrder[j+1] = newSortOrder[j]
					j--
				}
				newSortOrder[j+1] = current
				console.log(newSortOrder)
			}
		}

		const match = (raw, sorted) => (m => sorted.map(s => m.get(s.id)))(new Map(raw.map(r => [r.id, r])))
		return match(posts, newSortOrder)
	}
	let newSortOrder = []
	if(sortType === 'spicy' || sortType === 'communities'){
		posts.forEach((p, i) => {
			newSortOrder.push({
				id: p.id,
				score: p.karma.upvotes.length - p.karma.downvotes.length - timeDifference(p.time, 'hours') ,
			})
		})
		return sortBy(newSortOrder, 'score')

	} else if (sortType === 'new' || sortType === 'soapBox'){
		posts.forEach((p, i) => {
			newSortOrder.push({
				id: p.id,
				age: timeDifference(p.time)
			})
		})
		return sortBy(newSortOrder, 'age')
	} else if(sortType === 'dicey'){
		if(sortTypeCont === 'day'){
			posts.forEach((p, i) => {
				const age = timeDifference(p.time, 'days')
				if(age < 1){
					newSortOrder.push({
						id: p.id,
						score: p.karma.upvotes.length + p.karma.downvotes.length
					})
				}
			})
			}
			else if (sortTypeCont === 'week'){
				const age = timeDifference(p.time, 'days')
				posts.forEach((p, i) => {
				if(age <= 7){
					newSortOrder.push({
						id: p.id,
						score: p.karma.upvotes.length + p.karma.downvotes.length
					})
				}
			})
			}
			else if (sortTypeCont === 'month'){
				const age = timeDifference(p.time, 'days')
				posts.forEach((p, i) => {
				if(age <= 30){
					newSortOrder.push({
						id: p.id,
						score: p.karma.upvotes.length + p.karma.downvotes.length
					})
				}
			})
			}
			else if (sortTypeCont === 'year'){
				const age = timeDifference(p.time, 'days')
				posts.forEach((p, i) => {
				if(age <= 365){
					newSortOrder.push({
						id: p.id,
						score: p.karma.upvotes.length + p.karma.downvotes.length
					})
				}
			})
			}
			return sortBy(newSortOrder, 'score')
	} else if (sortType === 'top') {
		if(sortTypeCont === 'day'){
			posts.forEach((p, i) => {
				const age = timeDifference(p.time, 'days')
				if(age < 1){
					newSortOrder.push({
						id: p.id,
						score: p.karma.upvotes.length - p.karma.downvotes.length
					})
				}
			})
			}
			else if (sortTypeCont === 'week'){
			posts.forEach((p, i) => {
				const age = timeDifference(p.time, 'days')
				if(age <= 7){
					newSortOrder.push({
						id: p.id,
						score: p.karma.upvotes.length - p.karma.downvotes.length
					})
				}
			})
			}
			else if (sortTypeCont === 'month'){
				posts.forEach((p, i) => {
					const age = timeDifference(p.time, 'days')
					if(age <= 30){
						newSortOrder.push({
							id: p.id,
							score: p.karma.upvotes.length - p.karma.downvotes.length
						})
					}
				})
			}
			else if (sortTypeCont === 'year'){
				posts.forEach((p, i) => {
					const age = timeDifference(p.time, 'days')
					if(age <= 365){
						newSortOrder.push({
							id: p.id,
							score: p.karma.upvotes.length - p.karma.downvotes.length
						})
					}
				})
			}
			return sortBy(newSortOrder, 'score')
	}
}



function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	if (token === null) return res.sendStatus(401)
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if(err) return res.sendStatus(403)
		req.user = user
		next()
	})
}

app.get('/', authenticateToken, (req, res) => {
	UserModel.findOne({userName: req.user.userName}, (err, response) => {
		if(err) res.sendStatus(401)
		if(res === null) res.sendStatus(403)
		res.json(response)
	})
})

app.post('/api/', (req, res) => {
	CommunityModel.findOne({communityName: 'Popular'})
	.then(pageContent => {
		const communities = req.body.communities.map((c, i) => c.toLowerCase())
		CommunityModel.find({
			communityNameLower : { $in:
				communities
			}
		})
		.then(result => {
			pageContent.communities = req.body.communities
			result.map((r, i) => pageContent.posts.push(...r.posts))
			res.json(pageContent)
		})
	})
})



/*GET COMMUNITY DATA AND POSTS */
app.get('/api/c/:communityName/', (req, res) => {
	CommunityModel.findOne({communityNameLower: req.params.communityName.toLowerCase()})
	.then((pageContent) => {
		if(pageContent.communityNameLower !== 'global'){
			res.json(pageContent)
		} else {
			const communities = pageContent.communities.map((r, i) => r.toLowerCase())
			CommunityModel.find({
				communityNameLower: { $in:
					communities
				}
			})
			.then(result => {
				const posts = []
				result.map((r, i) => posts.push(...r.posts))
				pageContent.posts = posts
				res.json(pageContent)
			})
		}
	})
	.catch(err => console.log(err))		
})


/*GET COMMUNITY IMAGE*/
app.get('/img/:communityName' , (req, res) => {
	CommunityModel.findOne({communityNameLower: req.params.communityName })
	.then((result) => res.json(result.configuration.communityImg))
	.catch(err => console.log(err))
})


app.post('/api/p/', (req, res) => {
	if(req.body.posts.length > 1){
		PostModel.find({
			id: { $in: 
				req.body.posts
			}
		})
		.then(result => {
			const posts = sortPosts(result, req.body.sortType, req.body.sortTypeCont)
			res.json(posts)
		})
		.catch(err => console.log(err))
	} else if(req.body.posts.length === 1) {
		PostModel.findOne({id: req.body.posts[0]})
		.then(result => {
			const posts = [result]
			res.json(posts)
		})
		.catch(err => console.log(err))
	} else if(req.body.posts.length === 0){
		res.status(400).json({error: 'Not subscribed to anything, try following some people or communities to fill your feed'})
	}
})

app.get('/api/topPosts/:communityNameLower', (req, res) => {
	CommunityModel.findOne({communityNameLower: req.params.communityNameLower})
	.then(community => {
		PostModel.find({
			id: { $in:
				community.posts
			}
		})
		.then(result =>{
			const posts = sortPosts(result, 'top', 'day')
			res.json(posts)
		})
		.catch(err => console.log(err))
	})
})


app.get('/api/c/:communityName/:postID', (req, res) => {
	CommunityModel.findOne({communityNameLower: req.params.communityName.toLowerCase()})
	.then((pageContent) => {
		const posts = []
		posts.push(req.params.postID)
		pageContent.posts = posts
		res.json(pageContent)
	})
	.catch(err => console.log(err))
})

app.post('/api/vote', authenticateToken, async (req, res) => {
	let { request , postID } = req.body
	let { userName } = req.user
	const post = await PostModel.findOne({id: postID})
	if(post){
		let {upvotes, downvotes} = post.karma
		try{
			if(request === 'downvote'){
				if(downvotes.includes(userName)){
					downvotes.forEach((u, i) => {
						if(u === userName){
							downvotes.splice(i, 1)
							i--
						}
					})
				} else {
					if(upvotes.includes(userName)){
						upvotes.forEach((u, i) => {
							if(u === userName){
								upvotes.splice(i, 1)
								i--
							}
						})
					}
					downvotes.push(userName)
				}
					post.markModified('karma')
					post.save()
					.then(savedPost => res.json(savedPost))
					.catch(err => console.log(err))
			} else {
				if(upvotes.includes(userName)){
					upvotes.forEach((u, i) => {
						if(u === userName){
							upvotes.splice(i, 1)
							i--
						}
					})
				} else {
					if(downvotes.includes(userName)){
						downvotes.forEach((u, i) => {
							if(u === userName){
								downvotes.splice(i, 1)
								i--
							}
						})
					}
					upvotes.push(userName)
				}
				post.markModified('karma')
				post.save()
				.then(savedPost => res.json(savedPost))
				.catch(err => console.log(err))
			}
		}
		catch(err){
			res.status(400).json({error: 'There has been an error'})
		}
	}
})

app.post('/api/comment/submit' , authenticateToken, async (req, res) => {
	const {postId, commentId, commentContent } = req.body
	console.log(postId, commentId, commentContent)
	const userName = req.user.userName
	const time = new Date()
	const newComment = {
		commentInfo: {
			userName,
			time: time.toString(),
			id: '116',
		},
		commentContent,
		comments: [],
		karma: {
			upvotes: [],
			downvotes: []
		}
	}
	const post = await PostModel.findOne({id: postId.toString()})
	if(post){
		try{
			const postComment = (comments, id, commentId, content) => {
				comments.map((c, i) => {
					if(c.commentInfo.id === commentId){
						c.comments.push(newComment)
						return
					} else { 
						postComment(c.comments, id, commentId, content)
					}
				})
				return 
			}
			if(commentId === 'parent'){
				post.comments.push(newComment)
			}else {
				postComment(post.comments, postId, commentId, commentContent)
			}
			post.markModified('comments')
			post.save()
			.then(result => {
				res.json([result])
			})
			.catch(err => console.log(err))
		}
		catch(err){
			res.status(400).json({error: 'There has been an error :('})
		}
	}
})

app.post('/api/comment/vote', authenticateToken, async (req, res) => {
	const deepUpvote = (comments, userName, id) => {
		const output = comments.map((c, i) => {
			if(c.commentInfo.id === commentId){
				if(c.karma.upvotes.includes(userName)){
					c.karma.upvotes.splice(i, 1)
				} else {
					if(c.karma.downvotes.includes(userName)){
						c.karma.downvotes.splice(i, 1)
					}
					c.karma.upvotes.push(userName)
				}
				return
			} else {
				if(c.comments.length > 0) {
					deepUpvote(c.comments, userName, id)
				}
			}
		})
		return output
	}


	const deepDownvote = (comments, userName, id) => {

		const output = comments.map((c, i) => {
			if(c.commentInfo.id === commentId){
				if(c.karma.downvotes.includes(userName)){
					c.karma.downvotes.splice(i, 1)
				} else {
					if(c.karma.upvotes.includes(userName)){
						c.karma.upvotes.splice(i, 1)
					}
					c.karma.downvotes.push(userName)
				}
				return
			} else {
				if(c.comments.length > 0) {
					deepDownvote(c.comments, userName, id)
				}
			}
		})
		return output
	}

	const { postId, commentId, request } = req.body
	const post = await PostModel.findOne({id: postId})
	if(post){
		try{
			if(request === 'upvote'){
				deepUpvote(post.comments, req.user.userName, commentId)
			} else if (request === 'downvote'){
				deepDownvote(post.comments, req.user.userName, commentId)
			}
			post.markModified('comments')
			post.save()
			.then(result => res.json(result))
			.catch(err => console.log(err))
		}
		catch(err){
			res.status(400).json({error: 'There was an error'})
		}
	} else {
		res.status(400).json({error: 'There was an error'})
	}
})

app.post('/api/c/subscription', authenticateToken, async (req, res) => {
	const community = await CommunityModel.findOne({communityNameLower: req.body.communityName.toLowerCase()})
	const user = await UserModel.findOne({userName: req.user.userName})
	if(user && community) {
		const session = await mongoose.startSession()
		session.startTransaction()
		try{
			if(req.body.request === 'subscribe'){
				user.communities.push(community.communityName)
				community.followers.push(user.userName)
				community.markModified('followers')
				community.save()
				user.markModified('communities')
				user.save()
				.then(savedUser => {
					res.json(savedUser)
				})
				.catch(err => console.log(err))
			} else if (req.body.request === 'unsubscribe') {
				community.followers.forEach((f, i) => {
					if(f === user.userName){
						community.followers.splice(i, 1)
						i--
					}
				})
				user.communities.forEach((c, i) => {
					if(c === community.communityName){
						user.communities.splice(i, 1)
						i--
					}
				})
				community.markModified('followers')
				community.save()
				user.markModified('communities')
				user.save()
				.then(savedUser => {
					res.json(savedUser)
				})
				.catch(err => console.log(err))
			}
		}
		catch(err){
			await session.abortTransaction()
			session.endSession()
			res.status(400).json({error: 'There has been an error'})
		}
	} else {
		res.status(400).json({error: 'There has been an error'})
	}
})


app.get('/api/u/settings', authenticateToken , async (req, res) => {
	const user = await UserModel.findOne({userName: req.user.userName})
	if(user){
		try{
			user.settings.feedType === 'card' ? user.settings.feedType = 'list' : user.settings.feedType = 'card'
			user.markModified('settings')
			user.save()
			.then(result => res.json({success: true}))
			.catch(err => res.status(400).json({error: 'There has been an error'}))
		}
		catch(err){
			res.status(400).json({error: 'There has been an error'})
		}
	}
	else {
		res.status(400).json({error: 'There has been an error'})
	}
})


app.get('/api/u/:user', (req, res) => {
	UserModel.findOne({userNameLower: req.params.user.toLowerCase()})
	.then(result => {
		res.json(result)
	})
	.catch(err => console.log(err))
})

app.get('/api/u/:user/:postID', (req, res) => {
	UserModel.findOne({userNameLower: req.params.user.toLowerCase()})
	.then(result => {
		result.posts = [req.params.postID]
		res.json(result)
	})
})

app.listen(myPort, () => {
  console.log('SERVER RUNNING ON:', myPort);
})