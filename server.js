const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const {mongoose,loginSchema, userSchema, postSchema} = require('./mongoose')

const app = express()

const myPort = process.env.PORT || 3000

/*MiddleWare*/
app.use(cors())
app.use(bodyParser.json())


app.get('/', (req, res) => {
	console.log(123)
})

app.listen(myPort, () => {
  console.log('SERVER RUNNING ON:', myPort);
})