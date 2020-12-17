import React, { useState } from 'react'
import Comment from './Comment'


const initialSort = {
	sortOptionsChoice: 'spicy',
	sortOptionsContChoice: 'day'
}

const CommentFeed = ({pageContent, location, post, user, Link, handleCommentVote, setError, setPosts, setMessage}) => {

	const SortComments = () => {
		return(
			<div className='sortComments container'> 
			    <div onClick={() => setCommentDropDownOpen(!commentDropDownOpen)} className='container'> 
			    {
			    	commentSort.sortOptionsChoice === 'spicy' ?
			    	<React.Fragment>
						<i className="fas fa-pepper-hot"></i>
						<span>Spicy</span>
			    	</React.Fragment> :
			    	commentSort.sortOptionsChoice === 'best' ?
			    	<React.Fragment>
						<i className="fas fa-poll"></i>
						<span>Best</span>
			    	</React.Fragment> :
			    	commentSort.sortOptionsChoice === 'dicey' ?
			    	<React.Fragment>
						<i className="fas fa-dice"></i>
						<span>Dicey</span>
			    	</React.Fragment> :
			    	commentSort.sortOptionsChoice === 'new' ?
			    	<React.Fragment>
						<i className="fas fa-baby"></i>
						<span>New</span>
			    	</React.Fragment> :
			    	null
			    }
					<i className="fas fa-caret-down"></i>
								{
					commentDropDownOpen ?
					<div className='commentSortDropDown container'>
						<p> Sort comments by: </p>
						 <div onClick={(e)=> {
					    	e.stopPropagation()
					    	let commentSortMod = {...commentSort}
					    	commentSortMod.sortOptionsChoice = 'spicy'
					    	setCommentSort(commentSortMod)
					    	setCommentDropDownOpen(false)
					    }}> 
							<i className="fas fa-pepper-hot"></i>
							<span>Spicy</span>
						</div>
						<div onClick={(e)=> {
					    	e.stopPropagation()
					    	let commentSortMod = {...commentSort}
					    	commentSortMod.sortOptionsChoice = 'best'
					    	setCommentSort(commentSortMod)
					    	setCommentDropDownOpen(false)
					    }}> 
							<i className="fas fa-poll"></i>
							<span>Best</span>
						</div>
						<div onClick={(e)=> {
					    	e.stopPropagation()
					    	let commentSortMod = {...commentSort}
					    	commentSortMod.sortOptionsChoice = 'dicey'
					    	setCommentSort(commentSortMod)
					    	setCommentDropDownOpen(false)
					    }}> 
							<i className="fas fa-dice"></i>
							<span>Dicey</span>
						</div>
						<div onClick={(e)=> {
					    	e.stopPropagation()
					    	let commentSortMod = {...commentSort}
					    	commentSortMod.sortOptionsChoice = 'new'
					    	setCommentSort(commentSortMod)
					    	setCommentDropDownOpen(false)
					    }}>  
							<i className="fas fa-baby"></i>
							<span>New</span>
						</div>
					</div> 
					:
					null
				}
				</div>
				<span className='feedSortCommentsLabel'> {post.comments.length} comments</span>
			</div> 
		)
	}

	const [commentSort, setCommentSort] = useState(initialSort)
	const [commentDropDownOpen, setCommentDropDownOpen] = useState(false)

	return(
		<div className='commentFeed'>
			{
				location.pathname.split('/').length > 4 ?
				<div className='commentNavigation container'>
					<Link to={`/c/${post.communityName}/${post.id}`}>
						Back to feed 
					</Link>
				</div>  :
				<SortComments/>
			}
		
		{
			post.comments.map((c, i)=> {
				return (
					<Comment 
					post={post} 
					comment={c} 
					location={location}
					commentType='parentComment' 
					handleCommentVote={handleCommentVote}
					user={user}
					setError={setError}
					setPosts={setPosts}
					Link={Link}
					setMessage={setMessage}
					key={i}/>
				)
			}) 
		}
		</div>
	)
}


export default CommentFeed