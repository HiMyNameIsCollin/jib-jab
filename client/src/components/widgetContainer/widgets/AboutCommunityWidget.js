import React from 'react'
import timeDifference from '../../../utils/timeDifference'

const AboutCommunityWidget = ({widgetContent, pageContent}) => {
	return(
		<div className='aboutCommunityWidget'>
			<h4>{widgetContent.header}</h4>
			<p> {widgetContent.body}</p>
			<p> <span>{pageContent.followers.length}</span> Subscribers </p>
			<p><i className="fas fa-pepper-hot"></i>Community EST: {timeDifference(pageContent.createdOn)} </p>
		</div>
	)
}

export default AboutCommunityWidget