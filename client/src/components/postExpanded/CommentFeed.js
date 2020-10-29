import React, { useState, useEffect } from 'react'
import Comment from './Comment'

const CommentFeed = ({postData}) => {

	function renderComments(data, n) {
		if(n === undefined){
			n = 0
			console.log(n)
		} else {
			n++
		}
		if(n < 4) {
			return(
				<div className={n === 0 ? 'commentTab parentCommentTab' : 'commentTab'}>
				{
					data.comments.map((c, i) => {
						if(c.comments.length === 0) {
							return <Comment data={c}/>
						} else {
							return(
								<React.Fragment> 
									<Comment data={c} />
									{renderComments(c, n)}
								</React.Fragment>
							)
						}
					})
				}
				</div>
			)			
		} else {
			return <p className='seeMoreComments'> See more comments </p>
		}
	}

	return(
		<div className='commentFeed'>
			{
			postData.comments.map((c, i)=> {
				if(c.comments.length === 0){
					return <Comment data={c} commentType='parentComment'/>
				} else {
					return (
						<React.Fragment>
						<Comment data={c} commentType='parentComment'/>
						{renderComments(c)}
						</React.Fragment>
					)
				}
			}) 
			}
		</div>
	)
}


export default CommentFeed