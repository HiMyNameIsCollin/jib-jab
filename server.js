const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const {mongoose, postSchema, tokenSchema, userSchema} = require('./mongoose')
const url = 'mongodb://127.0.0.1:27017/jibjab'

mongoose.connect(url, { useNewUrlParser: true })

const conn = mongoose.connection
let PostModel
let UserModel

conn.once('open', () => {
	console.log('Database connected', url)
	PostModel = conn.model('posts', postSchema)
	UserModel = conn.model('users', userSchema)
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
	console.log(req.user)
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

app.get('/popular/:id', (req, res) => {
	res.json({
		success: true
	})
})



app.listen(myPort, () => {
  console.log('SERVER RUNNING ON:', myPort);
})