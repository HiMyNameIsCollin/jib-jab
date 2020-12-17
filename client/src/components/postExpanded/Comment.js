import React, { useState } from 'react'
import CommentForm from './CommentForm'
import timeDifference from '../../utils/timeDifference'


const Comment = ({comment, post, setPosts, handleCommentVote, user, setError, Link, setMessage}) => {

		const CommentBody = ({commentType, comment}) => {
			const [commentFormOpen, setCommentFormOpen] = useState(false)
			const [commentHidden, setCommentToHidden] = useState(false)
			/*NTS ANOTHER ONE OF THESE IN MAIN COMMENT*/

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
					onClick={() => handleCommentVote(post.id, comment.commentInfo.id, 'upvote')}
					className="fas fa-arrow-circle-up"
					style={{color: 'blue'}}></i> :
					<i 
					onClick={() => handleCommentVote(post.id, comment.commentInfo.id, 'upvote')}
					className="fas fa-arrow-circle-up"></i>
				}
					<span>{comment.karma.upvotes.length - comment.karma.downvotes.length} </span>
				{
					comment.karma.downvotes.includes(user.userName) ?
					<i 
					onClick={() => handleCommentVote(post.id, comment.commentInfo.id, 'downvote')}
					className="fas fa-arrow-circle-down"
					style={{color: 'red'}}></i> :
					<i 
					onClick={() => handleCommentVote(post.id, comment.commentInfo.id, 'downvote')}
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
				<img src="https://robohash.org/3" alt=""/>
				<CommentInfo /> 
			</React.Fragment> :
			<React.Fragment>
				<img src="https://robohash.org/3" alt=""/>
				<CommentInfo /> 
				<React.Fragment>
				<img src="https://robohash.org/3" alt=""/>
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
							setError('Must be logged in to comment')
						}
					}}>Reply <i className="far fa-comment"></i>  </span>
				</div>
				</React.Fragment>
			</React.Fragment>
		}
			{
				commentFormOpen ? 
				<CommentForm 
				post={post} 
				setPosts={setPosts}
				comment={comment} 
				func={setCommentFormOpen} 
				value={commentFormOpen}
				setMessage={setMessage} /> :
				null
			}
		</div>
		)
	}

	function renderComments(comment, n) {
		if(n === undefined){
			n = 0
		} else {
			n++
		}
		if(n < 4) {
			return(
				<div className={n === 0 ? 'commentTab parentCommentTab' : 'commentTab' } >
				{
					comment.comments.map((c, i) => {
						if(c.comments.length === 0) {
							return <CommentBody comment={c} key={i}/>
						} else {
							return(
								<React.Fragment> 
									<CommentBody comment={c} />
									{renderComments(c, n)}
								</React.Fragment>
							)
						}
					})
				}
				</div>
			)			
		} else {
			return <Link className='seeMoreComments' to={`/c/${post.communityName}/${post.id}/${comment.commentInfo.id}`} > <p>See more comments </p> </Link>
		}
	}

	const [commentHidden, setCommentToHidden] = useState(false)

	return(
		<React.Fragment>
			{
				comment.comments.length === 0 ?
				<CommentBody commentType={'parentComment'} comment={comment} /> :
				<React.Fragment>
				{
					commentHidden ? 
					<CommentBody commentType={'parentComment'} comment={comment} /> :
					<React.Fragment>
						<CommentBody commentType={'parentComment'} comment={comment} />
						{renderComments(comment)}
					</React.Fragment>
				}
				</React.Fragment>
			}
			
		</React.Fragment>
	)
}

export default Comment