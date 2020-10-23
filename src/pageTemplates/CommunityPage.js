import React, { useState, useEffect } from 'react'
import Intro from '../components/intro/Intro'
import Feed from '../components/feed/Feed'
import WidgetContainer from '../components/widgetContainer/WidgetContainer'
import Footer from '../components/footer/Footer'


const CommunityPage = ({user, setUser, windowWidth , Link}) => {
	const [mobileViewIsFeed, setMobileView] = useState(true)
	return(
		<React.Fragment>
			<Intro pageType={'communityPage'} windowWidth={windowWidth} />
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
					pageType={'communityPage'} 
					user={user} 
					setUser={setUser}
					windowWidth={windowWidth}/>
					<WidgetContainer Link={Link} pageType={'communityPage'}/> 
				</React.Fragment> :
				mobileViewIsFeed ?
				<Feed 
				Link={Link} 
				pageType={'communityPage'} 
				user={user} 
				setUser={setUser} 
				windowWidth={windowWidth}/>:
				<WidgetContainer Link={Link} pageType={'communityPage'}/> 
			}

			<Footer />
		</React.Fragment>
	)
}

export default CommunityPage