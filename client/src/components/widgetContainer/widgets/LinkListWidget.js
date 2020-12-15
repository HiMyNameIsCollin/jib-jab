import React from 'react'

const LinkListWidget = ({widgetContent}) => {
	/*NTS: LIMIT THE CHARACTERS ALLOWED IN LINKS*/
	return(
		<div className='linkListWidget'>
			<h4>{widgetContent.header}</h4> 
			<ul>
			{
				widgetContent.links.map((l, i) => {
					return (
					<li key={i}>
						<a className='widgetButton' href={l.link} target='_blank'> {l.name}</a>
					</li>
					)
				})
			}
			</ul>

		</div>
	)
}

export default LinkListWidget