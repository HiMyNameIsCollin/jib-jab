import React from 'react'

const ReactionsWindow = ({reactionIsOpen, openReactions}) => {
	return(
		<div className='container reactionsWindow'>
			<div>
				<i onClick={() => openReactions(!reactionIsOpen)} class="fas fa-times"></i>
			</div>
			<div>
				<i class="far fa-smile-beam"></i>
				<span>0 </span>
			</div>
			<div>
				<i class="far fa-laugh-squint"></i>	
				<span>0 </span>		
			</div>
			<div>
				<i class="far fa-sad-tear"></i>
				<span>0 </span>			
			</div>	
			<div>
				<i class="far fa-surprise"></i>	
				<span>0 </span>		
			</div>	
			<div>
				<i class="far fa-grimace"></i>
				<span>0 </span>		
			</div>
			</div>
	)
}

export default ReactionsWindow