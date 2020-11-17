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

function timeDifference(date, dateType) {
	const dateNow = new Date()
	const postDate = new Date(date)
    let difference = dateNow.getTime() - postDate.getTime();
    let daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24

    let hoursDifference = Math.floor(difference/1000/60/60);
    difference -= hoursDifference*1000*60*60

    let minutesDifference = Math.floor(difference/1000/60);
    difference -= minutesDifference*1000*60

    let secondsDifference = Math.floor(difference/1000);

    if(dateType === undefined || 'default'){
    	return difference
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
	console.log(sortType)
	let newSortOrder = []
	if(sortType === 'spicy' || sortType === 'communities'){
		posts.forEach((p, i) => {
			newSortOrder.push({
				id: p.id,
				score: p.karma.upvotes - p.karma.downvotes + p.reactions.length * 2,
				age: timeDifference(p.time)
			})
		})
		let n = newSortOrder.length
		for(i = 0; i < n; i++){
			let current = newSortOrder[i]
			let j = i - 1
			while((j > -1)&& (current.score > newSortOrder[j].score)){
				newSortOrder[j+1] = newSortOrder[j]
				j--
			}
			newSortOrder[j+1] = current;
		}
		for(i = 0; i < n; i++){
			let current = newSortOrder[i]
			let j = i - 1
			while((j > -1)&& (current.score > newSortOrder[j].score) && (current.age > newSortOrder[j].age)){
				newSortOrder[j+1] = newSortOrder[j]
				j--
			}
			newSortOrder[j+1] = current;
		}
		const match = (raw, sorted) => (m => sorted.map(s => m.get(s.id)))(new Map(raw.map(r => [r.id, r])))
		const output = match(posts, newSortOrder)
		return output
	} else if (sortType === 'new'){
		
	} else if(sortType === 'soapBox'){

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

app.post('/api/p/', (req, res) => {
	console.log(req.body)
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
	} else {
		PostModel.findOne({id: req.body.posts[0]})
		.then(result => {
			const posts = [result]
			res.json(posts)
		})
		.catch(err => console.log(err))
	}
})


/*GET COMMUNITY IMAGE*/
app.get('/img/:communityName' , (req, res) => {
	CommunityModel.findOne({communityNameLower: req.params.communityName })
	.then((result) => res.json(result.configuration.communityImg))
	.catch(err => console.log(err))
})

app.get('/api/u/:user', (req, res) => {
	UserModel.findOne({userNameLower: req.params.user.toLowerCase()})
	.then(result => {
		res.json(result)
	})
	.catch(err => console.log(err))
})

app.post('/api/u/:user/:postID', (req, res) => {
	CommunityModel.findOne({communityName: 'Popular'})
	.then(pageContent => {
		const posts = []
		posts.push(req.params.postID)
		pageContent.communities = req.body.communities
		pageContent.posts = posts
		res.json(pageContent)
	})
	.catch(err => console.log(err))
})

app.listen(myPort, () => {
  console.log('SERVER RUNNING ON:', myPort);
})