import React, { useState } from 'react'
import './_post.sass'

const PostInfo = ({postInfoIsOpen, openPostInfo, userLoggedIn}) => {
	return(
		<div className='container postInfo'>
			<img src='https://robohash.org/4' alt="Community img"/>
			<span> Community name</span>
			<span> 5hrs </span>
			<span> /u/Users name </span>
			{
				userLoggedIn ?
				<span class='joinCommunity'> Join </span> :
				null
			}
			<i onClick={() => openPostInfo(!postInfoIsOpen)} className="fas fa-bars"></i>
		</div>
	)
}


const PostContent = ({enlargedImgOpen, openEnlargedWindow}) => {
	return(
		<div className='container postContent'>
			<p> orem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem </p>
			<img onClick={() => openEnlargedWindow(!enlargedImgOpen)} src='https://robohash.org/3' alt='Post image' />
		</div> 
	)
}

const PostMenu = () => {
	return(
		<div className='container postMenu'>
			<div>
				<i className="fas fa-bars"></i>
				<span> Permalink </span>
			</div>
			<div>
				<i className="fas fa-bars"></i>
				<span> User name's profile </span>
			</div>
			<div>
				<i className="fas fa-bars"></i>
				<span> Save</span>
			</div>
			<div>
				<i className="fas fa-bars"></i>
				<span> Report</span>
			</div>
		</div>
	)
}

const EnlargedPostImg = () => {
	return(
		<div className='container enlargedPostImg'>
			<img src='https://robohash.org/3' alt='Enlarged post image'/>
		</div>
	)
}


const PostMeta = () => {
	return(
		<div className='containter postMeta'>
			<span> 5 upvotes </span>
		</div>
	)
}

const Post = ({userLoggedIn}) => {

	const [postInfoIsOpen, openPostInfo] = useState(false)
	const [enlargedImgOpen, openEnlargedWindow] = useState(false)

	return(
		<div className='post'>
			<PostInfo postInfoIsOpen={postInfoIsOpen} openPostInfo={openPostInfo} userLoggedIn={userLoggedIn}/>
			{
				postInfoIsOpen ?
				<PostContent enlargedImgOpen={enlargedImgOpen} openEnlargedWindow={openEnlargedWindow} /> 
				:
				<PostMenu/>
			}
			{
				enlargedImgOpen ?
				<EnlargedPostImg /> :
				null
			}
			<PostMeta />
		</div>
	)
}

export default Post