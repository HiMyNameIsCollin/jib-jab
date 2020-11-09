import React from 'react'

const initialState = {
	userName: '',
	communities: ['announcements'],
	karma: 1,
	followers: [],
	settings: {
		feedType: 'list'
	}
}


const MobileNavMenu = ({Link, navType, user, setUser, setNav}) => {
	if(navType === 'comm'){
	return(
		<div className='mobileNavMenu'>
			<div>
				<Link to='/community' className='link'>
				<img src='https://robohash.org/2' alt='Community avatar' />
				<span> Toronto </span> 
				</Link>
			</div>
			<Link to='/community/list' className='link'>
				View more
			</Link>
		</div>
	)
	} else if (navType === 'myComm') {
	return(
		<div className='mobileNavMenu'>
			
			<Link to='/community/list' className='link'>
				View more
			</Link>
		</div>
	)
	} else if (navType === 'settings'){
	return(
		<div className='mobileNavMenu'>
		{
			user.userName !== '' ?
			<div onClick={() => {
				const refreshToken = window.localStorage.getItem('refreshToken')
				setNav(false)
				fetch('http://localhost:4000/api/logout', {
					method: 'delete',
					headers: {'Content-Type' : 'application/json'},
					body: JSON.stringify({
						token: refreshToken
					})
				})
				.then(response => {
					setUser(initialState)
				})
				.catch(err => console.log(err))
			}}> 
				<img src='https://robohash.org/2' alt='Community avatar' />
				<span> Logout </span> 
			</div> :
			null
		}

			<Link to='/community/list' className='link'>
				View more
			</Link>
		</div>
	)
	}
}

export default MobileNavMenu