import React, { useState, useEffect } from 'react'
import './_post.sass'
import ReactionsWindow from './ReactionsWindow'
import ReactionsDisplay from './ReactionsDisplay'

const Post = ({user, windowWidth, Link, postType, post}) => {

const PostInfo = () => {
	return(
		<div className='container postInfo'>
			{
				postType !== 'enlarged' ?
				<span className='postInfoCommunityName'><Link className='link' to={`/c/${post.communityName}`}> {post.communityName}</Link></span>:
				null
			}
			
			{
				user.userName !== '' ?
				<span class='joinCommunity'> Join </span> :
				null
			}
			<span className='postInfoTimePosted'>{post.time}  </span>
			{
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
			<div className='container'>
				<i class="fas fa-arrow-circle-up"></i>
				<span> {post.karma.upvotes - post.karma.downvotes}</span>
				<i class="fas fa-arrow-circle-down"></i>
			</div>
			<div className='container'>
			{
				windowWidth <= 920 ?
				postType === 'enlarged' ?
				null :
				null:  <span>{post.comments.length}</span>
			}
				
				<i class="far fa-comment-dots"></i>
			</div>
		</div>
	)
}

const PostMeta= () => {

	const [reactionIsOpen, openReactions] = useState(false)


	return(
		<div className='container postMeta'>
		{
			reactionIsOpen ?
			<ReactionsWindow reactionIsOpen={reactionIsOpen} openReactions={openReactions}  />:
			<ReactionsDisplay reactionIsOpen={reactionIsOpen} openReactions={openReactions} />
		}
		{
			reactionIsOpen === false && windowWidth <= 920 ?
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