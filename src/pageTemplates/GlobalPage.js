/*import React from 'react'
import MobileNav from '../components/mobileNav/MobileNav'
import DesktopIntro from '../components/desktopIntro/DesktopIntro'
import Feed from '../components/feed/Feed'
import DesktopWidgetContainer from '../components/desktopWidgetContainer/DesktopWidgetContainer'
import Footer from '../components/footer/Footer'

const GlobalPage = ({userLoggedIn, navIsOpen}) => {
	return(
		<React.Fragment>
			<DesktopIntro />
			{
				navIsOpen ?
				<div class='menuOverLay'>
					<MobileNav userLoggedIn={userLoggedIn} />
				</div> :
				null
			}
			<Feed userLoggedIn={userLoggedIn} /> 
			<DesktopWidgetContainer />
			<Footer />
		</React.Fragment>
	)
}

export default GlobalPage*/