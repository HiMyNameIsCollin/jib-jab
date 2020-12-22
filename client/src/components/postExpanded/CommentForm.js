import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

const CommentForm = ({func, value, post, setPosts, comment, setMessage, location, url}) => {
	const [formSent, setFormSent] = useState(false)
	const { register, handleSubmit, errors} = useForm()
	const [commentId, setCommentId] = useState(comment !== undefined ? comment.commentInfo.id : 'parent')

	const onSubmit = (data) => {
		if(!formSent){
			setFormSent(true)
		  	const accessToken = window.localStorage.getItem('accessToken')
			fetch(`${url}/api/comment/submit`, {
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
				let path = location.pathname.split('/')
				if(path.length < 5){
					setPosts(response)
				} else {
					let comment 
					function findComment(comments, id){
						comments.map((m, i) => {
							if(m.commentInfo.id === id){
								comment = [m]
								return
							} else {
								if(m.comments.length > 0){
									findComment(m.comments, id)
								}
							}
						})
						return
					}
					findComment(response[0].comments, path[4])
					response[0].comments = comment
					setPosts(response)
				}
				setMessage('Thank you for your submission')
				setFormSent(false)
				func(!value)
			})
			.catch(err => {
				console.log(err)
				setFormSent(false)
				setMessage('There seems to have been an error')
			})
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