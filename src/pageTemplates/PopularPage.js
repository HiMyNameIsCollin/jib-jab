/*import React from 'react'
import MobileNav from '../components/mobileNav/MobileNav'
import DesktopIntro from '../components/desktopIntro/DesktopIntro'
import Feed from '../components/feed/Feed'
import DesktopMenuContainer from '../components/desktopMenuContainer/DesktopMenuContainer'
import Footer from '../components/footer/Footer'

const PopularPage = ({userLoggedIn, navIsOpen}) => {
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
			<DesktopMenuContainer />
			<Footer />
		</React.Fragment>
	)
}

export default PopularPage*/