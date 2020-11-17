import React, {useState, useEffect } from 'react'
import Header from './components/header/Header'
import MobileNav from './components/mobileNav/MobileNav'
import Overlay from './components/overlay/Overlay'
import FrontPage from './pageTemplates/FrontPage'
import CommunityPage from './pageTemplates/CommunityPage'
import ProfilePage from './pageTemplates/ProfilePage'
import PostPage from './pageTemplates/PostPage'
import AboutPage from './pageTemplates/AboutPage'


const initialUser = {
	userName: '',
	communities: ['Announcements'],
	karma: 1,
	followers: [],
	settings: {
		feedType: 'list'
	}
}


const AppContainer = ({Link, Route, Switch, useLocation, useHistory}) => {

	const [windowWidth, setWindowWidth] = useState()
	const [navIsOpen, setNav] = useState(false)
	const [currentLocation, setCurrentLocation] = useState(undefined)
	const [overlayIsOpen, setOverlay] = useState(undefined)
	const [user, setUser] = useState(initialUser)

	const location = useLocation()
	const history = useHistory()

  	useEffect(() => {
  		setCurrentLocation(location.pathname)
	    function handleResize() {
	      setWindowWidth(window.innerWidth)
	    }
	    window.addEventListener("resize", handleResize);
	    handleResize();
	    return () => window.removeEventListener("resize", handleResize);
  	}, [])

  	useEffect(() => {
  		if(currentLocation !== location.pathname){
  			tokenRefresh()
			document.body.scrollTop = 0
			document.documentElement.scrollTop = 0	
			setCurrentLocation(location.pathname)
			setNav(false)
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
		.then(response => {
			if(response !== null){
				setUser(response)
			}
		})
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
				window.localStorage.setItem('accessToken', response.accessToken)
				if(response.result !== null) {
					setUser(response.result)
				}
			})
			.catch(err => console.log)
		})

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
					setUser={setUser}
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
		       		windowWidth={windowWidth}
		       		location={location}
		       		pageType={'frontPage'} />
		        </Route>
		       	<Route exact path="/u/:userName">
		        	<ProfilePage 
		        	user={user} 
		        	windowWidth={windowWidth} 
		        	Link={Link}
		       		location={location}
		       		pageType={'profilePage'}/>
		        </Route>
		       	<Route path="/u/:userName/:postID">
		        	<PostPage 
		        	Link={Link}
		        	user={user} 
		        	setUser={setUser}
		        	windowWidth={windowWidth}
		        	overlayIsOpen={overlayIsOpen} 
		        	setOverlay={setOverlay}
		       		location={location}
		       		pageType={'userPostPage'}/>
		        </Route>
		        <Route exact path="/c/:communityName">
		        	<CommunityPage 
		        	user={user} 
		        	setUser={setUser}
		        	windowWidth={windowWidth} 
		        	Link={Link}
		       		location={location}
		       		history={history}
					pageType={'communityPage'} 
		       		/>
		        </Route>
		        <Route path='/c/:communityName/:postID'>
		        	<PostPage 
		        	Link={Link}
		        	user={user} 
		        	setUser={setUser}
		        	windowWidth={windowWidth}
		        	overlayIsOpen={overlayIsOpen} 
		        	setOverlay={setOverlay}
		       		location={location}
					pageType={'postPage'} />
		        </Route>
		        <Route exact path='/about'>
		        	<AboutPage />
		        </Route>
	        </Switch>

{/*			
			<PopularPage userLoggedIn={userLoggedIn} navIsOpen={navIsOpen}/> 
			*/}
		</div>
	)
}

export default AppContainer