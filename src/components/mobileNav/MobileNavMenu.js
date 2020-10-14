import React from 'react'

const MobileNavMenu = ({type}) => {
	if(type === 'comm'){
	return(
		<div className='mobileNavMenu'>
			<div>
				<img src='https://robohash.org/2' alt='Community avatar' />
				<span> Toronto </span> 
			</div>
			<a href='#'> View all </a>
		</div>
	)
	} else if (type === 'myComm') {
	return(
		<div className='mobileNavMenu'>
			
			<a href='#'> View all </a>
		</div>
	)
	} else if (type === 'settings'){
	return(
		<div className='mobileNavMenu'>

			<a href='#'> View all </a>
		</div>
	)
	} else if (type === 'about') {
	return(
		<div className='mobileNavMenu'>
			<div>
				<span> Mission </span> 
			</div>
		</div>
	)
	}
}

export default MobileNavMenu