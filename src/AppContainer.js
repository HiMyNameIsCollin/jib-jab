import React, {useState} from 'react'
import Header from './components/header/Header'
import MobileNav from './components/mobileNav/MobileNav'
import Feed from './components/feed/Feed'

const AppContainer = () => {

	const [navIsOpen, setNav] = useState(false)
	const [userLoggedIn, setLoggedIn] = useState(true)

	return(
		<div id='AppContainer'>
			<Header navIsOpen={navIsOpen} setNav={setNav} userLoggedIn={userLoggedIn} setLoggedIn={setLoggedIn}/>
			{
				navIsOpen ?
				<div class='menuOverLay'>
					<MobileNav userLoggedIn={userLoggedIn} />
				</div> :
				null
			}
			<Feed userLoggedIn={userLoggedIn} />
		</div>
	)
}

export default AppContainer