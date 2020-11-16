import React from 'react'

const InteractionWidget = ({pageContent}) => {
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
					<p> {pageContent.karma} </p>
					<p> Karma </p>
				</div>
				<div >
					<p> {pageContent.followers.length} </p>
					<p> Followers </p>
				</div>
				<div>
					<p> User since: </p>
					<p> {pageContent.created}</p>
				</div>
			</div>
		</div>
	)
}


export default InteractionWidget