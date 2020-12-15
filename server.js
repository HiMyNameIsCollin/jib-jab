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
const {mongoose, postSchema, tokenSchema, userSchema, communitySchema, messageSchema, loginSchema} = require('./mongoose')
const app = express()
const path = require("path")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const url = 'mongodb://127.0.0.1:27017/jibjab'
const myPort = process.env.PORT || 3000

/*MiddleWare*/
app.use(cors())
app.use(bodyParser.json())

app.use('/api/', routes)

if(process.env.NODE_ENV === 'production'){
	app.use(express.static('client/build'))

	app.get('/', (req, res) => {
		res.sendFile(path.resolve('client', 'build', 'index.html'))
	})
}
/*Declare DB and Stream*/
let conn
let gfs 
/*Declare Mongo Models*/
let PostModel
let UserModel
let CommunityModel
let MessageModel
let LoginModel
let TokenModel
/*Lies*/
conn = mongoose.createConnection(process.env.MONGODB_URI || url, { useNewUrlParser: true , useFindAndModify: false })

conn.once('open', () => {
	console.log('Database connected', url)
	PostModel = conn.model('posts', postSchema)
	UserModel = conn.model('users', userSchema)
	CommunityModel = conn.model('communities', communitySchema)
	MessageModel = conn.model('messages', messageSchema)
	LoginModel = conn.model('logins', loginSchema)
	TokenModel = conn.model('tokens', tokenSchema)
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

app.get('/api/refresh', authenticateToken, (req, res) => {
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
	.then((result) => res.json(result.configuration.image))
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

app.get('/api/c/:communityName/:postID/:commentID', (req, res) => {
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
	console.log(123)
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
		console.log(123)
		res.json([])
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
			let postsArray = []
			posts.map((p, i) => {
				if(i < 4){
					postsArray.push(p)
				}
			})
			res.json(postsArray)
		})
		.catch(err => console.log(err))
	})
})

/*ROUTE FOR UPVOTING AND DOWNVOTING POSTS*/
app.post('/api/vote', authenticateToken, async (req, res) => {
	let { request , postID, postUserName} = req.body
	let { userName } = req.user
	const post = await PostModel.findOne({id: postID})
	const targetUser = await UserModel.findOne({userNameLower: postUserName.toLowerCase()})
	if(post, targetUser){
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
					targetUser.karma = targetUser.karma + 1
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
					targetUser.karma = targetUser.karma - 1
				}
					targetUser.markModified('karma')
					targetUser.save()
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
					targetUser.karma = targetUser.karma - 1
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
					targetUser.karma = targetUser.karma + 1
				}
				targetUser.markModified('karma')
				targetUser.save()
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
		let link
		let imageLink
		if(req.body.data){
			title = req.body.data.postTitle
			text = req.body.data.postText
			link = req.body.data.link ? req.body.link : ''
			imageLink = req.body.data.imageLink ? req.body.data.imageLink : ''
		} else {
			title = req.body.postTitle
			text = req.body.postText
			link = req.body.link ? req.body.link : ''
			imageLink = req.body.imageLink ? req.body.imageLink : ''
		}
		if(imageLink !== '' && imageLink.substr(0, 7) !== 'http://'){
			if(imageLink.substr(0, 8) !== 'https://'){
				imageLink = `http://${imageLink}`
			}
		}
		if(user && community){
			if(community.configuration.postPermission === 'open' || 
			(community.configuration.postPermission === 'locked' && community.moderators.includes(req.user.userName))){
				try{
					const newPost = new PostModel({
						postStatus: 'active',
						postType: 'community',
						communityName: community.communityName,
						communityNameLower: community.communityNameLower,
						comments: [],
						imageLink:  imageLink,
						imageRefs: imageRefs,
						link: link,
						text: text,
						title: title,
						time: new Date(),
						userName: req.user.userName,
						karma: {upvotes: [req.user.userName], downvotes: []},
						id: uuidv4(),
						postTag: '',
						reports: []
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
			} else {
				res.send('You do not have permission to post there')
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
	let targetMentionedUser 

	const newComment = {
		commentInfo: {
			userName,
			time: time.toString(),
			id: uuidv4(),
		},
		commentContent,
		comments: [],
		karma: {
			upvotes: [userName],
			downvotes: []
		}
	}
	const post = await PostModel.findOne({id: postId.toString()})
	if(post){
		try{
			let target 
			const postComment = (comments, id, commentId, content) => {
				comments.map((c, i) => {
					if(c.commentInfo.id === commentId){
						c.comments.push(newComment)
						target = c.commentInfo.userName
						return
					} else { 
						postComment(c.comments, id, commentId, content)
					}
				})
				return 
			}
			if(commentId === 'parent'){
				post.comments.push(newComment)
				target = newComment.commentInfo.userName
			}else {
				postComment(post.comments, postId, commentId, commentContent)
			}
			const targetUser = await UserModel.findOne({userName: target})
			if(targetUser){
				post.markModified('comments')
				post.save()
				.then(result => {
					const newMessage = new MessageModel({
						type: 'reply',
						subject: `${userName} replied to you!`,
						body: `Ill figure out how to link to that soon enough. `, 
						sender: 'Jibbers the jabber',
						recipient: targetUser.userName,
						time: new Date() ,
						id: uuidv4(),
						seen: false
					})
					if(commentContent.includes('/u/')){
							let commentArray = commentContent.split(' ')
							let mentionedUsers = commentArray.filter((value) => {
								return value.includes('/u/')
							})
							mentionedUsers.forEach(async (u, i) => {
								targetMentionedUser = await UserModel.findOne({userNameLower: u.substr(3).toLowerCase()})
								if(targetMentionedUser){
								let mentionedMessage = new MessageModel({
									type: 'mentions',
									subject: `${userName} mentioned you!`,
									body: `Ill figure out how to link to that soon enough. `, 
									sender: 'Jibbers the jabber',
									recipient: targetMentionedUser.userName,
									time: new Date() ,
									id: uuidv4(),
									seen: false
								})
							
									mentionedMessage.save()
									.then((result => {
										targetMentionedUser.unseenMessages.mentions = true
										targetMentionedUser.markModified('unseenMessages')
										targetMentionedUser.save()	
									}))
								}
							})
						}
					newMessage.save()
					.then(savedMessage => {
						targetUser.unseenMessages.replies = true
						targetUser.markModified('unseenMessages')
						targetUser.save()
						.then(() => res.json([result]))
					})
				})
				.catch(err => {
					console.log(err)
					res.sendStatus(400)
				})
			} else {
				res.sendStatus(400)
			}

		}
		catch(err){
			res.sendStatus(400)
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
	const targetUser = await UserModel.findOne({userNameLower: post.userName.toLowerCase()})
	if(post, targetUser){
		try{
			if(request === 'upvote'){
				deepUpvote(post.comments, req.user.userName, commentId)
				targetUser.karma + 1
			} else if (request === 'downvote'){
				deepDownvote(post.comments, req.user.userName, commentId)
				targetUser.karma - 1
			}
			targetUser.markModified('karma')
			post.markModified('comments')
			targetUser.save()
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

app.post('/api/editProfile', authenticateToken, async (req, res) => {
	console.log(req.user.userName)
	console.log(req.body)
	const user = await UserModel.findOne({userName: req.user.userName})
	if(user){
		try{
			user.configuration.image = req.body.image !== '' ? req.body.image : `http://robohash.org/${req.user.userName}`,
			user.configuration.headerImg = req.body.headerImg !== '' ? req.body.headerImg : 'https://source.unsplash.com/random/800x1200'
			user.markModified('configuration')
			user.save()
			.then(savedUser => res.json({success: true}))
		}catch(err){
			res.sendStatus(400)
			console.log(err)
		}
	}
})

app.get('/api/manageCommunity/:communityName', async (req, res) =>{
	const community = await CommunityModel.findOne({communityNameLower: req.params.communityName.toLowerCase()})
	const posts = await PostModel.find({communityNameLower: req.params.communityName.toLowerCase()})
	if(community, posts){
		try{
			let reportedPosts = []
			posts.map((p, i) => {
				if(p.reports.length > 0) {
					reportedPosts.push(p)
				}
			})
			res.json({community: community, reportedPosts: reportedPosts})
		}catch(err){
			res.sendStatus(400)
		}
	} else{
		res.sendStatus(400)
	}
})

app.post('/api/manageCommunity/:communityName', async (req, res) => {
	const community = await CommunityModel.findOne({communityNameLower: req.params.communityName.toLowerCase()})
	const { data } = req.body
	console.log(data)
	if(community){
		if(req.body.request === 'banner'){
			community.configuration.image = req.body.data.image !== '' ? req.body.data.image : community.configuration.image
			community.configuration.headerImg = req.body.data.headerImg !== '' ? req.body.data.headerImg : community.configuration.headerImg
			community.configuration.postPermission = req.body.data.postPermission
			community.configuration.visibility = req.body.data.visibility
			community.markModified('configuration')
			community.save()
			.then(savedUser => res.json({success: true}))		
		} else if(req.body.request === 'widgets'){
			const {aboutWidget, communityListWidget, announcementWidget, rulesWidget, linkListWidget } = community.configuration.widgets
			aboutWidget.active = data.aboutWidgetActive
			aboutWidget.header = data.aboutWidgetHeader
			aboutWidget.body = data.aboutWidgetBody
			communityListWidget.active = data.communityListWidgetActive
			communityListWidget.header = data.communityListWidgetHeader
			announcementWidget.active = data.announcementWidgetActive
			announcementWidget.header = data.announcementWidgetHeader
			announcementWidget.body = data.announcementWidgetBody
			rulesWidget.active = data.communityRulesWidgetActive
			rulesWidget.header = data.communityRulesWidgetHeader
			rulesWidget.rules = data.communityRulesWidgetRules
			linkListWidget.active = data.linkListWidgetActive
			linkListWidget.header = data.linkListWidgetHeader
			linkListWidget.links = data.linkListWidgetLinks
			community.markModified('configuration')
			community.communities = data.communityListWidgetCommunities
			community.markModified('communities')
			community.save()
			.then(savedUser => res.json({success: true}))
		} else if(req.body.request === 'moderation'){

		}
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
						results.communityArray.push({name: c.communityName, image: c.configuration.image, type: 'community'})
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

app.get('/api/inbox/:type', authenticateToken, async (req, res) => {
	const type  = req.params.type
	const messages = await MessageModel.find()
	const user = await UserModel.findOne({userName: req.user.userName})
	if(messages, user){
		try{
			let inbox = {}
			if(type === 'user'){
				let sent = []
				let received = []
				messages.forEach((m, i) => {
					if(m.type === 'user'){
						m.recipient.map((r, j) => {
						if(r === user.userName){
							let reci = { ...m._doc}
							received.unshift(reci)
						}
						m.seen = true
						messages[i].markModified('seen')
						messages[i].save()
					})
					if(m.sender === user.userName){
							sent.unshift(m)
						}					
					}
				})
				inbox['received'] = received
				inbox['sent'] = sent
				user.unseenMessages.user = false
			} else if(type === 'replies'){
				let replies = []
				messages.forEach((m, i) => {
					if(m.type === 'reply'){
					m.recipient.map((r, j) => {
						if(r === user.userName){
							let reci = { ...m._doc}
							replies.unshift(reci)
						}
						m.seen = true
						messages[i].markModified('seen')
						messages[i].save()
						})
					}
				})
				inbox['replies'] = replies
				user.unseenMessages.replies = false
			} else if(type === 'mentions'){
				let mentions = []
				messages.forEach((m, i) => {
					if(m.type === 'mentions'){
						m.recipient.map((r, j) => {
							if(r === user.userName){
								let reci = { ...m._doc}
								mentions.unshift(reci)
							}
							m.seen = true
							messages[i].markModified('seen')
							messages[i].save()
						})						
					}

				})
				inbox['mentions'] = mentions
				user.unseenMessages.mentions = false
			}
			user.markModified('unseenMessages')
			user.save()
			res.json(inbox)
		}catch(err){
			console.log(err, 123)
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
		time: new Date(),
		sender: req.user.userName,
		recipient: [target],
		id: uuidv4(),
		seen: false
	})
	if(targetUser){
		try{
			if(type === 'user'){
				targetUser.unseenMessages.user = true
			}
			if(type === 'replies'){
				targetUser.unseenMessages.replies = true
			}
			if(type === 'mentions'){
				targetUser.unseenMessages.mentions = true
			}
		newMessage.save()
		targetUser.markModified('unseenMessages')
		targetUser.save()
		.then(res.send('Success'))
		} catch(err){
			res.status(400)
		}
	}
})

app.post('/api/createCommunity', authenticateToken, async (req, res) => {
	const { communityName, communityHeaderBlurb, image, headerImg, communityVisibility, postPermission} = req.body.pageOne
	const {aboutWidget, communityListWidget, announcementWidget, rulesWidget, linkListWidget}  = req.body.pageTwo
	const user = await UserModel.findOne({userName: req.user.userName})
	if(communityVisibility === 'public'){
		CommunityModel.findOneAndUpdate(
			{communityName: 'Global'},
			{ $push: { communities: communityName}}
		)
	}
	if(user){
		try{
			let relatedCommunities = []
			communityListWidget.communities.map((c, i) => {
				relatedCommunities.push(c)
			})
			const {communities, ...remaining} = communityListWidget
			const newCommunity = new CommunityModel({
				communityName: communityName,
				communityNameLower: communityName.toLowerCase(),
				followers: [req.user.userName],
				moderators: [req.user.userName],
				communities: relatedCommunities,
				posts: [],
				settings: {},
				modMail: [],
				modLogs: [], 
				configuration: {
					headerImg: headerImg,
					image: image,
					communityHeader: communityHeaderBlurb ,
					visibility: communityVisibility,
					postPermission: postPermission,
					widgets: {
						aboutWidget,
						communityListWidget: remaining, 
						announcementWidget,
						rulesWidget,
						linkListWidget			
					}

				},
				createdOn: new Date(),
			})
			newCommunity.save()	
			user.communities.push(communityName)
			user.markModified('communities')
			user.save()
			.then(savedUser => {
				req.body.moderators.map((m, i) => {
				const newMessage = new MessageModel({
					recipient: m.name,
					type: 'user',
					subject: `${communityName} invites you to be a moderator!`,
					body: `${req.user.userName} has invited you to become a moderator at ${communityName}, Click here to accept, if you have no interest in moderating this community, ignore this message`,
					time: new Date(),
					sender: req.user.userName,
					id: uuidv4(),
					seen: false
				})
				newMessage.save()
				.then(msg => console.log(msg))
				.catch(err => res.sendStatus(400))
			})
				res.json({success: true})
			})
		} catch(err){
			res.sendStatus(400)
		}			
	}

	
})

app.post('/api/reportPost' , authenticateToken, async (req, res) => {
	const post = await PostModel.findOne({id: req.body.postId})
	if(post){
		post.reports.push({
			reportedBy: req.user.userName,
			category: req.body.reportOption,
			reason: req.body.reportReason,
		})
		post.markModified('reports')
		post.save()
		.then(() => res.json({success: true}))
	} else{
		res.sendStatus(400)
	}
})


app.post('/api/reportComment' , authenticateToken, async (req, res) => {
	const community = await CommunityModel.findOne({communityNameLower: req.body.post.communityNameLower})
	if(community){
		console.log(req.body)
	} else{
		res.sendStatus(400)
	}
})

app.post('/api/deletePost', authenticateToken, async (req, res) => {
	const post = await PostModel.findOne({id: req.body.post.id})
	if(post){
		try{
			if(post.imageRefs.length > 0){
				console.log('need to remove images')
			}
			post.title = '-Deleted-'
			post.text = '-Deleted-'
			post.imageLink = ''
			post.link = ''
			post.postStatus = 'deleted'
			post.markModified('title')
			post.markModified('text')
			post.markModified('imageLink')
			post.markModified('link')
			post.markModified('postStatus')
			post.save()
			.then(() => res.json({success: true}))
		}catch(err){
			res.sendStatus(400)
		}
	} else{
		res.sendStatus(400)
	}
})

app.post('/api/mod/deletePost', authenticateToken, async (req, res) => {
	const post = await PostModel.findOne({id: req.body.post.id})
	const community = await CommunityModel.findOne({communityNameLower: req.body.post.communityNameLower})
	if(post, community){
		try{
			community.modLogs.push({
				postTitle: post.title,
				postID: post.id,
				poster: post.userName,
				removedBy: req.user.userName,
				numberOfReports: post.reports.length,
				timeOfRemoval: new Date()
			})
			community.markModified('modLogs')
			if(post.imageRefs.length > 0){
				console.log('need to remove images')
			}
			post.title = '-Removed-'
			post.text = '-Removed-'
			post.imageLink = ''
			post.link = ''
			post.postStatus = 'removed'
			post.markModified('title')
			post.markModified('text')
			post.markModified('imageLink')
			post.markModified('link')
			post.markModified('postStatus')
			community.save()
			post.save()
			.then(savedPost => {
				res.json(savedPost)
			})
		}catch(err){
			res.sendStatus(400)
			console.log('err')
		}
	} else {
		console.log('No results')
		res.sendStatus(400)
	}
})

app.post('/api/savePost', authenticateToken, async (req, res) => {
	const user = await UserModel.findOne({userName: req.user.userName})
	if(user){
		try{
			if(user.savedPosts.includes(req.body.postId)){
				res.send('Post already saved')
			} else {
				user.savedPosts.push(req.body.postId)
				user.markModified('savedPosts')
				user.save()
				.then(() => res.send('Post successfully saved'))				
			}

		}catch(err){
			res.sendStatus(400)
		}
	}
})




/*######################AUTHENTICATION STUFF#############################*/

app.post('/api/register', (req, res) => {
	const {userName, email, password } = req.body
	LoginModel.findOne({userNameLower: userName.toLowerCase()})
	.then(result => {
		if(result) {
			res.status(400).json('Username already taken') 
		} else {
			bcrypt.hash(password, saltRounds, function(err, hash) {
				const user = new LoginModel({
					userName,
					userNameLower: userName.toLowerCase(),
					hash: hash,
					email, 
				})
				user.save().then(() => {
					const user = new UserModel({
						userName,
						userNameLower: userName.toLowerCase(),
						communities: ['Announcements'],
						karma: 1,
						followers: [],
						following: ['Collin'],
						settings: {
							feedType: 'list'
						},
						createdOn: 'November 20th 2020',
						posts: [],
						soapBox: [],
						savedPosts: [],
						configuration: {
							image: 'http://robohash.org/12',
							headerImg: 'https://source.unsplash.com/random/800x1200'
						},
						unseenMessages: {
							user: [],
							replies: [],
							mentions: []
						}
					})
					user.save().then(() => {
						CommunityModel.findOneAndUpdate({'communityName': 'Announcements'}, {$push:{'followers': userName}})
						.then(() => res.json({success: true}))
					})
				})				
			});

		}
	})
})

app.post('/api/login', async (req, res) => {
	const {userName , password } = req.body
	const loginUser = await LoginModel.findOne({userNameLower: userName.toLowerCase()})
	if(loginUser){
		try{
			bcrypt.compare(password, loginUser.hash, function(err, result) { 
				if(err) res.sendStatus(400)
				UserModel.findOne({userName: loginUser.userName})
				.then(result => {
					let user = {userName: result.userName}
					const accessToken = generateAccessToken(user, 10)
					const refreshToken =  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
					const newToken = new TokenModel({
						token: refreshToken
					})
					console.log(3)
					newToken.save().then(() => res.json({result, accessToken, refreshToken}))
					})
			})
		}catch(err){
			res.sendStatus(400)
		}
	} else{
		res.sendStatus(400)
	}
})

app.delete('/api/logout', (req, res) => {
	TokenModel.findOneAndDelete({token: req.body.token})
	.then(result => {
		if(result !== null) {
			res.sendStatus(204)
		} else {
			res.sendStatus(400)
		}
	})
})

app.post('/api/token', (req, res) => {
	const refreshToken = req.body.token
	if(refreshToken === null) return res.sendStatus(401)
	TokenModel.findOne({token: refreshToken})
	.then(result => {
		if(result === null) return res.sendStatus(403)
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
			if(err) return res.sendStatus(403)
			const accessToken = generateAccessToken({userName: user.userName})
			UserModel.findOne({userName: user.userName})
			.then(result => {
				res.json({accessToken, result})
			})

			
		})
	})
})

function generateAccessToken(user) {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

app.listen(myPort, () => {
  console.log('SERVER RUNNING ON:', myPort);
})