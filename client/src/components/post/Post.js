import React, { useState, useEffect } from 'react'
import PostMenu from './PostMenu'
import './_post.sass'


const Post = ({user, setUser, windowWidth, Link, postType, post, pageType, handleVote, setError}) => {

		const handleSubscription = (communityName, request) => {
  		const accessToken = window.localStorage.getItem('accessToken')
		fetch('http://localhost:3000/api/c/subscription', {
			method: 'post',
			headers: {
				authorization: `Bearer ${accessToken}`,
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify({
				communityName,
				request,
			})
		})
		.then(response => response.json())
		.then(response => {
			console.log(response)
			setUser(response)
		})
		.catch(err => console.log(err))
	}
	
const PostInfo = () => {

	return(
		<div className='container postInfo'>
			{
				/*IF POST IS NOT OPEN OR SOAPBOX*/
				postType !== 'enlarged' || post.communityName !== post.user ?
				<span className='postInfoCommunityName'><Link className='link' to={`/c/${post.communityName}`}> {post.communityName}</Link></span>:
				null
			}
			{
				user.userName !== '' ?
				user.communities.includes(post.communityName) ?
				<span class='joinedCommunity' onClick={() => handleSubscription(post.communityName, 'unsubscribe') }> Unsubscribe </span> :
				<span class='joinCommunity' onClick={() => handleSubscription(post.communityName, 'subscribe')}> Subscibe </span> :
				null
			}

			{
				/*IF POST IS NOT OPEN AND LESS THAN TABLET RESOLUTION*/
				postType === 'enlarged' && windowWidth <= 576 ?
				<span className='postInfoUserName'><Link className='link' to={`/u/${post.user}`}> /u/{post.user} </Link></span> :
				null
			}
			{
				windowWidth > 576 ?
				<span className='postInfoUserName'><Link className='link' to={`/u/${post.user}`}> /u/{post.user} </Link></span> :
				null
			}
			{
				postType !== 'enlarged' ?
				user.userName === '' ?
				<i style={{margin: '0 .5em 0 auto'}}
				onClick={() => {
				openPostInfo(!postInfoIsOpen)
				openEnlargedWindow(false)}}
				className="fa fa-ellipsis-h"></i> :
				<i onClick={() => {
				openPostInfo(!postInfoIsOpen)
				openEnlargedWindow(false)}}
				className="fa fa-ellipsis-h"></i> : 
				null
			}	
		</div>
	)
}


const PostContent = () => {
	return(
		<div className='container postContent'>
			<p>
				{
					postType === 'enlarged' ? 
					`${post.title}` :
					pageType === 'profilePage' ?
					<Link to={`/u/${post.communityName}/${post.id}`} className='link'> 
						{post.title}
					</Link> :
					<Link to={`/c/${post.communityName}/${post.id}`} className='link'> 
						{post.title}
					</Link> 
				}
				
			</p>
			{
			 	 postType === 'enlarged' ? 
			 	 null :
			 	 user.settings.feedType === 'list' ?
			 	 post.image !== '' ?
				<img onClick={() => {
					openEnlargedWindow(!enlargedImgOpen)
				}} src={post.image} alt='Post image' /> :
				null : null
			}
		</div> 
	)
}



const EnlargedPostImg = () => {
	return(
		<div className='container enlargedPostImg'>
			<Link to={`/c/${post.communityName}/${post.id}`}className='link'>
				<img src={post.image} alt='Enlarged post image'/>
			</Link>
		</div>
	)
}

const EnlargedPostText = () => {
	return(
		<div className='container enlargedPostText' >
		<span> Post tag </span>	
		{
			post.text.map((t, i) =>  {
				return <p> {t} </p>
			})
		}
		</div>
	)
}


const InteractionWindow =() => {

	function timeDifference(date) {
		const dateNow = new Date()
		const postDate = new Date(date)
	    let difference = dateNow.getTime() - postDate.getTime();
	    let daysDifference = Math.floor(difference/1000/60/60/24);
	    let hoursDifference = Math.floor(difference/1000/60/60);
	    let minutesDifference = Math.floor(difference/1000/60);
	    let secondsDifference = Math.floor(difference/1000);
	   	if(daysDifference < 1){
	   		if(hoursDifference < 1){
	   			if(minutesDifference < 1){
	   				return '1m'
	   			} else {
	   				return `${minutesDifference}m`
	   			}
	   		} else if(hoursDifference < 25){
	   			return `${hoursDifference}h`
	   		}
	   	} else {
	   		return `${daysDifference}d`
	   	}
	}
	return(
		<div className='container interactionWindow'>
			<span className='postInfoTimePosted'> {timeDifference(post.time)} </span>
			<div className='container'>
			{
				post.karma.upvotes.includes(user.userName) ?
				<i onClick={() => handleVote(post.id, 'upvote')} class="fas fa-arrow-circle-up" style={{color: 'blue'}}></i>:
				<i onClick={() => handleVote(post.id, 'upvote')} class="fas fa-arrow-circle-up"></i>
			}
				<span> {post.karma.upvotes.length - post.karma.downvotes.length}</span>
			{
				post.karma.downvotes.includes(user.userName) ?
				<i onClick={() => handleVote(post.id, 'downvote')} class="fas fa-arrow-circle-down" style={{color: 'red'}}></i>:
				<i onClick={() => handleVote(post.id, 'downvote')} class="fas fa-arrow-circle-down"></i>
			}
			</div>
			<div className='container'>
			{
				windowWidth <= 920 ?
				postType === 'enlarged' ?
				null :
				<Link className='link container' to={`/c/${post.communityName}/${post.id}`}>{post.comments.length} <i class="far fa-comment-dots"></i></Link> : <Link className='link container' to={`/c/${post.communityName}/${post.id}`}>{post.comments.length} <i class="far fa-comment-dots"></i></Link>
			}
				
				
			</div>
		</div>
	)
}


/*#####################POST COMPONENT#########################################*/


	const [postInfoIsOpen, openPostInfo] = useState(false)
	const [enlargedImgOpen, openEnlargedWindow] = useState(false)

	useEffect(() => {
		if(user.settings.feedType === 'card'){
			openEnlargedWindow(true)
		} else if (user.settings.feedType === 'list' && postType !== 'enlarged'){
			openEnlargedWindow(false)
		}
	},[user])

	useEffect(() => {
		if(postType === 'enlarged'){
			openEnlargedWindow(true)
		}
	},[])

	return(
		<div className='post'>
			<PostInfo Link={Link} postInfoIsOpen={postInfoIsOpen} openPostInfo={openPostInfo} user={user} openEnlargedWindow={openEnlargedWindow}/>
			{
				postInfoIsOpen ?
				<PostMenu post={post} Link={Link} user={user}/> :
				<React.Fragment>
					<PostContent Link={Link} enlargedImgOpen={enlargedImgOpen} openEnlargedWindow={openEnlargedWindow} user={user}/> 
					<InteractionWindow />
				</React.Fragment>
			}
			{
				enlargedImgOpen && post.image !== '' ?
				<EnlargedPostImg /> :
				null
			}	
			{
				postType === 'enlarged' && post.text.length !== 0 ?
				<EnlargedPostText /> :
				null
			}
			{
				windowWidth > 920 ?
				<InteractionWindow /> :
				null
			}
		</div>
	)
}

export default Post