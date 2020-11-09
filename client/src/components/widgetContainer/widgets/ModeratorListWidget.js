import React from 'react'

const ModeratorListWidget = () => {
	return(
		<div className='moderatorListWidget'>
			<h4> Community Moderators </h4>
			<a className='widgetButton' href=""> <i class="fas fa-inbox"></i><span>Message the mods</span> </a>
			<ul>
				<li>
					<a href="">/u/Collin</a> <span>Flair </span>
				</li>
				<li>
					<a href="">/u/Collin</a> <span>Flair </span>
				</li>
			</ul>
			<div className='container'>
				<a href=""> View all moderators </a>
			</div>
		</div>
	)
}

export default ModeratorListWidget