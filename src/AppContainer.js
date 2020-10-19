import React, {useState, useEffect } from 'react'
import Header from './components/header/Header'
import FrontPage from './pageTemplates/FrontPage'
import GlobalPage from './pageTemplates/GlobalPage'
import PopularPage from './pageTemplates/PopularPage'
import UserCommunityPage from './pageTemplates/UserCommunityPage'

const AppContainer = () => {

	const [navIsOpen, setNav] = useState(false)
	const [userLoggedIn, setLoggedIn] = useState(true)
	const [windowWidth, setWindowWidth] = useState()

  	useEffect(() => {
	    function handleResize() {
	      setWindowWidth(window.innerWidth)
	    }
	    window.addEventListener("resize", handleResize);
	    handleResize();
	    return () => window.removeEventListener("resize", handleResize);
  	}, [])

	return(
		<div id='AppContainer'>
			<Header navIsOpen={navIsOpen} setNav={setNav} userLoggedIn={userLoggedIn} setLoggedIn={setLoggedIn}/>
			<FrontPage userLoggedIn={userLoggedIn} navIsOpen={navIsOpen} windowWidth={windowWidth}/>
{/*			<GlobalPage userLoggedIn={userLoggedIn} navIsOpen={navIsOpen}/>
			<PopularPage userLoggedIn={userLoggedIn} navIsOpen={navIsOpen}/> 
			<UserCommunityPage userLoggedIn={userLoggedIn} navIsOpen={navIsOpen}/>*/}
		</div>
	)
}

export default AppContainer