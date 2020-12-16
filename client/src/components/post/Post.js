import React, { useState, useEffect } from 'react'
import PostMenu from './PostMenu'
import './_post.sass'
import timeDifference from '../../utils/timeDifference'

const Post = ({user, setUser, windowWidth, Link, postView, post, pageType, handleVote, setError, pageContent, setReportOverlayIsOpen, setMessage, setLoading, history}) => {

const PostInfo = () => {
	return(
		<div className='container postInfo'>
			{
			
				post.postType === 'soapBox' ?
				<span className='postInfoCommunityName'><Link className='link' to={`/u/${post.userName}`}> /u/{post.userName}</Link></span> :
				<span className='postInfoCommunityName'><Link className='link' to={`/c/${post.communityName}`}>/c/{post.communityName}</Link></span>

			}
			{
				user.userName !== '' ?
				post.postType === 'community' ? 
				user.communities.includes(post.communityName) ?
				<span className='joinedCommunity' onClick={() => { handleSubscription(post.communityNameLower, 'unsubscribe', 'community')}}> Unsubscribe </span> :
				<span className='joinCommunity' onClick={() => {handleSubscription(post.communityNameLower, 'subscribe', 'community')}}> Subscibe </span> :
				user.userName !== post.userName ?
				user.following.includes(post.userName) ?
				<span className='joinedCommunity' onClick={() => handleSubscription(post.userName.toLowerCase(), 'unsubscribe', 'user') }> Un-follow </span> :
				<span className='joinCommunity' onClick={() => handleSubscription(post.userName.toLowerCase(), 'subscribe', 'user')}> Follow </span> :
				null :
				null
			}

			{
				
				windowWidth > 576 && post.communityName !== post.userName ?
				<span className='postInfoUserName'><Link className='link' to={`/u/${post.userName}`}> /u/{post.userName} </Link></span> :
				null
			}
			{
				postView !== 'open' ?
				<i 
				onClick={() => {
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
					post.postType === 'soapBox' ?
					<Link to={`/u/${post.communityName}/${post.id}`} className='link'> 
						{post.title}
					</Link> :
					<Link to={`/c/${post.communityName}/${post.id}`} className='link'> 
						{post.title}
					</Link> 
				}
				
			</p>
			{
			 	 postView === 'open' ? 
			 	 null :
			 	 user.settings.feedType === 'list' ?
			 	 post.imageLink !== '' ?
				<img onClick={() => {
					openEnlargedWindow(!enlargedImgOpen)
				}} src={post.imageLink} alt='Post content' /> :
				post.imageRefs.length > 0 ?
				<img onClick={() => {
					openEnlargedWindow(!enlargedImgOpen)
				}} src={`https://jibjab.herokuapp.com/api/p/img/${post.imageRefs[0]}`} alt='Post Content'/> : 
				null : null
			}
		</div> 
	)
}



const EnlargedPostImg = () => {

	return(
		<div className='container enlargedPostImg'>
		{
			postView === 'open' ?
			post.imageLink !== '' ?
			<a href={post.imageLink} target='_blank' className='link'>
				<img src={post.imageLink} alt='Enlarged post content'/>
			</a> :
			post.imageRefs.length > 0 ?
			<Link to={`/i/${post.imageRefs[0]}`} className='link'>
				<img className='enlargedPostImgOpen' src={`https://jibjab.herokuapp.com/api/p/img/${post.imageRefs[0]}`} alt='Enlarged post content'/>
			</Link> :
			null :
			post.imageLink !== '' ?
			<Link to={post.postType ==='community' ? `/c/${post.communityName}/${post.id}` : `/u/${post.communityName}/${post.id}`}className='link'>
				<img src={post.imageLink} alt='Enlarged post content'/>
			</Link> :
			post.imageRefs.length > 0 ?
			<Link to={ post.postType ==='community' ? `/c/${post.communityName}/${post.id}` : `/u/${post.communityName}/${post.id}`}className='link'>
				<img src={`https://jibjab.herokuapp.com/api/p/img/${post.imageRefs[0]}`} alt='Enlarged post content'/>
			</Link> :
			null
		}
		</div>
	)
}

const EnlargedPostText = () => {
	return(
		<div className='container enlargedPostText' >
		{post.postTag && post.postTag !== '' ? <span> {post.postTag}</span> : null}
		{post.link && post.link !== '' ? <a href={post.link} > {post.link} </a> : null}
		{post.text && post.text !== '' ? <p> {post.text} </p> : null}
		</div>
	)
}


const InteractionWindow =() => {
	return(
		<div className='container interactionWindow'>
			<span className='postInfoTimePosted'> {timeDifference(post.time)} </span>
			<div className='container'>
			{
				post.karma.upvotes.includes(user.userName) ?
				<i onClick={() => handleVote(post.id, post.userName, 'upvote')} className="fas fa-arrow-circle-up" style={{color: 'blue'}}></i>:
				<i onClick={() => handleVote(post.id, post.userName, 'upvote')} className="fas fa-arrow-circle-up"></i>
			}
				<span> {post.karma.upvotes.length - post.karma.downvotes.length}</span>
			{
				post.karma.downvotes.includes(user.userName) ?
				<i onClick={() => handleVote(post.id, post.userName, 'downvote')} className="fas fa-arrow-circle-down" style={{color: 'red'}}></i>:
				<i onClick={() => handleVote(post.id, post.userName, 'downvote')} className="fas fa-arrow-circle-down"></i>
			}
			</div>
			<div className='container'>
			{
				windowWidth <= 920 ?
				postView === 'open' ?
				null :
				<Link className='link container' to={`/c/${post.communityName}/${post.id}`}>{post.comments.length} <i className="far fa-comment-dots"></i></Link> : <Link className='link container' to={`/c/${post.communityName}/${post.id}`}>{post.comments.length} <i className="far fa-comment-dots"></i></Link>
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
		} else if (user.settings.feedType === 'list' && postView !== 'open'){
			openEnlargedWindow(false)
		}
	},[user, postInfoIsOpen])

	useEffect(() => {
		if(postView === 'open'){
			openEnlargedWindow(true)
		}
	},[])

	const handleSubscription = (target, request, type) => {
	const accessToken = window.localStorage.getItem('accessToken')
	if(type === 'community'){
		fetch('https://jibjab.herokuapp.com/api/c/subscribe', {
			method: 'post',
			headers: {
				authorization: `Bearer ${accessToken}`,
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify({
				communityName: target,
				request,
			})
		})
		.then(response => response.json())
		.then(response => {
			setUser(response)
		})
		.catch(err => console.log(err))
	} else if(type === 'user'){
		fetch('https://jibjab.herokuapp.com/api/u/subscribe', {
			method: 'post',
			headers: {
				authorization: `Bearer ${accessToken}`,
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify({
				userName: target,
				request,
			})
		})
		.then(response => response.json())
		.then(response => {
			setUser(response)
		})
		.catch(err => console.log(err))
	} 
}



	return(
		<div className='post'>
			<PostInfo />
			{
				postInfoIsOpen ?
				<PostMenu 
				history={history}
				post={post} 
				Link={Link} 
				user={user} 
				setReportOverlayIsOpen={setReportOverlayIsOpen} 
				pageContent={pageContent} 
				setLoading={setLoading}
				setMessage={setMessage}/> :
				<React.Fragment>
					<PostContent Link={Link} enlargedImgOpen={enlargedImgOpen} openEnlargedWindow={openEnlargedWindow} user={user}/> 
					<InteractionWindow />
				</React.Fragment>
			}
			{
				enlargedImgOpen && (post.imageLink !== '' || post.imageRefs.length !== 0) && !postInfoIsOpen ?
				<EnlargedPostImg /> :
				null
			}	
			{
				postView === 'open' && post.text !== '' ?
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