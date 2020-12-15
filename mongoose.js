const mongoose = require('mongoose')

const Schema = mongoose.Schema

const postReportSchema = new Schema({
	user: String,
	reportOption: String,
	reportReason: String,
	community: String, 
	post: Object,
	id: String,
	postStatus: String,
	moderatedBy: String,
})

const communitySchema = new Schema({
	communityName: String,
	communityNameLower: String,
	followers: Array,
	moderators: Array,
	communities: Array,
	posts: Array,
	settings: Object,
	configuration: Object,
	createdOn: String,
	modMail: Array,
	modLogs: Array
})

const loginSchema = new Schema({
	userName: String,
	userNameLower: String,
	hash: String, 
	email: String,
	cookie: String
})

const messageSchema = new Schema({
	type: String,
	subject: String,
	body: String, 
	sender: String,
	recipient: Array,
	time: String,
	id: String, 
	seen: Boolean
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
	unseenMessages: Object
})

const postSchema = new Schema({
	postStatus: String,
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
	reports: Array
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
	communitySchema,
	messageSchema,
	postReportSchema
}