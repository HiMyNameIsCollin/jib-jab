const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
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
			const user = new LoginModel({
				userName,
				userNameLower: userName.toLowerCase(),
				hash: password,
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
					image: 'http://robohash.org/12',
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

		}
	})
})

app.post('/api/login', (req, res) => {
	const {userName , password } = req.body
	LoginModel.findOne({userNameLower: userName.toLowerCase()})
	.then(result => {
		if(result && result.hash === password){
			UserModel.findOne({userName: result.userName})
			.then(result2 => {
				let user = {userName: result2.userName}
				const accessToken = generateAccessToken(user, 10)
				const refreshToken =  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
				const newToken = new TokenModel({
					token: refreshToken
				})
				newToken.save().then(result3 => res.json({result2, accessToken, refreshToken}))
			})
		} else {
			res.status(400).json('Incorrect credidentals')
		}
	})
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