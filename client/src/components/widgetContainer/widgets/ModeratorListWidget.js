import React from 'react'

const ModeratorListWidget = ({pageContent, Link}) => {
	return(
		<div className='moderatorListWidget'>
			<h4> Community Moderators </h4>
			{/*<button className='widgetButton' href=""> <i class="fas fa-inbox"></i><span>Message the mods</span> </button>*/}
			<ul>
			{
				pageContent.moderators.map((m, i) => {
					return(
					<li key={i}>
						<Link to={`/u/${m}`}>{`/u/${m}`}</Link>
					</li>
					)
				})
			}

			</ul>
		</div>
	)
}

export default ModeratorListWidget