import React, { useState, useRef } from 'react'



const Comment = ({data}) => {
	const [commentHidden, setCommentToHidden] = useState(false)

		const CommentBody = ({commentType, data}) => {
			const [commentFormOpen, setCommentFormOpen] = useState(false)
			const [commentHidden, setCommentToHidden] = useState(false)
			const CommentInfo = () => {
			return(
				<div className='commentInfo container' onClick={() => setCommentToHidden(!commentHidden)}>
					<span className='commentUserName'> {data.commentInfo.userName} </span> 
					{
						commentHidden ?
						null :
						<span> {data.commentInfo.time} </span>
					}
					<span className='commentKarma'>
						1 karma
					</span>
					{
						commentHidden ?
						<span className='commentsCounter'>
							{
								data.comments.length > 0 ?
								data.comments.length === 1 ?
								'1 comment' :
								`${data.comments.length} comments` :
								null
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

		const CommentForm = () => {
			return(
				<div className='commentForm '>
					<textarea rows='4'/>
					<div className='container'>
						<span  onClick={() => setCommentFormOpen(!commentFormOpen)}> X </span>
						<input type='button' value='Add comment'/>
					</div>
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
					<span onClick={() => setCommentToHidden(!commentHidden)}>
						Hide
					</span>
					<span className='commentsCounter'>
						{
							data.comments.length > 0 ?
							data.comments.length === 1 ?
							'1 comment' :
							`${data.comments.length} comments` :
							null
						}
					</span>
					<i class="far fa-comment"></i>
					<span onClick={()=> setCommentFormOpen(!commentFormOpen)}> Reply </span>
				</div>
				</React.Fragment>
			</React.Fragment>
		}
			{
				commentFormOpen ? 
				<CommentForm /> :
				null
			}
		</div>
		)
	}

	function renderComments(data, n) {
		if(n === undefined){
			n = 0
			console.log(n, data)
		} else {
			n++
		}
		if(n < 4) {
			return(
				<div className={n === 0 ? 'commentTab parentCommentTab' : 'commentTab' } >
				{
					data.comments.map((c, i) => {
						if(c.comments.length === 0) {
							return <CommentBody data={c} />
						} else {
							return(
								<React.Fragment> 
									<CommentBody data={c} />
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
		<React.Fragment>
			{
				data.comments.length === 0 ?
				<CommentBody commentType={'parentComment'} data={data} /> :
				<React.Fragment>
				{
					commentHidden ? 
					<CommentBody commentType={'parentComment'} data={data} /> :
					<React.Fragment>
						<CommentBody commentType={'parentComment'} data={data} />
						{renderComments(data)}
					</React.Fragment>
				}
				</React.Fragment>
			}
			
		</React.Fragment>
	)
}

export default Comment