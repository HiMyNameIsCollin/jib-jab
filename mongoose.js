const mongoose = require('mongoose')

const Schema = mongoose.Schema

const loginSchema = new Schema({
	id: String,
	userName: String,
	hash: String, 
	email: String,
})

const userSchema = new Schema({
	userName: String,
	communities: Array,
	karma: Number,
	followers: Array
})

const postSchema = new Schema({
	comments: Array,
	image: String,
	reactions: Object,
	text: String,
	title: String,
	time: String,
	user: String,
	votes: Object
})



module.exports = {
	loginSchema,
	userSchema,
	postSchema,
}