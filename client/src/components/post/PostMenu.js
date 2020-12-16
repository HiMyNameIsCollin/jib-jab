import React from 'react'

const PostMenu = ({post, Link, user, setReportOverlayIsOpen, pageContent, setMessage, setLoading, history}) => {

	const handleSharePost = () => {
		console.log('handleSharePost')
	}

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
				postId: post.id
			})
		})
		.then(response => response.text())
		.then(response => {
			setMessage(response)
			setLoading(false)
		})
		.catch(err => {
			setMessage('There seems to have been an error')
			setLoading(false)
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
				post: post
			})
		})
		.then(response => response.json())
		.then(response => {
			if(post.communityName === post.userName){
				history.push(`/u/${post.userName}`)
			} else {
				history.push(`/c/${post.communityName}`)
			}
			setLoading(false)
		})
		.catch(err => {
			setLoading(false)
			setMessage('There has been an error')
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
				post: post
			})
		})
		.then(response => response.json())
		.then(response => {
			setLoading(false)
			if(post.communityName === post.userName){
				history.push(`/u/${post.userName}`)
			} else {
				history.push(`/c/${post.communityName}`)
			}
		})
		.catch(err => {
			setMessage('There seems to have been an error')
		})
	}

	return(
		<div className='container postMenu'>
			<div onClick={handleSharePost}>
				<i class="fa fa-share-square"></i>
				<span> Share </span>
			</div>
			<div>
				<Link to={`/u/${post.user}`} className='link'>
					<i class="fa fa-users"></i>
					<span> {post.userName}'s profile </span>
				</Link>
			</div>
			{
				user.userName !== '' ?
				post.postStatus === 'active' ?
				<React.Fragment>
					<div onClick={handleSavePost}>
						<i class="fa fa-bookmark-o"></i>
						<span> Save</span>
					</div>
					{
						post.postStatus === 'active' ?
						<div onClick={() => {
							setReportOverlayIsOpen({type: 'post', post: post})
						}}>
							<i class="fas fa-flag"></i>
							<span> Report</span>
						</div> :
						null
					}
					{
						user.userName === post.userName ?
						<div onClick={handleDeletePost}>
							<i class="fas fa-trash"></i>
							<span> Delete post </span>
						</div> :
						pageContent.moderators ?
						pageContent.moderators.includes(user.userName) ?
						<div onClick={handleModRemovePost}>
							<i class="fas fa-trash"></i>
							<span> Remove post </span>
						</div> :
						null : null
					}

				</React.Fragment> :
				null : null
			}

		</div>
	)
}

export default PostMenu