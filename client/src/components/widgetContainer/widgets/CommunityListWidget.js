import React, { useState, useEffect } from 'react'



const CommunityListWidgetItem = ({ listItem, Link}) => {

	const [communityImg, setCommunityImg] = useState(undefined)

	useEffect(() => {
			fetch(`http://localhost:3000/img/${listItem.name.toLowerCase()}`)
			.then(response => response.json())
			.then(response => setCommunityImg(response))
			.catch(err => console.log(err))
	}, [])
	return(
		<li className='communityListWidgetItem'>
			<Link to={listItem.link} className='link' >
				<img src={communityImg} alt=""/>
				<span> {listItem.name} </span>
			</Link>
		</li>	
		)
}

const CommunityListWidget = ({community, pageType, Link}) => {
return(
	<React.Fragment>
		<div className='communityListWidget'>
			<h4>Communities</h4>
			<ul>
				{
					pageType !== 'communityPage' ?
					<React.Fragment>
						<li className='communityListWidgetItem'>
							<Link to='/' className='link' >
								<img src="https://robohash.org/4" alt=""/>
								<span> Your Feed </span>
							</Link>
						</li>	
						<li className='communityListWidgetItem'>
							<Link to='/c/global' className='link' >
								<img src="https://robohash.org/4" alt=""/>
								<span> Global </span>
							</Link>
						</li>				
					</React.Fragment> :
					null
				}
				{
					community ?
					community.configuration.widgets.communityListWidget.links.map((l, i) => {
						return (
							<CommunityListWidgetItem listItem={l} Link={Link}/>
							)
					}):
					null
				}
			</ul>
			<a className='widgetButton' href=""> View more </a>
		</div>
	</React.Fragment>
	)
}

export default CommunityListWidget