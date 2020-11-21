import React, {useState} from 'react'
import { useForm } from 'react-hook-form'

const SubmitPost = ({submitPost, setOverlay}) => {

	const [postType, setPostType] = useState('text')

	const [formSent, setFormSent] = useState(false)
	const { register, handleSubmit, errors} = useForm()
	const [error, setError] = useState(false)

	const onSubmit = () => {

	}


	return(
		<div className='submitPost'>
			<h3>Submit a post</h3>
			<span 
			onClick={() => setOverlay(undefined)}
			className='closeOverlay'> X </span>
			<div className='container postSelectionMenu'>
				<span onClick={() => setPostType('text')}>
					Text
				</span>
				<span onClick={() => setPostType('link')}>
					Link
				</span>
			</div>
			{
				postType === 'text' ? 
				<form onSubmit={handleSubmit(onSubmit)} className={formSent ? 'formDeactivated' : null}>
					{errors.postTitle && errors.postTitle.type === 'required' && <p> Posts need titles! </p>}
					{errors.postTitle && errors.postTitle.type === 'maxLength' && <p> Whoa whoa, why not make that title a bit more concise? </p>}
					<input type="text" placeholder="Title your post" name="postTitle" ref={register({required: true, maxLength: 160})} />
					<textarea rows='4' placeholder="What's going on?" name="postText" ref={register({required: false, maxLength: 2000})} />
				</form> :
				postType === 'link' ?
				<form onSubmit={handleSubmit(onSubmit)} className={formSent ? 'formDeactivated' : null}>
					{errors.postTitle && errors.postTitle.type === 'required' && <p> Posts need titles! </p>}
					{errors.postTitle && errors.postTitle.type === 'maxLength' && <p> Whoa whoa, why not make that title a bit more concise? </p>}
					<input type="text" placeholder="Title your post" name="postTitle" ref={register({required: true, maxLength: 160})} />
					{errors.mediaLink && errors.mediaLink.type === 'required' && <p> Link required </p>}
					<input type="text" placeholder="Media/Article link required" name='mediaLink' ref={register({required: true})} />
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