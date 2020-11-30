import React, { useState, useEffect } from 'react'
import Post from '../post/Post'
import CommentFeed from './CommentFeed'
import Loading from '../loading/Loading'
import CommentForm from './CommentForm'
import './_postExpanded.sass'

const PostExpanded = ({Link, user, setUser, windowWidth, pageContent, pageType, overlayIsOpen, setOverlay, setError}) => {

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

	const handleVote = (postID, request) => {
  		const accessToken = window.localStorage.getItem('accessToken')
		fetch('http://localhost:3000/api/vote', {
			method: 'post',
			headers: {
				authorization: `Bearer ${accessToken}`,
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify({
				postID,
				request,
			})
		})
		.then(response => response.json())
		.then(response => {
			let updatedPosts = [...posts]
			updatedPosts.forEach((p, i) => {
				if(p.id === response.id){
					updatedPosts[i] = response
				}
			})
			setPosts(updatedPosts)
		})
		.catch(err => console.log(err))
	}


	const handleCommentVote = (postId, commentId, request) => {
		if(user.userName !== '') {
	  		const accessToken = window.localStorage.getItem('accessToken')
			fetch('http://localhost:3000/api/comment/vote', {
				method: 'post',
				headers: {
					authorization: `Bearer ${accessToken}`,
					'Content-Type' : 'application/json'
				},
				body: JSON.stringify({
					postId,
					commentId,
					request,
				})
			})
			.then(response => response.json())
			.then(response => {
				let updatedPosts = [...posts]
				updatedPosts.forEach((p, i) => {
					if(p.id === response.id){
						updatedPosts[i] = response
					}
				})
				setPosts(updatedPosts)
			})
			.catch(err => console.log(err))
			} else {
				setError('Must be logged in to vote')
			}
	}


	const [mainCommentInFocus, setMainCommentInFocus] = useState(false)
	const [posts, setPosts] = useState(undefined)
	
	if(posts !== undefined){
		return(
			<div className='postExpanded'>
				<Post 
				pageContent={pageContent}
				pageType={pageType} 
				postView={'open'} 
				user={user} 
				setUser={setUser} 
				Link={Link} 
				windowWidth={windowWidth} 
				post={posts[0]} 
				handleVote={handleVote}/>
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
					<CommentForm 
					func={setMainCommentInFocus} 
					value={mainCommentInFocus} 
					post={posts[0]}
					setPosts={setPosts}/>

				}
				{
					
					posts[0].comments.length > 0 ?
					<CommentFeed 
					pageContent={pageContent}
					handleCommentVote={handleCommentVote} 
					post={posts[0]} 
					user={user}
					setError={setError}
					setPosts={setPosts}
					Link={Link}/> :
					<p style={{padding: '1em'}}> Be the first to leave a comment! </p>
				}

				
			</div>

		)
	} else {
		return <Loading />
	}
}

export default PostExpanded