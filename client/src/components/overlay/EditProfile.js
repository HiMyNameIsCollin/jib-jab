import React, { useState } from 'react'
import { useForm } from 'react-hook-form'





const EditProfile = ({setOverlay, setMessage, loading,  setLoading, user, history}) => {
	const HeaderExample = () => {
	return(
		<div className='communityHeader createCommunityPreview' style={{backgroundImage: `url(${headerImg}})` }}> 
			<div className='container'>
				<img src={image !== '' ? image : user.configuration.image}  alt="That image is invalid"/>
			</div>
			<div className=' container'>
				<p> {user.userName} </p>
			</div>
		</div>
	)
}

	
	const [image, setImage] = useState('')
	const [headerImg, setHeaderImg] = useState(user.configuration.headerImg)
	const [formSent, setFormSent] = useState(false)
	const [manageAccount, setManageAccount] = useState('header')
	const { register, handleSubmit} = useForm()

	const onSubmit = (data) => {
		setLoading(true)
		if(!formSent){
			setFormSent(true)
	  		const accessToken = window.localStorage.getItem('accessToken')
			fetch('https://jibjab.herokuapp.com/api/editProfile' ,{
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.then(response => {
				setLoading(false)
				if(response.success){
					setOverlay(undefined)
					setFormSent(false)
					history.push('/')
					history.goBack()
				} else{
					setMessage('There was an error updating that profile')
					setFormSent(false)
				}
			})
			.catch(err => {
				console.log(err)
				setLoading(false)
				setMessage('There was an error updating that profile')
			})
		}

	}

	return(
		<div className='editProfile'>
			<h3>User settings:</h3>
			<span 
			className='closeOverlay'
			onClick={() => setOverlay(undefined)}> X </span>
			<div className='container postSelectionMenu'>
				<span 
					className={ manageAccount === 'header' ? 'postSelectionSelected' : null }
					onClick={() => setManageAccount('header')}>
					Profile header
				</span>
				<span 	
					className={ manageAccount === 'settings' ? 'postSelectionSelected' : null }
					onClick={() => setManageAccount('settings')}>
					Settings
				</span>
			</div>
		{
			manageAccount === 'header' ? 
			<React.Fragment>
			<HeaderExample /> 
			<form className={formSent ? 'formDeactivated' : null}
				onSubmit={handleSubmit(onSubmit)}>
				
				<label htmlFor="image" >Community avatar</label>
				<input 
				type="text" 
				name='image'
				onBlur={(e) => setImage(e.target.value)} 
				placeholder='eg. https://robohash.org/picture' 
				ref={register({required: false})}/>
				<label htmlFor="headerImg" >Community banner:</label>
				<input 
				onBlur={(e) => setHeaderImg(e.target.value)}
				type="text" 
				name='headerImg' 
				placeholder='eg. https://source.unsplash.com/random/800x1200'
				ref={register({required: false})}/>
				<button> Submit </button> 
			</form> 
			</React.Fragment>:
			<div>
				Settings
			</div>	
		}

		</div>
	)
}

export default EditProfile


