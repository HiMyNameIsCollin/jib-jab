import React, { useState, useEffect } from 'react'
import './_post.sass'


const Post = ({user, setUser, windowWidth, Link, postType, post, pageType, handleVote}) => {

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
				<i onClick={() => {
					openPostInfo(!postInfoIsOpen)
					openEnlargedWindow(false)
				}}className="fas fa-bars"></i> :
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

const PostMenu = () => {
	return(
		<div className='container postMenu'>
			<div>
				<i className="fas fa-bars"></i>
				<span> Share </span>
			</div>
			<div>
				<Link to={`/u/${post.user}`} className='link'>
					<i className="fas fa-bars"></i>
					<span> {post.user}'s profile </span>
				</Link>
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

const EnlargedPostImg = () => {
	return(
		<div className='container enlargedPostImg'>
			<Link to={`/c/${post.community}/${post.id}`}className='link'>
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
	return(
		<div className='container interactionWindow'>
			<span className='postInfoTimePosted'> 3hrs  </span>
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
				<span>{post.comments.length}</span> : <span>{post.comments.length}</span>
			}
				
				<i class="far fa-comment-dots"></i>
			</div>
		</div>
	)
}

const PostMeta= () => {

	return(
		<div className='container postMeta'>
		{
			windowWidth <= 920 ?
			<InteractionWindow /> :
			null
		}
		</div>
	)
}


	const [postInfoIsOpen, openPostInfo] = useState(false)
	const [enlargedImgOpen, openEnlargedWindow] = useState(false)

	useEffect(() => {
		if(user.settings.feedType === 'card'){
			openEnlargedWindow(true)
		} else if (user.settings.feedType === 'list'){
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
				<PostMenu/> :
				<React.Fragment>
					<PostContent Link={Link} enlargedImgOpen={enlargedImgOpen} openEnlargedWindow={openEnlargedWindow} user={user}/> 
					<PostMeta  user={user} windowWidth={windowWidth}/>
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