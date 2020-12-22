import React, { useState, useEffect } from 'react'
import SearchBar from '../searchBar/SearchBar'
import { useForm } from 'react-hook-form'

const SubmitPost = ({location, submitPost, setOverlay, user, setMessage, url}) => {

	const [postType, setPostType] = useState('text')
	const [formSent, setFormSent] = useState(false)
	const { register, handleSubmit, errors, watch} = useForm()
	const [targetCommunity, setTargetCommunity] = useState(undefined)

	useEffect(() => {
		if(location.pathname !== '/' && location.pathname.substr(0, 3) !== '/u/'){
			fetch(`${url}/api/search`, {
				method: 'post',
				headers: {'Content-Type' : 'application/json'},
				body: JSON.stringify({
					query: location.pathname.substr(3, location.pathname.length - 3)
				})
			})
			.then(response => response.json())
			.then(response => setTargetCommunity(response.communityArray[0]))
			.catch(err => console.log(err))
		} 
	},[])

	const onSubmit = (data) => {
		if(!formSent){
			setFormSent(true)
			if(targetCommunity !== undefined){
				const accessToken = window.localStorage.getItem('accessToken')
				if(targetCommunity.type === 'community'){
					if(postType=== 'image'){
						const imageForm = document.getElementById('imageSubmissionForm')
						fetch(`${url}/api/c/${targetCommunity.name}/submit`, {
							method: 'post',
							headers: {
								authorization: `Bearer ${accessToken}`,
							},
							body: new FormData(imageForm)
						})
						.then(response => response.text())
						.then(response => {
							if(response === 'Success'){
								setFormSent(false)
								setOverlay(undefined)
								setMessage('Thanks for your submission!')
							} else{
								setFormSent(false)
								setMessage(response)
							}
						})
						.catch(err => console.log(err))
					} else if (postType === 'text' || postType === 'link'){
						fetch(`${url}/api/c/${targetCommunity.name}/submit`, {
							method: 'post',
							headers: {
								authorization: `Bearer ${accessToken}`,
								'Content-Type' : 'application/json'
							},
							body: JSON.stringify({
								data,
							})
						})
						.then(response => response.text())
						.then(response => {
							if(response === 'Success'){
								setFormSent(false)
								setOverlay(undefined)
								setMessage('Thanks for your submission!')
							} else{
								setFormSent(false)
								setMessage(response)
							}
						})
						.catch(err => {
							console.log(err)
							setFormSent(false)
							setMessage('There was an error making this post, please try again')
						})
					}
				} else if (targetCommunity.type === 'soapBox') {
					if(postType=== 'image'){
						const imageForm = document.getElementById('imageSubmissionForm')
						fetch(`${url}/api/u/submit`, {
							method: 'post',
							headers: {
								authorization: `Bearer ${accessToken}`,
							},
							body: new FormData(imageForm)
						})
						.then(response => response.text())
						.then(response => {
							if(response === 'Success'){
								setFormSent(false)
								setOverlay(undefined)
								setMessage('Thanks for your submission!')
							} else{
								setMessage('There was an error making this post, please try again')
							}
						})
						.catch(err => {
							console.log(err)
							setMessage('There was an error making this post, please try again')
							setFormSent(false)
						})
					} else if (postType === 'text' || postType === 'link'){
						fetch(`${url}/api/u/submit`, {
							method: 'post',
							headers: {
								authorization: `Bearer ${accessToken}`,
								'Content-Type' : 'application/json'
							},
							body: JSON.stringify({
								data,
							})
						})
						.then(response => response.text())
						.then(response => {
							if(response === 'Success'){
								setFormSent(false)
								setOverlay(undefined)
								setMessage('Thanks for your submission!')
							} else{
								setFormSent(false)
								setMessage('There was an error making this post, please try again')
							}
						})
						.catch(err => {
							console.log(err)
							setFormSent(false)
							setMessage('There was an error making this post, please try again')
						})
					}
				}
			} else {
				setMessage('Where would you like to post this?')
				setFormSent(false)
			}
		}
	}

	return(
		<div className='submitPost'>
			<h3>Submit a post</h3>
			<SearchBar setTargetCommunity={setTargetCommunity} user={user}  searchBarType='submitPost' url={url}/>
			<span 
			onClick={() => setOverlay(undefined)}
			className='closeOverlay'> X </span>
			{
				targetCommunity !== undefined ?
				<div className='targetCommunity container'>
					<img src={targetCommunity.image} alt="" />
					{targetCommunity.name}
				</div> :
				null
			}
			<div className='container postSelectionMenu'>
				<span 
					className={ postType === 'text' ? 'postSelectionSelected' : null }
					onClick={() => setPostType('text')}>
					Text
				</span>
				<span 	
					className={ postType === 'link' ? 'postSelectionSelected' : null }
					onClick={() => setPostType('link')}>
					Link
				</span>
				<span
					className={ postType === 'image' ? 'postSelectionSelected' : null }
					onClick={() => setPostType('image')}>
					Image
				</span>
			</div>
			{
				postType === 'text' ? 
				<form 
					onSubmit={handleSubmit(onSubmit)} 
					className={formSent ? 'formDeactivated' : null} >
					<label htmlFor="postTitle"> Post title:</label>
					{errors.postTitle && errors.postTitle.type === 'required' && <p className='formError' > Posts need titles! </p>}
					{errors.postTitle && errors.postTitle.type === 'maxLength' && <p className='formError' > Whoa whoa, why not make that title a bit more concise? </p>}
					<input type="text" placeholder="Title your post" name="postTitle" ref={register({required: true, maxLength: 160})} />
					<label htmlFor="postText">Post text:</label>
					{errors.postText && errors.postText.type === 'maxLength' && <p className='formError' > Cool story bro, lets summarize just a bit. </p>}
					<textarea rows='4' placeholder="What's going on?" name="postText" ref={register({required: false, maxLength: 2000})} />
					<button> Submit </button>
				</form> :
				postType === 'link' ?
				<form 
					onSubmit={handleSubmit(onSubmit)} 
					className={formSent ? 'formDeactivated' : null} >
					<label htmlFor="postTitle"> Post title:</label>
					{errors.postTitle && errors.postTitle.type === 'required' && <p className='formError' > Posts need titles! </p>}
					{errors.postTitle && errors.postTitle.type === 'maxLength' && <p className='formError' > Whoa whoa, why not make that title a bit more concise? </p>}
					<input type="text" placeholder="Title your post" name="postTitle" ref={register({required: true, maxLength: 160})} />
					{errors.mediaLink && errors.mediaLink.type === 'required' && <p className='formError' > Link required </p>}
					<label htmlFor="link">Link to:</label>
					<input type="text" placeholder="Link required" name='link' ref={register({required: true})} />
					<button> Submit </button>
				</form> : 
				postType === 'image' ?
				<form 
					id='imageSubmissionForm'
					onSubmit={handleSubmit(onSubmit)} 
					className={formSent ? 'formDeactivated' : null} 
					post='post' 
					encType="multipart/form-data">
					{errors.postTitle && errors.postTitle.type === 'required' && <p className='formError' > Posts need titles! </p>}
					{errors.postTitle && errors.postTitle.type === 'maxLength' && <p className='formError' > Whoa whoa, why not make that title a bit more concise? </p>}
					<label htmlFor="postTitle"> Post title:</label>
					<input type="text" placeholder="Title your post" name="postTitle" ref={register({required: true, maxLength: 160})} />
					<label htmlFor="myImage">Upload a .JPEG or .PNG image:</label>
					{errors.myImage && errors.myImage.type === 'required' && <p className='formError' > Uploaded image, or link to an image required </p>}
					<input name='myImage' type='file' accept="image/png, image/jpeg" ref={register({required: watch('imageLink') === '' ? true : false})} />
					<label htmlFor="imageLink"> Link to image: </label>
					<input type="text" placeholder="Upload image or share url here" name='imageLink' ref={register}/>
					{errors.postText && errors.postText.type === 'maxLength' && <p> Cool story bro, lets summarize just a bit. </p>}
					<label htmlFor="postText">Post text:</label>
					<textarea rows='4' placeholder="What's going on?" name="postText" ref={register({required: false, maxLength: 2000})} />
					<button> Submit </button>
				</form> : 
				null
			}
			<div className='thumbnailContainer'>
				<div className='thumbnail'>
					
				</div>
			</div>
		</div>
	)
}

export default SubmitPost