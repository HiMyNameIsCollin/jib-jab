import React from 'react'

const ReactionsDisplay = ({reactionIsOpen, openReactions}) => {

	return(
		<div className='container reactionsDisplay'>
			<div>
				<i onClick={() => openReactions(!reactionIsOpen)} class="far fa-meh"></i>
				<span> 0</span>
			</div>
			<div>
				<i class="far fa-smile-beam"></i>
				<span>0 </span>
			</div>
			<div>
				<i class="far fa-laugh-squint"></i>	
				<span>0 </span>		
			</div>
		</div>
	)
}

export default ReactionsDisplay