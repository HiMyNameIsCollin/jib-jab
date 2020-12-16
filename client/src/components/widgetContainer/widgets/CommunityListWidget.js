  import React, { useState, useEffect } from 'react'


const CommunityListWidgetItem = ({ listItem, Link}) => {

	const [communityImg, setCommunityImg] = useState(undefined)

	useEffect(() => {
		let isMounted = true
			fetch(`http://jibjab.herokuapp.com/api/c/img/${listItem.toLowerCase()}`)
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

const CommunityListWidget = ({user, pageContent, widgetContent,  pageType, Link}) => {
return(
	<React.Fragment>
		<div className='communityListWidget'>
			<h4>{widgetContent.header}</h4>
			<ul>
				{
					pageContent.communities.length !== 0 ?
					pageContent.communities.map((l, i) => {
						return (
							<CommunityListWidgetItem listItem={l} Link={Link} key={i}/>
							)
					}) :
					<React.Fragment>
					<CommunityListWidgetItem listItem={'Global'} Link={Link}/>
					</React.Fragment>
				}

			</ul>
			{/*<a className='widgetButton' href=""> View more </a>*/}
		</div>
	</React.Fragment>
	)
}

export default CommunityListWidget