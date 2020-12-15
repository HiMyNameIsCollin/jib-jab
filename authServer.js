const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config()

const {mongoose, loginSchema, userSchema, tokenSchema, communitySchema} = require('./mongoose')
const url = 'mongodb://127.0.0.1:27017/jibjab'

mongoose.connect(url, { useNewUrlParser: true , useFindAndModify: false })

const conn = mongoose.connection
let LoginModel 
let UserModel 
let TokenModel 
let CommunityModel

conn.once('open', () => {
	console.log('Database connected', url)
	LoginModel = conn.model('logins', loginSchema)
	UserModel = conn.model('users', userSchema)
	TokenModel = conn.model('tokens', tokenSchema)
	CommunityModel = conn.model('communities', communitySchema)
})

conn.on('error', () => {
	console.log('Database error' , url)
})

const app = express()

const myPort = process.env.PORT || 4000

/*MiddleWare*/
app.use(cors())
app.use(bodyParser.json())


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