import React, {useState, useEffect } from 'react'
import Header from './components/header/Header'
import MobileNav from './components/mobileNav/MobileNav'
import Overlay from './components/overlay/Overlay'
import FrontPage from './pageTemplates/FrontPage'
import GlobalPage from './pageTemplates/GlobalPage'
import CommunityPage from './pageTemplates/CommunityPage'
import ProfilePage from './pageTemplates/ProfilePage'
import PostPage from './pageTemplates/PostPage'
import AboutPage from './pageTemplates/AboutPage'



const AppContainer = ({Link, Route, Switch, useLocation}) => {

	const [windowWidth, setWindowWidth] = useState()
	const [navIsOpen, setNav] = useState(false)
	const [currentLocation, setCurrentLocation] = useState(undefined)
	const [overlayIsOpen, setOverlay] = useState(undefined)
	const [user, setUser] = useState({
			userName: '',
			communities: [],
			karma: 1,
			followers: [],
			settings: {
				feedType: 'list'
			}
		})

	const location = useLocation()

  	useEffect(() => {
	    function handleResize() {
	      setWindowWidth(window.innerWidth)
	    }
	    window.addEventListener("resize", handleResize);
	    handleResize();
	    return () => window.removeEventListener("resize", handleResize);
  	}, [])

  	useEffect(() => {
  		setCurrentLocation(location.pathname)
  		tokenRefresh()
  	}, [])

  	useEffect(() => {
  		if(currentLocation !== location.pathname){
  			tokenRefresh()
  		}
  	},[location.pathname])

  	useEffect(() => {
  		if(navIsOpen){
  			setOverlay(undefined)
  		}
  	},[navIsOpen])

  	function tokenRefresh() {
		const accessToken = window.localStorage.getItem('accessToken')
		fetch('http://localhost:3000/', {
			headers: {
				authorization: `Bearer ${accessToken}`,
				'Content-Type' : 'application/json'
			}
		})
		.then(response => response.json())
		.then(response => setUser(response))
		.catch(err => {
			const refreshToken = window.localStorage.getItem('refreshToken')
			fetch('http://localhost:4000/api/token', {
				method: 'post',
				headers: { 'Content-Type' : 'application/json' },
				body: JSON.stringify({
					token: refreshToken
				})
			})
			.then(response => response.json())
			.then(response => {
				window.localStorage.setItem('accessToken', response)
			})
			.catch(err => console.log)
		})
		document.body.scrollTop = 0
		document.documentElement.scrollTop = 0	
		setCurrentLocation(location.pathname)
		setNav(false)
  	}


	return(
		<div id='AppContainer'>
			<Header 
			navIsOpen={navIsOpen} 
			Link={Link} 
			setNav={setNav} 
			user={user} 
			setUser={setUser} 
			windowWidth={windowWidth}
			setOverlay={setOverlay}/>
			{
				overlayIsOpen !== undefined ?
				<Overlay overlayIsOpen={overlayIsOpen} setOverlay={setOverlay} setUser={setUser} user={user}/>
				:
				null
			}
			{
				navIsOpen && windowWidth <= 920 ?
				<div class='menuOverLay'>
					<MobileNav 
					user={user}
					setNav={setNav}
					navIsOpen={navIsOpen}
					Link={Link}
					setOverlay={setOverlay} />
				</div> :
				null
			}
	        <Switch>
		        <Route exact path="/">
		       		<FrontPage 
		       		user={user} 
		       		setUser={setUser} 
		       		Link={Link} 
		       		windowWidth={windowWidth} />
		        </Route>
		       	<Route exact path="/user">
		        	<ProfilePage 
		        	user={user} 
		        	windowWidth={windowWidth} 
		        	Link={Link}/>
		        </Route>
		        <Route exact path="/community">
		        	<CommunityPage 
		        	user={user} 
		        	setUser={setUser}
		        	windowWidth={windowWidth} 
		        	Link={Link}/>
		        </Route>
		        <Route path="/global"> 
		        	<GlobalPage 
		        	user={user} 
		        	setUser={setUser}
		        	windowWidth={windowWidth} 
		        	Link={Link}/>
		        </Route>
		        <Route exact path='/community/post'>
		        	<PostPage 
		        	Link={Link}
		        	user={user} 
		        	setUser={setUser}
		        	windowWidth={windowWidth} />
		        </Route>
		        <Route exact path='/about'>
		        	<AboutPage  />
		        </Route>
	        </Switch>

{/*			
			<PopularPage userLoggedIn={userLoggedIn} navIsOpen={navIsOpen}/> 
			*/}
		</div>
	)
}

export default AppContainer