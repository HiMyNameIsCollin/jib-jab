import React, { useState, useEffect } from 'react'
import MobileNav from '../components/mobileNav/MobileNav'
import Intro from '../components/intro/Intro'
import Feed from '../components/feed/Feed'
import DesktopWidgetContainer from '../components/desktopWidgetContainer/DesktopWidgetContainer'
import Footer from '../components/footer/Footer'

const FrontPage = ({userLoggedIn, navIsOpen, windowWidth}) => {

	const [mobileViewIsFeed, setMobileView] = useState(true)

	return(
		<React.Fragment>
			<Intro type={'frontPage'} windowWidth={windowWidth} />
			{
				navIsOpen ?
				<div class='menuOverLay'>
					<MobileNav userLoggedIn={userLoggedIn} />
				</div> :
				null
			}
			{
				windowWidth <= 920 ?
				<div id='mobileViewToggle' className='container'>
					<span onClick={() => setMobileView(true)} className={mobileViewIsFeed ? 'mobileViewChoice' : null}> Feed </span>
					<span onClick={() => setMobileView(false)} className={!mobileViewIsFeed ? 'mobileViewChoice' : null}> About </span>
				</div> :
				null
			}
			{
				windowWidth > 920 ?
				<React.Fragment >
					<Feed userLoggedIn={userLoggedIn} windowWidth={windowWidth}/>
					<DesktopWidgetContainer /> 
				</React.Fragment> :
				mobileViewIsFeed ?
				<Feed userLoggedIn={userLoggedIn} windowWidth={windowWidth}/>:
				<DesktopWidgetContainer /> 
			}

			<Footer />
		</React.Fragment>
	)
}

export default FrontPage