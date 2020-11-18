import React from 'react'

const SubmitMessage = ({setOverlay}) => {
	return(
		<div className='submitMessage'>
			<h3>Send a message</h3>
			<span 
			onClick={() => setOverlay(undefined)}
			style={{position: 'absolute', top: '1em', right: '1em', fontSize: '1.5em'}}> X </span>
		</div>
	)
}

export default SubmitMessage