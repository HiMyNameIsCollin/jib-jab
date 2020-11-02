import React, { useState, useEffect } from 'react'
import './_post.sass'
import ReactionsWindow from './ReactionsWindow'
import ReactionsDisplay from './ReactionsDisplay'

const Post = ({user, windowWidth, Link, postType, pageType}) => {

const PostInfo = () => {
	return(
		<div className='container postInfo'>
			<img src='https://robohash.org/4' alt="Community img"/>
			{
				pageType !== 'communityPage' && postType !== 'enlarged' ?
				<span className='postInfoCommunityName'><Link className='link' to='/community'> Community name</Link></span>:
				null
			}
			
			{
				user.userName !== '' ?
				<span class='joinCommunity'> Join </span> :
				null
			}
			<span className='postInfoTimePosted'> 5hrs </span>
			{
				pageType === 'communityPage' && windowWidth <= 576 ?
				<span className='postInfoUserName'><Link className='link' to='/user'> /u/Users name </Link></span> :
				null
			}
			{
				windowWidth > 576 ?
				<span className='postInfoUserName'><Link className='link' to='/user'> /u/Users name </Link></span> :
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
					'orem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem orem lorem lorem lorem lorem lorem lorem lorem lorem' :
					<Link to='/community/post' className='link'> orem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem orem lorem lorem lorem lorem lorem lorem lorem lorem 
					</Link> 
				}
				
			</p>
			{
			 	 postType === 'enlarged' ? 
			 	 null :
			 	 user.settings.feedType === 'list' ?
				<img onClick={() => {
					openEnlargedWindow(!enlargedImgOpen)
				}} src='https://source.unsplash.com/random/800x600' alt='Post image' /> :
				null
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
				<Link to='/user' className='link'>
					<i className="fas fa-bars"></i>
					<span> User name's profile </span>
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
			<Link to='/community/name/post' className='link'>
				<img src='https://source.unsplash.com/random/800x600' alt='Enlarged post image'/>
			</Link>
		</div>
	)
}

const EnlargedPostText = () => {
	return(
		<div className='container enlargedPostText' >
		<span> Post tag </span> 
		<p> This is where a user can input: fact, hot takes, shit post, or whatever else. This is where a user can input: fact, hot takes, shit post, or whatever else. This is where a user can input: fact, hot takes, shit post, or whatever else. This is where a user can input: fact, hot takes, shit post, or whatever else. </p>
		</div>
	)
}


const InteractionWindow =() => {
	return(
		<div className='container interactionWindow'>
			<div className='container'>
				<i class="fas fa-arrow-circle-up"></i>
				<span> 24.7k</span>
				<i class="fas fa-arrow-circle-down"></i>
			</div>
			<div className='container'>
			{
				windowWidth <= 920 ?
				postType === 'enlarged' ?
				null :
				null:  <span> 100</span>
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
				enlargedImgOpen ?
				<EnlargedPostImg /> :
				null
			}	
			{
				postType === 'enlarged' ?
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