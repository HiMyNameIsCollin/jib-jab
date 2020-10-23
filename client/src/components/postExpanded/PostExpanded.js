import React, { useState } from 'react'
import Post from '../post/Post'
import './_postExpanded.sass'


const PostExpanded = ({Link, user, windowWidth, pageType}) => {

const CommentFeed = () => {
	return(
		<div className='commentFeed'>
			
		</div>
	)
}

const PostMenuBar = () => {
	return(
		<div className='postMenuBar container'>
			<span> 100 Comments </span>
			<div>
				<i className="fas fa-bars"></i>
				<span> Share </span>
			</div>
			{
				user.userName !== undefined ? 
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

	return(
		<div className='postExpanded'>
			<Post pageType={pageType} postType={'enlarged'} user={user} Link={Link} windowWidth={windowWidth}/>
			{
				windowWidth > 920 ?
				<PostMenuBar /> :
				null
			}
			<CommentFeed />
		</div>

	)
}

export default PostExpanded