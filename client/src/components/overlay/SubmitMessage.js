import React, { useState, useEffect } from 'react'
import SearchBar from '../searchBar/SearchBar'
import { useForm } from 'react-hook-form'

const SubmitMessage = ({setOverlay, user, setMessage, location}) => {

	const [formSent, setFormSent] = useState(false)
	const { register, handleSubmit, errors} = useForm()
	const [targetCommunity, setTargetCommunity] = useState(undefined)

	useEffect(() => {
		if(location.pathname !== '/' && location.pathname.substr(0, 3) !== '/c/'){
			fetch('http://localhost:3000/api/search', {
				method: 'post',
				headers: {'Content-Type' : 'application/json'},
				body: JSON.stringify({
					query: location.pathname.substr(3, location.pathname.length - 3)
				})
			})
			.then(response => response.json())
			.then(response => setTargetCommunity(response.userArray[0]))
			.catch(err => console.log(err))
		} 
	},[])

	const onSubmit = (data) => {
		if(formSent === false){
			setFormSent(true)
			if(targetCommunity !== undefined) {
				const accessToken = window.localStorage.getItem('accessToken')
				fetch('http://localhost:3000/api/message', {
					method: 'post',
					headers: {
						authorization: `Bearer ${accessToken}`,
						'Content-Type' : 'application/json'
					},
					body: JSON.stringify({
						target: targetCommunity.name,
						subject: data.messageSubject,
						body: data.messageBody,
						type: 'user'
					})
				})
				.then(response => response.text())
				.then(response => {
					if(response === 'Success'){
						setMessage('Message successfully sent')
						setOverlay(undefined)
					} else{
						setFormSent(false)
						setMessage('Something went wrong...')
					}
				})
				.catch(err => {
					setMessage('Something went wrong...')
					setFormSent(false)
				})
			} else {
				setMessage('Who you sending this to?')
				setFormSent(false)
			}
		}
	}

	return(
		<div className='submitMessage'>
			<h3>Send a message</h3>
			<span 
			className='closeOverlay'
			onClick={() => setOverlay(undefined)}> X </span>
			<SearchBar searchBarType='submitMessage' user={user} setTargetCommunity={setTargetCommunity}/>
			{
				targetCommunity !== undefined ?
				<div className='targetCommunity container'>
					<img src={targetCommunity.image} alt="" />
					{targetCommunity.name}
				</div> :
				null
			}
			<form 
			onSubmit={handleSubmit(onSubmit)} 
			className={formSent ? 'formDeactivated' : null}>
				{errors.messageSubject && errors.messageSubject.type === 'required' && <p> Posts need titles! </p>}
				{errors.messageSubject && errors.messageSubject.type === 'maxLength' && <p> Whoa whoa, why not make that title a bit more concise? </p>}
				<input type='text' placeholder='Subject' name='messageSubject' ref={register({required: true, maxLength: 150})}/>
				{errors.messageBody && errors.messageBody.type === 'maxLength' && <p> Cool story bro, lets summarize just a bit. </p>}
				<textarea rows='4' placeholder="What's going on?" name="messageBody" ref={register({required: true, maxLength: 2000})} />
				<button> Submit </button>
			</form>
		</div>
	)
}

export default SubmitMessage