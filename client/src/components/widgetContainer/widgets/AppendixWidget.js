import React from 'react'

const AppendixWidget = ({Link}) => {
	return(
		<div className='appendixWidget'>
			<Link to='/about'> <span> About </span> </Link>
			<a href="https://himynameiscollin.github.io/portfolio-v1/" target='_blank'> Hire me </a>
		</div>
	)
}

export default AppendixWidget