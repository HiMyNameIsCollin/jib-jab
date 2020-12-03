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
	savedPosts: Array,
	inbox: Object
})

const postSchema = new Schema({
	postType: String,
	communityName: String,
	communityNameLower: String,
	comments: Array,
	imageLink: String,
	imageRefs: Array,
	link: String,
	text: String,
	title: String,
	time: String,
	userName: String,
	karma: Object,
	id: String,
	postTag: String,
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