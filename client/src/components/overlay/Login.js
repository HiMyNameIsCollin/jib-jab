import React, { useState, } from 'react'
import { useForm } from 'react-hook-form'

const Login = ({setOverlay, setLoading, user, setUser, url}) => {

	const [formSent, setFormSent] = useState(false)
	const [error, setError] = useState(false)
	const [incorrect, setIncorrect] = useState(false)
	const { register, handleSubmit, errors } = useForm()

	const onSubmit = data => {
		if(!formSent){
			setFormSent(true)
			setLoading(true)
			setError(false)
			setIncorrect(false)
			fetch(`${url}/api/login`, {
				method: 'post',
				headers: {'Content-Type' : 'application/json'},
				body: JSON.stringify({
					userName: data.userName,
					password: data.password
				})
			})
			.then(response => response.json())
			.then(data => {
				setLoading(false)
				setFormSent(false)
				if(data.accessToken){
					setUser(data.result)
					window.localStorage.setItem("accessToken", data.accessToken)
					window.localStorage.setItem("refreshToken", data.refreshToken)
					setOverlay(undefined)
					setLoading(false)
				} else {
					setLoading(false)
					setIncorrect(true)
					setFormSent(false)
				}
			})
			.catch(err => {
				setLoading(false)
				setError(true)
				setFormSent(false)
				console.log(err)
			})
		}
	}

	return(
		<div className='login'>
			<h3>Welcome to JibJab</h3>
			<h4> Login or <span onClick={() => setOverlay('register')}> Register </span></h4>
			<span 
			onClick={() => setOverlay(undefined)}
			style={{position: 'absolute', top: '1em', right: '1em', fontSize: '1.5em'}}> X </span>
			<form onSubmit={handleSubmit(onSubmit)} className={formSent ? 'formDeactivated' : null}>
				<label htmlFor="userName">Your username: </label>
				{errors.userName && errors.userName.type === 'required' && <p> Username field required </p> }
				{errors.userName && errors.userName.type === 'pattern' && <p> Username must contain between 3-20 alpha-numeric characters, dashes(-) and underscores(_) permitted </p> }
				{errors.userName && errors.userName.type === 'minLength' && <p> Username must contain between 3-20 alpha-numeric characters, dashes(-) and underscores(_) permitted </p> }
				<input type="text" placeholder="Username" name="userName" ref={register({required: true, minLength: 3, maxLength: 20, pattern: /^[a-z0-9_-]{3,20}$/i})} />
				<label htmlFor="password">Password:</label>
				{errors.password && errors.password.type === 'required' && <p> Password field required  </p>}
				{errors.password && errors.password.type === 'minLength' && <p> Password must be at least 8 characters  </p>}
				<input type="password" placeholder="Password" name="password" ref={register({required: true, minLength: 8})} />
				{error ? <p> Connection error </p> : null}
				{incorrect ? <p> Incorrect credidentals </p> : null}
				<button> Submit </button> 
		    </form>
		</div>
	)
}

export default Login