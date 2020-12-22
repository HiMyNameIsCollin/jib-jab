import React, { useState, useEffect } from 'react'
import CommentForm from './CommentForm'
import timeDifference from '../../utils/timeDifference'

const CommentBody = ({commentType, comment, commentHidden, setCommentToHidden, Link, user, setUser, handleCommentVote, post, setMessage, setPosts, location, url}) => {
	const [commentFormOpen, setCommentFormOpen] = useState(false)
	const [commentersImage, setCommentersImage] = useState(undefined)

	useEffect(() => {
		fetch(`${url}/api/u/img/${comment.commentInfo.userName}`)
		.then(response => response.json())
		.then(response => setCommentersImage(response))
		.catch(err => console.log(err))
	}, [])

	const CommentInfo = () => {
		return(
			<div className='commentInfo container' onClick={() => setCommentToHidden(!commentHidden)}>
				<Link className='commentUserName' to={`/u/${comment.commentInfo.userName}`}> 
				{comment.commentInfo.userName} 
				</Link> 
				{
					commentHidden ?
					null :
					<span> {timeDifference(comment.commentInfo.time)} </span>
				}
				<span className='commentKarma'>
					1 karma
				</span>
				{
					commentHidden ?
					<span className='commentsCounter'>
					{
						comment.comments.length > 0 ?
						comment.comments.length === 1 ?
						'1 comment' :
						`${comment.comments.length} comments` :
						'0 comments'
					}
					</span> :
				null
				}
			</div>
		)
	}

	const CommentContent = () => {
		return(
			<div className='commentContent container'>
				<p> {comment.commentContent} </p>
			</div>
		)
	}

	const CommentMeta = () => {
		return(
			<div className='commentMeta container'>
			{
				comment.karma.upvotes.includes(user.userName) ?
				<i 
				onClick={() => handleCommentVote(post.id, comment.commentInfo.id, comment.commentInfo.userName,  'upvote')}
				className="fas fa-arrow-circle-up"
				style={{color: 'blue'}}></i> :
				<i 
				onClick={() => handleCommentVote(post.id, comment.commentInfo.id, comment.commentInfo.userName, 'upvote')}
				className="fas fa-arrow-circle-up"></i>
			}
				<span>{comment.karma.upvotes.length - comment.karma.downvotes.length} </span>
			{
				comment.karma.downvotes.includes(user.userName) ?
				<i 
				onClick={() => handleCommentVote(post.id, comment.commentInfo.id, comment.commentInfo.userName,  'downvote')}
				className="fas fa-arrow-circle-down"
				style={{color: 'red'}}></i> :
				<i 
				onClick={() => handleCommentVote(post.id, comment.commentInfo.id, comment.commentInfo.userName,  'downvote')}
				className="fas fa-arrow-circle-down"></i> 
			}
			</div>
		)
	}


return(
	<div className={ commentType === 'parentComment' ? 'parentComment comment' : 'comment'}>
	{
		commentHidden ?
		<React.Fragment>
			<img src={commentersImage} alt=""/>
			<CommentInfo /> 
		</React.Fragment> :
		<React.Fragment>
			<img src={commentersImage} alt=""/>
			<CommentInfo/>
			<CommentContent />
			<CommentMeta />
			<div className='container commentReply'>
				<span 
					className='hideCommentButton'
					onClick={() => setCommentToHidden(!commentHidden)}>
					Hide
				</span>
				<span className='commentsCounter'>
					{
						comment.comments.length > 0 ?
						comment.comments.length === 1 ?
						'1 comment' :
						`${comment.comments.length} comments` :
						'0 comments'
					}
				</span>
				<span 
					className='container replyButton'
					onClick={()=> {
					if(user.userName !== ''){
						setCommentFormOpen(!commentFormOpen)	
					} else {
						setMessage('Must be logged in to comment')
					}
				}}>Reply <i className="far fa-comment"></i>  </span>
			</div>
		</React.Fragment>
	}
		{
			commentFormOpen ? 
			<CommentForm 
			location={location}
			post={post} 
			setPosts={setPosts}
			comment={comment} 
			func={setCommentFormOpen} 
			value={commentFormOpen}
			setMessage={setMessage}
			url={url}  /> :
			null
		}
	</div>
	)
}

export default CommentBody