import React, {useState} from 'react'
import { useForm } from 'react-hook-form'

const SubmitPost = ({submitPost, setOverlay}) => {

	const [formSent, setFormSent] = useState(false)
	const { register, handleSubmit, errors, watch} = useForm()
	const [error, setError] = useState(false)

	const onSubmit = () => {

	}

	return(
		<div className='submitPost'>
			<h3>Submit a post</h3>
			<span 
			onClick={() => setOverlay(undefined)}
			style={{position: 'absolute', top: '1em', right: '1em', fontSize: '1.5em'}}> X </span>
			<form onSubmit={handleSubmit(onSubmit)} className={formSent ? 'formDeactivated' : null}>
				<input type="text" placeholder="Title your post" name="postTitle" ref={register({required: true, minLength: 2, maxLength: 160})} />
			</form>
		</div>
	)
}

export default SubmitPost