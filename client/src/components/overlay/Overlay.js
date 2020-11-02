import React, {useState} from 'react'
import Login from './Login'
import Register from './Register'
import Loading from '../loading/Loading'
import './_overlay.sass'

const Overlay = ({overlayIsOpen, setOverlay, user, setUser}) => {

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
		<Register setOverlay={setOverlay} setLoading={setLoading}/>
	}
		</div>
	)
}

export default Overlay