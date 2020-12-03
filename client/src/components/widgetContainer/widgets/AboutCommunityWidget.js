import React from 'react'

const AboutCommunityWidget = ({pageContent}) => {
	return(
		<div className='aboutCommunityWidget'>
			<h4>{pageContent.configuration.widgets.aboutWidget.header}</h4>
			<p> {pageContent.configuration.widgets.aboutWidget.body}</p>
			<p> <span>{pageContent.followers.length}</span> Subscribers </p>
			<p><i class="fas fa-pepper-hot"></i>Created: November 5 2020 </p>
		</div>
	)
}

export default AboutCommunityWidget