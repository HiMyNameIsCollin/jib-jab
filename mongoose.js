const mongoose = require('mongoose')

const Schema = mongoose.Schema

const communitySchema = new Schema({
	communityName: String,
	communityNameLower: String,
	followers: Array,
	moderators: Array,
	communities: Array,
	posts: Array,
	settings: Object,
	configuration: Object,
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
	createdOn: String,
	userName: String,
	userNameLower: String,
	communities: Array,
	configuration: Object,
	karma: Number,
	posts: Array,
	soapBox: Array,
	followers: Array,
	following: Array,
	settings: Object,
	savedPosts: Array
})

const postSchema = new Schema({
	community: String,
	comments: Array,
	image: String,
	media: String,
	text: Array,
	title: String,
	time: String,
	user: String,
	karma: Object,
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