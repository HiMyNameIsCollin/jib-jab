  import React, { useState, useEffect } from 'react'


const CommunityListWidgetItem = ({ listItem, Link}) => {

	const [communityImg, setCommunityImg] = useState(undefined)

	useEffect(() => {
		let isMounted = true
			fetch(`http://localhost:3000/img/${listItem.toLowerCase()}`)
			.then(response => response.json())
			.then(response => {
				if(isMounted) {
					setCommunityImg(response)
				}})
			.catch(err => console.log(err))
			return () => { isMounted = false }
	}, [])
	return(
		<li className='communityListWidgetItem'>
			<Link to={`/c/${listItem}`} className='link' >
				<img src={communityImg} alt=""/>
				<span> {listItem} </span>
			</Link>
		</li>	
		)
}

const CommunityListWidget = ({user, pageContent, pageType, Link}) => {
return(
	<React.Fragment>
		<div className='communityListWidget'>
			<h4>Communities</h4>
			<ul>
				{
					pageContent.communities.length !== 0 ?
					pageContent.communities.map((l, i) => {
						return (
							<CommunityListWidgetItem listItem={l} Link={Link}/>
							)
					}) :
					<>
					<CommunityListWidgetItem listItem={'Global'} Link={Link}/>
					</>
				}

			</ul>
			<a className='widgetButton' href=""> View more </a>
		</div>
	</React.Fragment>
	)
}

export default CommunityListWidget