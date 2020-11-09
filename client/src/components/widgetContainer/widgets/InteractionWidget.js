import React from 'react'

const InteractionWidget = () => {
	return(
		<div className='interactionWidget'>
			<h4>
				Interact
			</h4>
			<div className='interactionWidgetButtons'>
				<div>
					Follow
				</div>
				<div>
					Message
				</div>
			</div>
			<div className='interactionWidgetScore container'>
				<div >
					<p> 0 </p>
					<p> Karma </p>
				</div>
				<div >
					<p> 0 </p>
					<p> Followers </p>
				</div>
				<div>
					<p> User since: </p>
					<p> Nov 5th, 2020</p>
				</div>
			</div>
		</div>
	)
}


export default InteractionWidget