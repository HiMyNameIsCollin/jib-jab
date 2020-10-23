import React, { useState, useEffect } from 'react'
import Intro from '../components/intro/Intro'
import Feed from '../components/feed/Feed'
import WidgetContainer from '../components/widgetContainer/WidgetContainer'
import Footer from '../components/footer/Footer'


const GlobalPage = ({user, setUser,  navIsOpen, windowWidth ,Link}) => {

	const [mobileViewIsFeed, setMobileView] = useState(true)
	return(
		<React.Fragment>
			{
				windowWidth <= 920 ?
				<div className='container mobileViewToggle'>
					<span onClick={() => setMobileView(true)} className={mobileViewIsFeed ? 'mobileViewChoice' : null}> Feed </span>
					<span onClick={() => setMobileView(false)} className={!mobileViewIsFeed ? 'mobileViewChoice' : null}> Extras </span>
				</div> :
				null
			}
			{
				windowWidth > 920 ?
				<React.Fragment >
					<Feed 
					Link={Link} 
					pageType={'globalPage'} 
					user={user} 
					setUser={setUser}
					windowWidth={windowWidth}/>
					<WidgetContainer Link={Link} pageType={'globalPage'}/> 
				</React.Fragment> :
				mobileViewIsFeed ?
				<Feed 
				Link={Link} 
				pageType={'globalPage'} 
				user={user} 
				setUser={setUser} 
				windowWidth={windowWidth}/>:
				<WidgetContainer Link={Link} pageType={'globalPage'}/> 
			}

			<Footer />
		</React.Fragment>
	)
}

export default GlobalPage