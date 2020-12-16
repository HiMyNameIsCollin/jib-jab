import React, {useState} from 'react'
import Loading from '../loading/Loading'
import '../overlay/_overlay.sass'
import { useForm } from 'react-hook-form'

const ReportOverlay = ({setReportOverlayIsOpen, reportOverlayIsOpen, user, setMessage}) => {
	const [loading, setLoading] = useState(false)
	const [formSent, setFormSent] = useState(false)
	const { register, handleSubmit, errors} = useForm()

	const onSubmit = (data) => {
		if(!formSent){
			const accessToken = window.localStorage.getItem('accessToken')
			setLoading(true)
			setFormSent(true)
			if(reportOverlayIsOpen.type === 'post'){
				fetch('http://jibjab.herokuapp.com/api/reportPost', {
					method: 'post',
					headers: {
						authorization: `Bearer ${accessToken}`,
						'Content-Type' : 'application/json'
					},
					body: JSON.stringify({
						reportOption: data.reportOptions,
						reportReason: data.reportReason,
						postId: reportOverlayIsOpen.post.id
					})
				})
				.then(response => response.json())
				.then(response => {
					setFormSent(false)
					setLoading(false)
					setReportOverlayIsOpen(undefined)
					setMessage('Thank you for your report')
				})
				.catch(err => {
					setFormSent(false)
					setLoading(false)
					setMessage('There seems to be an error')
				})
			}
		}

	}

	return(
		<div className='overlay'>
		{
			loading ? 
			<Loading /> :
			null
		}
		{
			reportOverlayIsOpen.type === 'post' ?
			<div className='reportPost'>
				<h3>Report this post</h3>
				<span 
				onClick={() => setReportOverlayIsOpen(undefined)}
				className='closeOverlay'> X </span>
				<h5> Post title: {reportOverlayIsOpen.post.title }</h5>
				<form
					onSubmit={handleSubmit(onSubmit)} 
					className={formSent ? 'formDeactivated' : null} >
					<label htmlFor="reportOptions" ref={register}>Why are you reporting this post?</label>
					{errors.reportOptions && errors.reportOptions.type === 'required' && <p className='formError'>This field is required</p>}
					<select name='reportOptions' ref={register({required: true})}>
						<option value='spam'> Spam </option>
						<option value='hateful'> Hateful</option>
						<option value='harmful'>Malicious link</option>
						<option value='cp'> Child porn </option>
						<option value='Other'> Other </option>
					</select>
					<label htmlFor="reportReason" ref={register}>Please elaborate on why you are reporting this post </label>
					<textarea rows='4' name='reportReason' ref={register} />
					<button> Submit </button>
				</form>
			</div> :
			<div className='reportComment'>
				Collin
			</div>			
		}

		</div>
	)
}

export default ReportOverlay