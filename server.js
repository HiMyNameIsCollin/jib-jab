const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const routes = require('./routes/routes')
const app = express()
const myPort = process.env.PORT || 3000

/*MiddleWare*/
app.use(cors())
app.use(bodyParser.json())
app.use('/api', routes)

if(process.env.NODE_ENV === 'production'){
	app.use(express.static('client/build'))
	app.get('*', (req, res) => {
		res.sendFile(path.resolve('client', 'build', 'index.html'))
	})

}



app.listen(myPort, () => {
  console.log('SERVER RUNNING ON:', myPort);
})