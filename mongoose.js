const mongoose = require('mongoose')

const Schema = mongoose.Schema


const loginSchema = new Schema({
	id: String,
	userName: String,
	userNameLower: String,
	hash: String, 
	email: String,
	cookie: String
})

const userSchema = new Schema({
	userName: String,
	communities: Array,
	karma: Number,
	followers: Array,
	settings: Object,

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

const tokenSchema = new Schema({
	token: String
})

module.exports = {
	mongoose,
	loginSchema,
	userSchema,
	postSchema,
	tokenSchema
}