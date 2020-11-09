const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const {mongoose, postSchema, tokenSchema, userSchema, communitySchema} = require('./mongoose')
const url = 'mongodb://127.0.0.1:27017/jibjab'

mongoose.connect(url, { useNewUrlParser: true })

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

app.get('/popular', (req, res) => {
	res.json({
		success: true
	})
})


/*GET COMMUNITY DATA AND POSTS */
app.get('/api/c/:communityName/', (req, res) => {
	if(req.params.communityName !== 'global'){
		PostModel.find({communityName: req.params.communityName.toLowerCase()})
		.then((posts) => {
			CommunityModel.findOne({communityNameLower: req.params.communityName.toLowerCase()})
			.then((community) => {
				res.json({community, posts})
			})
			.catch(err => console.log(err))
		})
		.catch(err => console.log(err))
	}else {
		PostModel.find()
		.then((posts) => {
			CommunityModel.findOne({communityNameLower: 'global'})
			.then((community) => res.json({community, posts}))
			.catch(err => console.log(err))
		})
	}
})

/*GET INDIVIDUAL POST*/
app.get('/api/p/:communityName/:postID', (req, res) => {
	PostModel.find({id: req.params.postID})
	.then(posts => {
		CommunityModel.findOne({communityNameLower: req.params.communityName.toLowerCase()})
		.then(community => {
			console.log(posts, community)
			res.json({posts, community})
		})
	})
	.catch(err => console.log(err))
})

/*GET COMMUNITY IMAGE*/
app.get('/img/:communityName' , (req, res) => {
	if(req.params.communityName === 'global') return res.json('https://robohash.org/4')
	CommunityModel.findOne({communityNameLower: req.params.communityName })
	.then((result) => res.json(result.configuration.communityImg))
	.catch(err => console.log(err))
})

app.get('/api/u/:user', (req, res) => {
	console.log('user')
	UserModel.findOne({userNameLower: req.params.user.toLowerCase()})
	.then(userProfile => {
		res.json(userProfile)
	})
	.catch(err => console.log(err))
})

app.listen(myPort, () => {
  console.log('SERVER RUNNING ON:', myPort);
})