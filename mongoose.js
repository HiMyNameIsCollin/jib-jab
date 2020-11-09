const mongoose = require('mongoose')

const Schema = mongoose.Schema

const communitySchema = new Schema({
	communityName: String,
	followers: Array,
	moderators: Array,
	posts: Array,
	settings: Object,
	configuration: Object,
	createdOn: String
})

const loginSchema = new Schema({
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
	community: String,
	comments: Array,
	image: String,
	reactions: Array,
	text: String,
	title: String,
	time: String,
	user: String,
	karma: Number,
	id: String
})

const tokenSchema = new Schema({
	token: String
})

module.exports = {
	mongoose,
	loginSchema,
	userSchema,
	postSchema,
	tokenSchema,
	communitySchema
}