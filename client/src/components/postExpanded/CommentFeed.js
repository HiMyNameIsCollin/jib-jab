import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import Comment from './Comment'


const initialSort = {
	sortOptionsChoice: 'spicy',
	sortOptionsContChoice: 'day'
}

const CommentFeed = ({pageContent, post, user, Link, handleCommentVote, setError, setPosts}) => {

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
	let prevRender = useRef()


	const handleSeeMoreComments = (comment, currentPost) => {
		if(prevRender.current){
			prevRender.current.push(currentPost)
		}else {
			prevRender.current = [currentPost]
		}
		let updatedPost = {...post}
		updatedPost.comments = [comment]
		setPosts([updatedPost])
	}


	return(
		<div className='commentFeed'>
		{
			prevRender.current ?
			<div className='commentNavigation container'>
				<span onClick={() => {
					setPosts([prevRender.current[0]])
					prevRender.current = false
				}}>
					Back to feed </span>
				{
					prevRender.current.length > 1 ?
					<span onClick={() => {
					setPosts([prevRender.current[prevRender.current.length -1]])
					prevRender.current.pop()
					}}>	 Prev comments </span> :
					null
				}

			</div> :
			<SortComments/>
		}
		{
			post.comments.map((c, i)=> {
				return (
					<Comment 
					post={post} 
					comment={c} 
					commentType='parentComment' 
					handleCommentVote={handleCommentVote}
					handleSeeMoreComments={handleSeeMoreComments}
					user={user}
					setError={setError}
					setPosts={setPosts}
					Link={Link}/>
				)
			}) 
		}
		</div>
	)
}


export default CommentFeed