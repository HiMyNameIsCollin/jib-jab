import React from 'react'

const AppendixWidget = ({Link}) => {
	return(
		<div className='appendixWidget'>
			<Link to='/about'> <span> About </span> </Link>
			<a href=""> Hire me </a>
		</div>
	)
}

export default AppendixWidget