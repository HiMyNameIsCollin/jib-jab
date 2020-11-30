import React, {useState} from 'react'
import SearchBar from '../searchBar/SearchBar'
import { useForm } from 'react-hook-form'

const SubmitPost = ({submitPost, setOverlay, user}) => {

	const [postType, setPostType] = useState('text')
	const [formSent, setFormSent] = useState(false)
	const { register, handleSubmit, errors} = useForm()
	const [error, setError] = useState(false)
	const [targetCommunity, setTargetCommunity] = useState(undefined)

	const onSubmit = (data) => {
		const accessToken = window.localStorage.getItem('accessToken')
		if(targetCommunity.type === 'community'){
			if(postType=== 'image'){
				const imageForm = document.getElementById('imageSubmissionForm')
				fetch(`http://localhost:3000/api/c/${targetCommunity.name}/submit`, {
					method: 'post',
					headers: {
						authorization: `Bearer ${accessToken}`,
					},
					body: new FormData(imageForm)
				})
				.then(response => response.json())
				.catch(err => console.log(err))
			} else if (postType === 'text'){
				fetch(`http://localhost:3000/api/c/${targetCommunity.name}/submit`, {
					method: 'post',
					headers: {
						authorization: `Bearer ${accessToken}`,
						'Content-Type' : 'application/json'
					},
					body: JSON.stringify({
						data,
					})
				})
				.then(response => response.json())
				.catch(err => console.log(err))
			}
		} else if (targetCommunity.type === 'soapBox') {
			if(postType=== 'image'){
				const imageForm = document.getElementById('imageSubmissionForm')
				fetch(`http://localhost:3000/api/u/submit`, {
					method: 'post',
					headers: {
						authorization: `Bearer ${accessToken}`,
					},
					body: new FormData(imageForm)
				})
				.then(response => response.json())
				.catch(err => console.log(err))
			} else if (postType === 'text'){
				fetch(`http://localhost:3000/api/u/submit`, {
					method: 'post',
					headers: {
						authorization: `Bearer ${accessToken}`,
						'Content-Type' : 'application/json'
					},
					body: JSON.stringify({
						data,
					})
				})
				.then(response => response.json())
				.catch(err => console.log(err))
			}
		}
	}

	return(
		<div className='submitPost'>
			<h3>Submit a post</h3>
			<SearchBar user={user} setTargetCommunity={setTargetCommunity} searchBarType='submitPost'/>
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
				<form onSubmit={handleSubmit(onSubmit)} className={formSent ? 'formDeactivated' : null} post='post' encType="multipart/form-data">
					{errors.postTitle && errors.postTitle.type === 'required' && <p> Posts need titles! </p>}
					{errors.postTitle && errors.postTitle.type === 'maxLength' && <p> Whoa whoa, why not make that title a bit more concise? </p>}
					<input type="text" placeholder="Title your post" name="postTitle" ref={register({required: true, maxLength: 160})} />
					<textarea rows='4' placeholder="What's going on?" name="postText" ref={register({required: false, maxLength: 2000})} />
					<button> Submit </button>
				</form> :
				postType === 'link' ?
				<form onSubmit={handleSubmit(onSubmit)} className={formSent ? 'formDeactivated' : null} post='post' encType="multipart/form-data">
					{errors.postTitle && errors.postTitle.type === 'required' && <p> Posts need titles! </p>}
					{errors.postTitle && errors.postTitle.type === 'maxLength' && <p> Whoa whoa, why not make that title a bit more concise? </p>}
					<input type="text" placeholder="Title your post" name="postTitle" ref={register({required: true, maxLength: 160})} />
					{errors.mediaLink && errors.mediaLink.type === 'required' && <p> Link required </p>}
					<input type="text" placeholder="Media/Link required" name='mediaLink' ref={register({required: true})} />
					<button> Submit </button>
				</form> : 
				postType === 'image' ?
				<form 
				id='imageSubmissionForm'
				onSubmit={handleSubmit(onSubmit)} 
				className={formSent ? 'formDeactivated' : null} 
				post='post' 
				encType="multipart/form-data">
					{errors.postTitle && errors.postTitle.type === 'required' && <p> Posts need titles! </p>}
					{errors.postTitle && errors.postTitle.type === 'maxLength' && <p> Whoa whoa, why not make that title a bit more concise? </p>}
					<input type="text" placeholder="Title your post" name="postTitle" ref={register({required: true, maxLength: 160})} />
					{errors.myImage && errors.myImage.type === 'required' && <p> Picture required </p>}
					<input name='myImage' type='file' accept="image/*" multiple ref={register({required: true})}/>
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