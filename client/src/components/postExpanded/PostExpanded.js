import React, { useState, useEffect } from 'react'
import Post from '../post/Post'
import CommentFeed from './CommentFeed'
import './_postExpanded.sass'
const PostExpanded = ({Link, user, windowWidth, pageType}) => {


let postData = {
	info: {
		userName: 'name',
		time: '3hrs'
	},
	karma: 1,
	comments: [
		{
			commentInfo: {
				userName: 'name',
				time: '1hrs'
			},
			commentContent: 'LoremBlah No child',
			comments: []
		},
		{
			commentInfo: {
				userName: 'name',
				time: '2hrs'
			},
			commentContent: 'LoremBlah1',
			comments: [
				{
					commentInfo: {
						userName: 'name',
						time: '2hrs'
					},
					commentContent: 'LoremBlah1 child',
					comments: []
				},
				{
					commentInfo: {
						userName: 'name',
						time: '2hrs'
					},
					commentContent: 'LoremBlah1 child',
					comments: [
						{
							commentInfo: {
								userName: 'name',
								time: '2hrs'
							},
							commentContent: 'LoremBlah1 child child',
							comments: [
							{
								commentInfo: {
									userName: 'name',
									time: '2hrs'
								},
								commentContent: 'LoremBlah1 child child',
								comments: [
								{
									commentInfo: {
										userName: 'name',
										time: '2hrs'
									},
									commentContent: 'LoremBlah1 child child',
									comments: [
									{
										commentInfo: {
											userName: 'name',
											time: '2hrs'
										},
										commentContent: 'LoremBlah1 child child',
										comments: [
											{
												commentInfo: {
													userName: 'name',
													time: '2hrs'
												},
												commentContent: 'LoremBlah1 child child',
												comments: [
												
												],
											},
										],
									},
									],
								},
								],
							},
							],
						},
						{
							commentInfo: {
								userName: 'name',
								time: '2hrs'
							},
							commentContent: 'LoremBlah1 child child 2',
							comments: [
							
							],
						},
					],
				},
				{
					commentInfo: {
						userName: 'name',
						time: '2hrs'
					},
					commentContent: 'LoremBlah1 child',
					comments: []
				},
			],
		},
		{
			commentInfo: {
				userName: 'name',
				time: '1hrs'
			},
			commentContent: 'LoremBlah2',
			comments: [
				{
					commentInfo: {
						userName: 'name',
						time: '2hrs'
					},
					commentContent: 'LoremBlah2 child',
					comments: [
						{
							commentInfo: {
								userName: 'name',
								time: '2hrs'
							},
							commentContent: 'LoremBlah2 child child LoremBlah2 child child LoremBlah2 child child LoremBlah2 child childLoremBlah2 child child LoremBlah2 child childLoremBlah2 child child LoremBlah2 child childLoremBlah2 child child LoremBlah2 child childLoremBlah2 child child LoremBlah2 child child',
							comments: [
							
							],
						},
					],
				},
			],
		},
	],
}




const LeaveACommentBox = () => {
	return(
		<div className='commentBox'>

		</div>
	)
}

const PostMenuBar = () => {
	return(
		<div className='postMenuBar container'>
			<span> {postData.comments.length} Comments </span>
			<div>
				<i className="fas fa-bars"></i>
				<span> Share </span>
			</div>
			{
				user.userName !== '' ? 
				<React.Fragment>
					<div>
						<i className="fas fa-bars"></i>
						<span> Save</span>
					</div>
					<div>
						<i className="fas fa-bars"></i>
						<span> Report</span>
					</div>					
				</React.Fragment> :
				null
			}
		</div>
	)
}


	return(
		<div className='postExpanded'>
			<Post pageType={pageType} postType={'enlarged'} user={user} Link={Link} windowWidth={windowWidth}/>
			{
				windowWidth > 920 ?
				<PostMenuBar /> :
				null
			}
			{
				user.userName !== '' ?
				<LeaveACommentBox /> :
				<div className='commentLoginBox container'>
					<p> Login or register to comment </p>
					<span>Login</span>
					<span> Register</span>
				</div>
			}
			<CommentFeed postData={postData} />
			
		</div>

	)
}

export default PostExpanded