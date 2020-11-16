import React, { useState, useEffect } from 'react'
import Comment from './Comment'

const initialSort = {
	sortOptionsChoice: 'spicy',
	sortOptionsContChoice: 'day'
}

const CommentFeed = ({comments, user}) => {

	const [commentSort, setCommentSort] = useState(initialSort)
	const [commentDropDownOpen, setCommentDropDownOpen] = useState(false)



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
				<span className='feedSortCommentsLabel'> {comments.length} comments</span>
			</div> 
		)
	}


	return(
		<div className='commentFeed'>
		<SortComments/>
		{
			comments.map((c, i)=> {
				return <Comment data={c} commentType='parentComment'/>
			}) 
		}
		</div>
	)
}


export default CommentFeed