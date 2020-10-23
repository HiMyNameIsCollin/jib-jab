import React from 'react'

const MobileNavMenu = ({Link, navType}) => {
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

			<Link to='/community/list' className='link'>
				View more
			</Link>
		</div>
	)
	}
}

export default MobileNavMenu