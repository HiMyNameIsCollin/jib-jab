import React, {useState} from 'react'
import Login from './Login'
import Register from './Register'
import SubmitMessage from './SubmitMessage'
import SubmitPost from './SubmitPost'
import EditProfile from './EditProfile'
import ManageCommunity from './ManageCommunity'
import Loading from '../loading/Loading'
import './_overlay.sass'

const Overlay = ({overlayIsOpen, setOverlay, user, setUser, setMessage, location, history}) => {

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
		<Login  
		setOverlay={setOverlay} 
		setLoading={setLoading} 
		user={user} 
		setUser={setUser} /> :
		overlayIsOpen === 'register' ?
		<Register 
		setOverlay={setOverlay} 
		setLoading={setLoading}/> :
		overlayIsOpen === 'submitPost' ?
		<SubmitPost 
		location={location}  
		setOverlay={setOverlay} 
		setLoading={setLoading} 
		user={user} 
		setMessage={setMessage}/> :
		overlayIsOpen === 'submitMessage' ?
		<SubmitMessage 
		location={location} 
		setOverlay={setOverlay} 
		setLoading={setLoading} 
		user={user} 
		setMessage={setMessage}/>:
		overlayIsOpen === 'editProfile'?
		<EditProfile 
		setOverlay={setOverlay} 
		setMessage={setMessage} 
		user={user} 
		loading={loading}
		setLoading={setLoading}
		history={history} />:
		overlayIsOpen === 'manageCommunity'?
		<ManageCommunity
		setOverlay={setOverlay} 
		setMessage={setMessage} 
		user={user} 
		loading={loading}
		setLoading={setLoading}
		history={history} 
		location={location}/>:
		null
	}
		</div>
	)
}

export default Overlay