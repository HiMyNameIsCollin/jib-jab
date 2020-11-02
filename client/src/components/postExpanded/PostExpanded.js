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
					commentContent: 'LoremBlah1 child2',
					comments: []
				},
				{
					commentInfo: {
						userName: 'name',
						time: '2hrs'
					},
					commentContent: 'LoremBlah1 child3',
					comments: [
						{
							commentInfo: {
								userName: 'name',
								time: '2hrs'
							},
							commentContent: 'LoremBlah1 child child4',
							comments: [
							{
								commentInfo: {
									userName: 'name',
									time: '2hrs'
								},
								commentContent: 'LoremBlah1 child child5',
								comments: [
								{
									commentInfo: {
										userName: 'name',
										time: '2hrs'
									},
									commentContent: 'LoremBlah1 child child6',
									comments: [
									{
										commentInfo: {
											userName: 'name',
											time: '2hrs'
										},
										commentContent: 'LoremBlah1 child child7',
										comments: [
											{
												commentInfo: {
													userName: 'name',
													time: '2hrs'
												},
												commentContent: 'LoremBlah1 child child8',
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

	const [mainCommentInFocus, setMainCommentInFocus] = useState(false)


const PostMenuBar = () => {
	return(
		<div className='postMenuBar container'>
			<div>
				<i className="fas fa-bars"></i>
				<span> Share </span>
			</div>
			{
				user.userName === '' ? 
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


const CommentForm = () => {
	return(
		<div className='commentForm '>
			<textarea rows='4'/>
			<div className='container'>
				<span > X </span>
				<input type='button' value='Add comment'/>
			</div>
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
				<div className='commentLoginBox container'>
					<p> Login or register to comment </p>
					<span>Login</span>
					<span> Register</span>
				</div> :
				!mainCommentInFocus ?
				<div className='leaveACommentBox container'>
					<img src="https://robohash.org/1" alt=""/>
					<input type='text' value='Submit a comment' onClick={() =>setMainCommentInFocus(true) }/>
				</div> :
				<CommentForm />

			}
			<CommentFeed postData={postData} />
			
		</div>

	)
}

export default PostExpanded