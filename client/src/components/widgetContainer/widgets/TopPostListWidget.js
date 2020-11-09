import React from 'react'

	const TopPostListWidgetItem = () => {
		return(
			<li className='topPostListWidgetItem'>
				<span> Post title </span> <span>0 Comments</span> <span> 0 upvotes </span>
			</li>
		)
	}

const TopPostListWidget = () => {

	return(
		<div className='topPostListWidget'>
			<h4> Most viewed posts in 24 hours </h4>
			<ul>	
				<TopPostListWidgetItem />
			</ul>
				<a className='widgetButton' href=""> View more </a>
		</div>	
	)
}

export default TopPostListWidget