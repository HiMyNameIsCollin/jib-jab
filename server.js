const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto')
const multer  = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
require('dotenv').config()
const {mongoose, postSchema, tokenSchema, userSchema, communitySchema, messageSchema} = require('./mongoose')
const url = 'mongodb://127.0.0.1:27017/jibjab'
const app = express()
const path = require("path")
const myPort = process.env.PORT || 3000

/*MiddleWare*/
app.use(cors())
app.use(bodyParser.json())

/*Declare DB and Stream*/
let conn
let gfs 
/*Declare Mongo Models*/
let PostModel
let UserModel
let CommunityModel
let MessageSchem

conn = mongoose.createConnection(url, { useNewUrlParser: true , useFindAndModify: false })

conn.once('open', () => {
	console.log('Database connected', url)
	PostModel = conn.model('posts', postSchema)
	UserModel = conn.model('users', userSchema)
	CommunityModel = conn.model('communities', communitySchema)
	MessageModel = conn.model('messages', messageSchema)
	gfs = Grid(conn.db, mongoose.mongo)
	gfs.collection('uploads')
})

conn.on('error', () => {
	console.log('Database error' , url)
})

/*Enable storage engine*/
let storage = new GridFsStorage({
	url: url,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if(err) {
					return reject(err)
				}
				const filename = buf.toString('hex') + path.extname(file.originalname);
				const fileInfo = {
					filename: filename,
					bucketName: 'uploads'
				}
				resolve(fileInfo)
			})
		})
	}
})

/*Initilize  file upload*/
const upload = multer({ storage }).single('myImage')


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
			} else if(type === 'age'){
				while((j > -1) && (current.age < newSortOrder[j].age)){
					newSortOrder[j+1] = newSortOrder[j]
					j--
				}
				newSortOrder[j+1] = current
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
				score: p.karma.upvotes.length - p.karma.downvotes.length - timeDifference(p.time, 'minutes')/60 ,
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

app.post('/api/', async (req, res) => {
	console.log(req.body)
	const communityQuery = req.body.communities.map((c, i) => c.toLowerCase())
	const followingQuery = req.body.following.map((f, i) => f.toLowerCase())
	const communities = await CommunityModel.find({
		communityNameLower: { $in: 
			communityQuery
		}
	})
	const users = await UserModel.find({
		userNameLower: { $in: 
			followingQuery
		}
	})
	const popularPage = await CommunityModel.findOne({communityName: 'Popular'})
	if(communities, users, popularPage){
		try{
			/*#Grab posts from subscribed communities*/
			let posts = []
			communities.map((c, i) => posts.push(...c.posts))
			users.map((u, i) => posts.push(...u.soapBox))
			popularPage.communities = req.body.communities
			popularPage.posts = posts
			res.json(popularPage)
		}
		catch(err){
			res.status(400).json({error: 'There has been an error'})
		}
	} else {
		console.log(123)
	}
})



/*GET COMMUNITY DATA  */
app.get('/api/c/:communityName/', async (req, res) => {
		const community = await CommunityModel.findOne({communityNameLower: req.params.communityName.toLowerCase()})
		if(community){
			try{
				if(community.communityNameLower !== 'global'){
					res.json(community)
				} else {
					/*JUSTIFICATION FOR GRABBING ALL POST IDS FROM THE COMMUNITIES AS OPPOSED TO JUST PUTTING POST IDS INTO GLOBAL
					WITH EVERY POST THAT GETS SUBMITTED IS BECAUSE I WANT TO GIVE THE OPTION FOR COMMUNITIES TO OPT OUT OF THE 
					GLOBAL PAGE*/
					const communities = community.communities.map((r, i) => r.toLowerCase())
					const soapBox = await PostModel.find({postType: 'soapBox'})
					const globalCommunities = await	CommunityModel.find({
						communityNameLower: { $in:
							communities
						}
					})
					if(soapBox && globalCommunities){
						try{
							globalCommunities.map((c, i) => {
								community.posts.push(...c.posts)
							})
							soapBox.map((p, i) => {
								community.posts.push(p.id)
							})
							res.json(community)
						}
						catch(err){
							res.sendStatus(400)
						}
					}
				}
			}
			catch(err){
				res.sendStatus(400)
			}
		}
})


/*GET COMMUNITY IMAGE*/
app.get('/api/c/img/:communityName' , (req, res) => {
	CommunityModel.findOne({communityNameLower: req.params.communityName })
	.then((result) => res.json(result.configuration.communityImg))
	.catch(err => console.log(err))
})

app.get('/api/p/img/:filename', async (req, res) => {
	gfs.files.findOne({filename: req.params.filename})
	.then(file => {
		const readstream = gfs.createReadStream(file.filename)
		readstream.pipe(res)
	})
	.catch(err => res.sendStatus(400))

})


/*COMMUNITY DATA FOR WHEN VIEWING A POST*/
app.get('/api/c/:communityName/:postID', (req, res) => {
	CommunityModel.findOne({communityNameLower: req.params.communityName.toLowerCase()})
	.then((pageContent) => {
		if(pageContent !== null){
			const posts = []
			posts.push(req.params.postID)
			pageContent.posts = posts
			res.json(pageContent)
		} else {
			res.sendStatus(400)
		}
	})
	.catch(err => console.log(err))
})


/*Catch all fetching posts*/
app.post('/api/p/', (req, res) => {
	if(req.body.posts.length > 1){
		PostModel.find({
			id: { $in: 
				req.body.posts
			}
		})
		.then(result => {
			if(result !== null){
				const posts = sortPosts(result, req.body.sortType, req.body.sortTypeCont)
				res.json(posts)			
			} else {
				res.sendStatus(400)
			}
		})
		.catch(err => {
			res.sendStatus(400)
		})
	} else if(req.body.posts.length === 1) { 
		PostModel.findOne({id: req.body.posts[0]})
		.then(result => {
			if(result !== null){
				const posts = [result]
				res.json(posts)
			}else {
				res.sendStatus(400)
			}
		})
		.catch(err => res.sendStatus(400))
	} else if(req.body.posts.length === 0){
		res.sendStatus(400)
	}
})

/*Route for top posts of the day and popular page's trending section*/
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

/*ROUTE FOR UPVOTING AND DOWNVOTING POSTS*/
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

/*SUBMIT A POST ROUTE*/
app.post('/api/c/:communityName/submit', authenticateToken, (req, res) => {
	upload(req, res, async (err) => {
		if(err) return res.sendStatus(400)
		let community = await CommunityModel.findOne({communityNameLower: req.params.communityName.toLowerCase()})
		let user = await UserModel.findOne({userName: req.user.userName})
		let imageRefs = []
		if(req.file){
			imageRefs.push(req.file.filename)
		} 
		let title
		let text
		if(req.body.data){
			title = req.body.data.postTitle
			text = req.body.data.postText
			link = req.body.data.link
		} else {
			title = req.body.postTitle
			text = req.body.postText
			link = req.body.link
		}
		if(user && community){
			console.log(user, community)
			try{
				const newPost = new PostModel({
					postType: 'community',
					communityName: community.communityName,
					communityNameLower: community.communityNameLower,
					comments: [],
					imageLink: req.body.imageLink ? req.body.imageLink : '',
					imageRefs: imageRefs,
					link: link,
					text: text,
					title: title,
					time: new Date(),
					userName: req.user.userName,
					karma: {upvotes: [req.user.userName], downvotes: []},
					id: uuidv4(),
					postTag: '',
				})
				community.posts.push(newPost.id)
				user.posts.push(newPost.id)
				community.markModified('posts')
				user.markModified('posts')
				community.save()
				user.save()
				newPost.save()
				.then(savedPost => res.send('Success'))
				.catch(err => sendStatus(400))
			}
			catch(err){
				res.sendStatus(400)
			}
		}
	})
})

/*SUBMIT A SOAPBOX POST ROUTE*/
app.post('/api/u/submit', authenticateToken, (req, res) => {
	upload(req, res, async (err) => {
		if(err) return res.sendStatus(400)
		let user = await UserModel.findOne({userName: req.user.userName})
		let imageRefs = []
		if(req.file){
			imageRefs.push(req.file.filename)
		} 
		let title
		let text
		if(req.body.data){
			title = req.body.data.postTitle
			text = req.body.data.postText
			link = req.body.data.link
		} else {
			title = req.body.postTitle
			text = req.body.postText
			link = req.body.link
		}
		if(user){
			console.log(user, req.body)
			try{
				const newPost = new PostModel({
					postType: 'soapBox',
					communityName: req.user.userName,
					communityNameLower: req.user.userName.toLowerCase(),
					comments: [],
					imageLink: req.body.imageLink ? req.body.imageLink : '',
					imageRefs: imageRefs,
					link: link,
					text: text,
					title: title,
					time: new Date(),
					userName: req.user.userName,
					karma: {upvotes: [req.user.userName], downvotes: []},
					id: uuidv4(),
					postTag: ''
				})
				user.soapBox.push(newPost.id)
				user.markModified('soapBox')
				user.save()
				newPost.save()
				.then(res.send('Success'))
				.catch(err => console.log(err))
			}
			catch(err){
				res.sendStatus(400)
			}

		}
	})
})

/*SUBMIT A COMMENT ROUTE*/
app.post('/api/comment/submit' , authenticateToken, async (req, res) => {
	const {postId, commentId, commentContent } = req.body
	const userName = req.user.userName
	const time = new Date()
	const newComment = {
		commentInfo: {
			userName,
			time: time.toString(),
			id: uuidv4(),
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

/*ROUTE FOR VOTING ON A COMMENT*/
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

/*ROUTE FOR SUBSCRIBING TO A COMMUNITY*/
app.post('/api/c/subscribe', authenticateToken, async (req, res) => {
	const community = await CommunityModel.findOne({communityNameLower: req.body.communityName.toLowerCase()})
	const user = await UserModel.findOne({userName: req.user.userName})
	if(user && community) {
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
			res.status(400).json({error: 'There has been an error'})
		}
	} else {
		res.status(400).json({error: 'There has been an error'})
	}
})
/*ROUTE FOR FOLLOWING A USER*/
app.post('/api/u/subscribe', authenticateToken, async (req, res) => {
	console.log(req.body)
	const targetUser =  await UserModel.findOne({userNameLower: req.body.userName})
	const user = await UserModel.findOne({userName: req.user.userName})
	if(targetUser, user){
		try{
			if(req.body.request === 'subscribe'){
				targetUser.followers.push(user.userName)
				user.following.push(targetUser.userName)
			} else if (req.body.request === 'unsubscribe'){
				targetUser.followers.forEach((f, i) => {
					if(f === user.userName){
						targetUser.followers.splice(i, 1)
					}
				})
				user.following.forEach((f, i) => {
					if(f === targetUser.userName){
						user.following.splice(i, 1)
					}
				})
			}
			targetUser.markModified('followers')
			user.markModified('following')
			targetUser.save()
			.then( () => {
				user.save()
				.then(updatedUser => res.json(updatedUser))
			})		
		}
		catch(err){
			res.sendStatus(400)
		}
	}else{
		res.sendStatus(400)
	}
})

/*ROUTE FOR CHANGING USERS VIEW SETTING*/
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
		if(result !== null){
			res.json(result)
		} else {
			res.sendStatus(400)
		}
	})
	.catch(err => res.sendStatus(400))
})

app.get('/api/u/:user/:postID', (req, res) => {
	UserModel.findOne({userNameLower: req.params.user.toLowerCase()})
	.then(result => {
		result.posts = [req.params.postID]
		res.json(result)
	})
	.catch(err => res.sendStatus(400))
})

app.post('/api/search', async (req, res) => {
	const communities = await CommunityModel.find()
	const users = await UserModel.find()
	if(communities, users){
		let results = {
			communityArray: [],
			userArray: []
		}
		if(req.body.query.length > 0){
			communities.forEach((c, i) => {
				if(c.communityName !== 'Popular' && c.communityName !== 'Global'){
					if(c.communityNameLower.substr(0, req.body.query.length) === req.body.query.toLowerCase()){
						results.communityArray.push({name: c.communityName, image: c.configuration.communityImg, type: 'community'})
					}
				}
			})
			users.forEach((u, i) => {
					if(u.userNameLower.substr(0, req.body.query.length) === req.body.query.toLowerCase()){
						results.userArray.push({name: u.userName, image: u.configuration.image, type: 'soapBox'})
					}
			})
			res.json(results)
		}
	}
})

app.post('/api/message' , authenticateToken, async (req, res) => {
	const {target, subject, body, type } = req.body
	const targetUser = await UserModel.findOne({userName: target})
	const newMessage = new MessageModel({
		type: type,
		subject: subject,
		body: body,
		seen: false,
		time: new Date(),
		sender: req.user.userName,
		recipient: [target],
		id: uuidv4()
	})
	if(targetUser){
		try{
		targetUser.unseenMessages.push(newMessage.id)
		newMessage.save()
		targetUser.markModified('unseenMessages')
		targetUser.save()
		.then(res.send('Success'))
		} catch(err){
			res.status(400)
		}
	}
})

app.listen(myPort, () => {
  console.log('SERVER RUNNING ON:', myPort);
})