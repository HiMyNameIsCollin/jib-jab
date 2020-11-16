import React from 'react'

const AboutCommunityWidget = ({pageContent}) => {
	return(
		<div className='aboutCommunityWidget'>
			<h4>{pageContent.configuration.widgets.aboutWidget.header}</h4>
			<p> {pageContent.configuration.widgets.aboutWidget.body}</p>
			<div className='container'>
				<div className='container'>
					<p> 0 </p>
					<p> Subscribers </p>
				</div>
				<div className='container'>
					<p> 0 </p>
					<p> Online </p>
				</div>
			</div>
			<p><i class="fas fa-pepper-hot"></i>Created: November 5 2020 </p>
		</div>
	)
}

export default AboutCommunityWidget