import React, { useState } from 'react'



const Comment = ({data, commentType}) => {

	const [commentHidden, setCommentToHidden] = useState(false)

	const CommentInfo = () => {
		return(
			<div className='commentInfo container' onClick={commentHidden ? () => setCommentToHidden(!commentHidden) : null}>
				<span> {data.commentInfo.userName} </span> 
				<span> {data.commentInfo.time} </span>
				<span>
					1 karma
				</span>
			</div>
		)
	}

	const CommentContent = () => {
		return(
			<div className='commentContent container'>
				<p> {data.commentContent} </p>
			</div>
		)
	}

	const CommentMeta = () => {
		return(
			<div className='commentMeta container'>
				<i class="fas fa-arrow-circle-up"></i>
				<span> </span>
				<i class="fas fa-arrow-circle-down"></i>
			</div>
		)
	}



	return(
		<div className={commentType === 'parentComment' ? 'parentComment comment' : 'comment'}>
		{
			commentHidden ?
			<React.Fragment>
			<img src="https://robohash.org/3" alt=""/>
			<CommentInfo /> 
			</React.Fragment>:
			<React.Fragment>
			<img src="https://robohash.org/3" alt=""/>
			<CommentInfo/>
			<CommentContent />
			<CommentMeta />
			<div className='container commentReply'>
				<span onClick={() => setCommentToHidden(!commentHidden)}>
					Hide
				</span>
				<span>
					{
						data.comments.length > 0 ?
						data.comments.length === 1 ?
						'1 comment' :
						`${data.comments.length} comments` :
						null
					}
				</span>
				<i class="far fa-comment"></i>
				<span> Reply </span>
			</div>
			</React.Fragment>
		}
	
		</div>
	)
}

export default Comment