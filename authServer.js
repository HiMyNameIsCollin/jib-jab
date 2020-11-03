const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const {mongoose, loginSchema, userSchema, tokenSchema} = require('./mongoose')
const url = 'mongodb://127.0.0.1:27017/jibjab'

mongoose.connect(url, { useNewUrlParser: true })

const conn = mongoose.connection
let LoginModel 
let UserModel 
let TokenModel 

conn.once('open', () => {
	console.log('Database connected', url)
	LoginModel = conn.model('logins', loginSchema)
	UserModel = conn.model('users', userSchema)
	TokenModel = conn.model('tokens', tokenSchema)
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
				id: '1',
				userName,
				userNameLower: userName.toLowerCase(),
				hash: password,
				email, 
			})
			user.save().then(() => {
				const user = new UserModel({
					userName,
					communities: [],
					karma: 1,
					followers: [],
					settings: {
						feedType: 'list'
					}
				})
				user.save().then(() => res.json({success: true}))
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
				const accessToken = generateAccessToken(user)
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

app.post('/api/token', (req, res) => {
	const refreshToken = req.body.token
	if(refreshToken === null) return res.sendStatus(401)
	TokenModel.findOne({token: refreshToken})
	.then(result => {
		if(!result) return res.sendStatus(403)
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
			if(err) return res.sendStatus(403)
			const accessToken = generateAccessToken({userName: user.userName})
			console.log(user.userName, accessToken)
			res.json(accessToken)

		})
	})
})

function generateAccessToken(user) {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1m'})
}

app.listen(myPort, () => {
  console.log('SERVER RUNNING ON:', myPort);
})