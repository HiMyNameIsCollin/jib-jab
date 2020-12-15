import React from 'react'

const AnnouncementWidget = ({widgetContent}) => {
	return(
		<div className='announcementWidget'>
			<h4> {widgetContent.header} </h4>
			<p> {widgetContent.body}</p>
		</div>
	)
}

export default AnnouncementWidget