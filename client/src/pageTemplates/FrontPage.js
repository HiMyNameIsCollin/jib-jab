import React, { useState, useEffect } from 'react'
import Intro from '../components/intro/Intro'
import Feed from '../components/feed/Feed'
import WidgetContainer from '../components/widgetContainer/WidgetContainer'
import Footer from '../components/footer/Footer'

const FrontPage = ({user, setUser, windowWidth, Link}) => {

	const [mobileViewIsFeed, setMobileView] = useState(true)

	useEffect(() => {
		fetch('http://localhost:3000/popular/123')
		.then(response => response.json())
		.then(console.log)
	}, [])

	return(
		<React.Fragment>
			<Intro pageType={'frontPage'} windowWidth={windowWidth} />
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
					pageType={'frontPage'} 
					user={user} 
					setUser={setUser}
					windowWidth={windowWidth}/>
					<WidgetContainer Link={Link} pageType={'frontPage'}/> 
				</React.Fragment> :
				mobileViewIsFeed ?
				<Feed 
				Link={Link} 
				pageType={'frontPage'} 
				user={user} 
				setUser={setUser} 
				windowWidth={windowWidth}/>:
				<WidgetContainer Link={Link} pageType={'frontPage'}/> 
			}

			<Footer />
		</React.Fragment>
	)
}

export default FrontPage