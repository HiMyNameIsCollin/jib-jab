import React, { useState, useEffect } from 'react'
import Intro from '../components/intro/Intro'
import Feed from '../components/feed/Feed'
import WidgetContainer from '../components/widgetContainer/WidgetContainer'
import Footer from '../components/footer/Footer'
import Loading from '../components/loading/Loading'

const FrontPage = ({user, setUser, windowWidth, Link, pageContent}) => {

	const [mobileViewIsFeed, setMobileView] = useState(true)

	if(pageContent && user) {
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
					windowWidth={windowWidth}
					pageContent={pageContent}/>
					<WidgetContainer Link={Link} pageType={'frontPage'} user={user} pageContent={pageContent}/> 
				</React.Fragment> :
				mobileViewIsFeed ?
				<Feed 
				Link={Link} 
				pageType={'frontPage'} 
				user={user} 
				setUser={setUser} 
				windowWidth={windowWidth}
				pageContent={pageContent}/>:
				<WidgetContainer Link={Link} pageType={'frontPage'} user={user} pageContent={pageContent}/> 
			}

			<Footer />
		</React.Fragment>
	)	
	} else {
		return <Loading />
	}

}

export default FrontPage