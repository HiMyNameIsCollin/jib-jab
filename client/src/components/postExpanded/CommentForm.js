import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

const CommentForm = ({func, value, post, setPosts, comment}) => {
	const [error, setError] = useState(false)
	const [formSent, setFormSent] = useState(false)
	const { register, handleSubmit, errors, watch} = useForm()
	const [commentId, setCommentId] = useState(comment !== undefined ? comment.commentInfo.id : 'parent')

	const onSubmit = (data) => {
		if(!formSent){
			setFormSent(true)
		  	const accessToken = window.localStorage.getItem('accessToken')
			fetch('http://localhost:3000/api/comment/submit', {
				method: 'post',
				headers: {
					authorization: `Bearer ${accessToken}`,
					'Content-Type' : 'application/json'
				},
				body: JSON.stringify({
					postId: post.id,
					commentId: commentId,
					commentContent: data.commentContent
				})
			})
			.then(response => response.json())
			.then(response => {
				setPosts(response)
				setFormSent(false)
				func(!value)
			})
			.catch(err => console.log(err))
		}
	}


	useEffect(() => {
		document.getElementById(`commentTextArea${commentId}`).focus()
	},[commentId])

	return(
		<form 
		onSubmit={handleSubmit(onSubmit)} 
		className={formSent ? 'formDeactivated commentForm' : 'commentForm'}>
			<textarea id={`commentTextArea${commentId}`} rows='4' name='commentContent' ref={register({required: true})}/>
			{errors.commentContent && errors.commentContent.type === 'required' && <p> Comment field requires some input </p>}
			<span  onClick={() => func(!value)}> X </span>
			<button> Submit </button>
		</form>
	)
}

export default CommentForm