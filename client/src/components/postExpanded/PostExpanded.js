import React, { useState, useEffect } from 'react'
import Post from '../post/Post'
import CommentFeed from './CommentFeed'
import Loading from '../loading/Loading'
import './_postExpanded.sass'
const PostExpanded = ({Link, user, windowWidth, pageContent, pageType, overlayIsOpen, setOverlay}) => {
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
	const [posts, setPosts] = useState(undefined)
	
	useEffect(() => {
			fetch('http://localhost:3000/api/p/', {
				method: 'post',
				headers: {'Content-Type' : 'application/json'}, 
				body: JSON.stringify({
					posts: pageContent.posts,
				})
			})
			.then(response => response.json())
			.then(response => setPosts(response))
			.catch(err => console.log)
	}, [])



	const PostMenuBar = () => {
		return(
			<div className='postMenuBar container'>
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
					<div>
						<i className="fas fa-bars"></i>
						<span> Share </span>
					</div>				
					</React.Fragment> :
					<div style={{margin: '0 1em 0 auto'}}>
						<i className="fas fa-bars"></i>
						<span> Share </span>
					</div>
				}
			</div>
		)
	}


	const CommentForm = () => {
		return(
			<div className='commentForm '>
				<textarea rows='4'/>
				<div className='container'>
					<span onClick={() =>  setMainCommentInFocus(!mainCommentInFocus)} > X </span>
					<input type='button' value='Add comment'/>
				</div>
			</div>
		)
	}

	
	if(posts !== undefined){
		return(
			<div className='postExpanded'>
				<Post pageType={pageType} postType={'enlarged'} user={user} Link={Link} windowWidth={windowWidth} post={posts[0]}/>
				{
					windowWidth > 920 ?
					<PostMenuBar /> :
					null
				}
				{
					user.userName === '' ?
					<div className='commentLoginBox container'>
						<p> Login or register to comment </p>
						<span onClick={() => setOverlay('login')} >Login</span>
						<span onClick={() => setOverlay('register')}> Register</span>
					</div> :
					!mainCommentInFocus ?
					<div className='leaveACommentBox container'>
						<img src="https://robohash.org/1" alt=""/>
						<input type='text' value='Submit a comment' onClick={() =>setMainCommentInFocus(true) }/>
					</div> :
					<CommentForm />

				}
				{
					posts[0].comments.length > 0 ?
					<CommentFeed comments={posts.comments} /> :
					<p style={{padding: '1em'}}> Be the first to leave a comment! </p>
				}

				
			</div>

		)
	} else {
		return <Loading />
	}
}

export default PostExpanded