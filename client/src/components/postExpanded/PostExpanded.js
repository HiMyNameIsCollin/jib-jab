import React, { useState, useEffect } from 'react'
import Post from '../post/Post'
import CommentFeed from './CommentFeed'
import Loading from '../loading/Loading'
import CommentForm from './CommentForm'
import './_postExpanded.sass'

const PostExpanded = ({Link, location,  user, setUser, windowWidth, pageContent, pageType, overlayIsOpen, setOverlay, setMessage, history, setReportOverlayIsOpen, setLoading}) => {

	const PostMenuBar = () => {

		const handleSavePost = () => {
			const accessToken = window.localStorage.getItem('accessToken')
			setLoading(true)
			fetch('https://jibjab.herokuapp.com/api/savePost', {
				method: 'post',
				headers: {
					'Content-Type' : 'application/json',
					authorization: `Bearer ${accessToken}`			
				},
				body: JSON.stringify({
					postId: posts[0].id
				})
			})
			.then(response => response.text())
			.then(response => {
				setMessage(response)
				setLoading(true)
			})
			.catch(err => {
				setMessage('There seems to have been an error')
				setLoading(true)
			})
		}

		const handleDeletePost = () => {
			setLoading(true)
			const accessToken = window.localStorage.getItem('accessToken')
			fetch('https://jibjab.herokuapp.com/api/deletePost', {
				method: 'post',
				headers: {
					'Content-Type' : 'application/json',
					authorization: `Bearer ${accessToken}`
				},
				body: JSON.stringify({
					post: posts[0]
				})
			})
			.then(response => response.json())
			.then(response => {
				if(posts[0].communityName === posts[0].userName){
					history.push(`/u/${posts[0].userName}`)
				} else {
					history.push(`/c/${posts[0].communityName}`)
				}
				setLoading(false)
			})
			.catch(err => {
				setMessage('There has been an error')
				setLoading(false)
			})
		}

		const handleModRemovePost = () => {
			const accessToken = window.localStorage.getItem('accessToken')
			fetch('https://jibjab.herokuapp.com/api/mod/deletePost', {
				method: 'post',
				headers: {
					'Content-Type' : 'application/json',
					authorization: `Bearer ${accessToken}`
				},
				body: JSON.stringify({
					post: posts[0]
				})
			})
			.then(response => response.json())
			.then(response => {
				setLoading(false)
				if(posts[0].communityName === posts[0].userName){
					history.push(`/u/${posts[0].userName}`)
				} else {
					history.push(`/c/${posts[0].communityName}`)
				}
			})
			.catch(err => {
				setLoading(false)
				setMessage('There seems to have been an error')
			})
		}

		return(
			<div className='postMenuBar container'>
				{
					user.userName !== '' ? 
					<React.Fragment>
						<div onClick={handleSavePost}>
							<i className="fa fa-bookmark-o"></i>
							<span> Save</span>
						</div>
						{
							posts[0].postStatus === 'active' ?
							<React.Fragment>
							<div onClick={() => setReportOverlayIsOpen({type: 'post', post: posts[0]})}>
								<i className="fas fa-flag"></i>
								<span> Report</span>
							</div>	
						{
							user.userName === posts[0].userName ?
							<div onClick={handleDeletePost}>
								<i className="fas fa-trash"></i>
								<span> Delete </span>
							</div> :
							pageContent.moderators ?
							pageContent.moderators.includes(user.userName) ?
							<div onClick={handleModRemovePost}>
								<i className="fas fa-trash"></i>
								<span> Remove </span>
							</div> :
							null : null
						}
							</React.Fragment>:
							null					
						}

	
					<div>
						<i className="fa fa-share-square"></i>
						<span> Share </span>
					</div>				
					</React.Fragment> :
					<div style={{margin: '0 1em 0 auto'}}>
						<i className="fa fa-share-square"></i>
						<span> Share </span>
					</div>
				}
			</div>
		)
	}
	


	const handleVote = (postID, postUserName, request) => {
		console.log(postID)
		if(user.userName !== ''){
	  		const accessToken = window.localStorage.getItem('accessToken')
			fetch('https://jibjab.herokuapp.com/api/vote', {
				method: 'post',
				headers: {
					authorization: `Bearer ${accessToken}`,
					'Content-Type' : 'application/json'
				},
				body: JSON.stringify({
					postID,
					postUserName, 
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
			.catch(err => {
				console.log(err)
				setMessage('There seems to have been an error')
			})			
		} else {
			setMessage('You must be logged in to vote')
		}

	}


	const handleCommentVote = (postId, commentId, request) => {
		if(user.userName !== '') {
	  		const accessToken = window.localStorage.getItem('accessToken')
			fetch('https://jibjab.herokuapp.com/api/comment/vote', {
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
			setPosts(undefined)
			fetch('https://jibjab.herokuapp.com/api/p/', {
				method: 'post',
				headers: {'Content-Type' : 'application/json'}, 
				body: JSON.stringify({
					posts: pageContent.posts,
				})
			})
			.then(response => response.json())
			.then(response => {
				if(response[0].communityName === pageContent.communityName || response[0].communityName === pageContent.userName ){
					let path = location.pathname.split('/')
					if(path.length < 5){
						setPosts(response)
					} else {
						let comment 
						function findComment(comments, id){
							comments.map((m, i) => {
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
				} else{
					history.push('/')
					setMessage('There is nothing to see there...')
				}

			})
			.catch(err => {
				setMessage('There doesnt seem to be anything here')
				history.push('/')
			})
	}, [location, Link])

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
				handleVote={handleVote}
				history={history}
				setMessage={setMessage}/>
				{
					posts[0].postStatus === 'active' ?
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
						<input type='text' placeholder='Submit a comment' onClick={() =>setMainCommentInFocus(true) }/>
					</div> :
					<CommentForm
					location={location} 
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