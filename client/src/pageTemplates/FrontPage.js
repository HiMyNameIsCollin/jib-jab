import React, { useState, useEffect } from 'react'
import Intro from '../components/intro/Intro'
import Feed from '../components/feed/Feed'
import WidgetContainer from '../components/widgetContainer/WidgetContainer'
import Footer from '../components/footer/Footer'
import Loading from '../components/loading/Loading'

const FrontPage = ({user, setUser, windowWidth, Link, location, pageType}) => {

	const [pageContent, setPageContent] = useState(undefined)
	const [mobileViewIsFeed, setMobileView] = useState(true)

	useEffect(() => {
		console.log(user)
			fetch(`http://localhost:3000/api/`, {
				method: 'post',
				headers: {'Content-Type' : 'application/json'},
				body: JSON.stringify({
					communities: user.communities
				})
			})
			.then(response => response.json())
			.then(response => {
					setPageContent(response)
			})
			.catch(err => console.log(err))
	},[])

	if(pageContent && user) {
	return(
		<React.Fragment>
			<Intro pageType={pageType} windowWidth={windowWidth} />
			{
				windowWidth <= 920 ?
				<div className='container mobileViewToggle'>
					<span onClick={() => setMobileView(true)} className={mobileViewIsFeed ? 'mobileViewChoice' : null}> Feed </span>
					<span onClick={() => setMobileView(false)} className={!mobileViewIsFeed ? 'mobileViewChoice' : null}> About </span>
				</div> :
				null
			}
			{
				windowWidth > 920 ?
				<React.Fragment >
					<Feed 
					Link={Link} 
					pageType={pageType} 
					user={user} 
					setUser={setUser}
					windowWidth={windowWidth}
					pageContent={pageContent}/>
					<WidgetContainer Link={Link} pageType={pageType} user={user} pageContent={pageContent}/> 
				</React.Fragment> :
				mobileViewIsFeed ?
				<Feed 
				Link={Link} 
				pageType={pageType} 
				user={user} 
				setUser={setUser} 
				windowWidth={windowWidth}
				pageContent={pageContent}/>:
				<WidgetContainer Link={Link} pageType={pageType} user={user} pageContent={pageContent}/> 
			}

			<Footer />
		</React.Fragment>
	)	
	} else {
		return <Loading />
	}

}

export default FrontPage