import React, { useState } from 'react'
import CommentBody from './CommentBody'



const Comment = ({comment, post, setPosts, handleCommentVote, user, Link, setMessage}) => {

	const [commentHidden, setCommentToHidden] = useState(false)

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
							return <CommentBody handleCommentVote={handleCommentVote} post={post} setPosts={setPosts} comment={c} key={i} setMessage={setMessage} user={user} Link={Link} commentHidden={commentHidden} setCommentToHidden={setCommentToHidden}/>
						} else {
							return(
								<React.Fragment> 
									<CommentBody handleCommentVote={handleCommentVote} post={post} setPosts={setPosts} comment={c} key={i} setMessage={setMessage} user={user} Link={Link} commentHidden={commentHidden} setCommentToHidden={setCommentToHidden}/>
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



	return(
		<React.Fragment>
			{
				comment.comments.length === 0 ?
				<CommentBody commentType={'parentComment'} comment={comment} handleCommentVote={handleCommentVote} post={post} setPosts={setPosts} setMessage={setMessage}  user={user} Link={Link} commentHidden={commentHidden} setCommentToHidden={setCommentToHidden}/> :
				<React.Fragment>
				{
					commentHidden ? 
					<CommentBody commentType={'parentComment'} comment={comment} handleCommentVote={handleCommentVote} post={post} setPosts={setPosts} setMessage={setMessage}  user={user} Link={Link} commentHidden={commentHidden} setCommentToHidden={setCommentToHidden}/> :
					<React.Fragment>
						<CommentBody commentType={'parentComment'} comment={comment} handleCommentVote={handleCommentVote} post={post} setPosts={setPosts} setMessage={setMessage}  user={user} Link={Link} commentHidden={commentHidden} setCommentToHidden={setCommentToHidden}/>
						{renderComments(comment)}
					</React.Fragment>
				}
				</React.Fragment>
			}
			
		</React.Fragment>
	)
}

export default Comment