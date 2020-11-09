import React from 'react'

const LinkListWidget = () => {
	/*NTS: LIMIT THE CHARACTERS ALLOWED IN LINKS*/
	return(
		<div className='linkListWidget'>
			<h4>Links</h4> 
			<ul>
				<li>
					<a className='widgetButton' href="" target='_blank'> Link to somewhere</a>
				</li>
				<li>
					<a className='widgetButton' href="" target='_blank'> Link to somewhere</a>
				</li>
			</ul>

		</div>
	)
}

export default LinkListWidget