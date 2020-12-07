import React, { useState, useEffect } from 'react'
import Post from '../post/Post'
import CommentFeed from './CommentFeed'
import Loading from '../loading/Loading'
import CommentForm from './CommentForm'
import './_postExpanded.sass'

const PostExpanded = ({Link, location,  user, setUser, windowWidth, pageContent, pageType, overlayIsOpen, setOverlay, setMessage, history}) => {

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
				setMessage('Must be logged in to vote')
			}
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
			.then(response => {
				let path = location.pathname.split('/')
				if(path.length < 5){
					setPosts(response)
				} else {
					let comment 
					function findComment(comments, id){
						comments.map((m, i) => {
							console.log(m.commentInfo.id , id)
							if(m.commentInfo.id === id){
								comment = [m]
								return
							} else {
								if(m.comments.length > 0){
									findComment(m.comments, id)
								}
							}
						})
						return
					}
					findComment(response[0].comments, path[4])
					response[0].comments = comment
					setPosts(response)
				}

			})
			.catch(err => {
				setMessage('There doesnt seem to be anything here')
				history.push('/')
			})
	}, [location, setPosts])
	
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
				<PostMenuBar /> 
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
					setPosts={setPosts}
					setMessage={setMessage}/>

				}
				{
					
					posts[0] && posts[0].comments.length > 0 ?
					<CommentFeed 
					pageContent={pageContent}
					handleCommentVote={handleCommentVote} 
					post={posts[0]} 
					location={location}
					user={user}
					setMessage={setMessage}
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