import React, {useState} from 'react'
import { useForm } from 'react-hook-form'

const Register = ({setOverlay, setLoading}) => {

	const [formSent, setFormSent] = useState(false)
	const [userNameTaken, setUserNameTaken] = useState(false)
	const [error, setError] = useState(false)
	const { register, handleSubmit, errors, watch} = useForm()


	const onSubmit = (data) => {
		if(!formSent){
			setFormSent(true)
			setLoading(true)
			setError(false)
			fetch('https://jibjab.herokuapp.com/api/register', {
				method: 'post',
				headers: {'Content-Type' : 'application/json'},
				body: JSON.stringify({
					userName: data.userName,
					email: data.email,
					password: data.password
				})
			})
			.then(result => result.json())
			.then(data => {
				setFormSent(false)
				setLoading(false) 
				if(data.success) {
					setOverlay('login')
				} else {
					setUserNameTaken(true)
				}
			})
			.catch(err => {
				console.log(err)
				setError(true)
				setFormSent(false)
				setLoading(false) 
			})
		}

	}

	return(
		<div className='register'>
			<h3>Welcome to JibJab</h3>
			<h4> Register or <span onClick={() => setOverlay('login')}> Login </span></h4>
			<span 
			onClick={() => setOverlay(undefined)}
			style={{position: 'absolute', top: '1em', right: '1em', fontSize: '1.5em'}}> X </span>
			<form onSubmit={handleSubmit(onSubmit)} className={formSent ? 'formDeactivated' : null}>
			    {errors.userName && errors.userName.type === 'required' && <p> Username field required </p> }
			    {errors.userName && errors.userName.type === 'maxLength' &&<p> Username must contain between 3-20 alpha-numeric characters, dashes(-) and underscores(_) permitted </p> }
			    {errors.userName && errors.userName.type === 'pattern' && <p> Username must contain between 3-20 alpha-numeric characters, dashes(-) and underscores(_) permitted </p> }
			   	{userNameTaken ? <p> Username is already taken </p> : null}
			   	{error ? <p> There has been a connection error </p>: null}
			   <input type="text" placeholder="Username" name="userName" ref={register({required: true, maxLength: 20, pattern: /^[a-z0-9_-]{3,20}$/i})} />
			    {errors.email && <p> Enter a valid email </p>}
			    <input type="text" placeholder="Email" name="email" ref={register({required: true, pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i})} />
			   	{errors.password && errors.password.type === 'required' && <p> Password field required  </p>}
			    {errors.password && errors.password.type === 'minLength' && <p> Password must be at least 8 characters  </p>}
			    <input type="password" placeholder="Password" name="password" ref={register({required: true, minLength: 8})} />
			    {errors.confirmPassword && errors.confirmPassword.type === 'required' && <p> Confirm field required </p>}
			    {errors.confirmPassword && errors.confirmPassword.type === 'validate' && <p> Password fields must match</p>}
			    <input type="password" placeholder="ConfirmPassword" name="confirmPassword" ref={register({ validate: value => value === watch('password'), required: true})} />
				<button> Submit </button>
			</form>
		</div>
	)
}

export default Register