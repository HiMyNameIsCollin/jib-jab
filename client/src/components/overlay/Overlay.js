import React, {useState} from 'react'
import Login from './Login'
import Register from './Register'
import SubmitMessage from './SubmitMessage'
import SubmitPost from './SubmitPost'
import Loading from '../loading/Loading'
import './_overlay.sass'

const Overlay = ({overlayIsOpen, setOverlay, user, setUser, setMessage}) => {

	const [loading, setLoading] = useState(false)

	return(
		<div className='overlay'>
	{
		loading ?
		<Loading /> : 
		null
	}
	{
		overlayIsOpen === 'login' ?
		<Login  setOverlay={setOverlay} setLoading={setLoading} user={user} setUser={setUser} /> :
		overlayIsOpen === 'register' ?
		<Register setOverlay={setOverlay} setLoading={setLoading}/> :
		overlayIsOpen === 'submitPost' ?
		<SubmitPost setOverlay={setOverlay} setLoading={setLoading} user={user} setMessage={setMessage}/> :
		null
	}
		</div>
	)
}

export default Overlay