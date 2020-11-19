import React from 'react'

const PostMenu = ({post, Link, user}) => {

	const handleSharePost = () => {
		console.log('handleSharePost')
	}

	const handleSavePost = () => {
		console.log('handleSavePost')
	}

	const handleReportPost = () => {
		console.log('handleReportPost')
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
					<span> {post.user}'s profile </span>
				</Link>
			</div>
			{
				user.userName !== '' ?
				<React.Fragment>
					<div onClick={handleSavePost}>
						<i class="fa fa-bookmark-o"></i>
						<span> Save</span>
					</div>
					<div onClick={handleReportPost}>
						<i class="fa fa-flag" aria-hidden="true"></i>
						<span> Report</span>
					</div>
				</React.Fragment> :
				null
			}
		</div>
	)
}

export default PostMenu