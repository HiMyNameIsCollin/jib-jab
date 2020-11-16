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


const AppContainer = ({Link, Route, Switch, useLocation}) => {

	const [windowWidth, setWindowWidth] = useState()
	const [navIsOpen, setNav] = useState(false)
	const [currentLocation, setCurrentLocation] = useState(undefined)
	const [overlayIsOpen, setOverlay] = useState(undefined)
	const [user, setUser] = useState(initialUser)
	const [pageContent, setPageContent] = useState(undefined)

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
  	}, [])

  	useEffect(() => {
  		console.log(location.pathname)
  		const accessToken = window.localStorage.getItem('accessToken')
  		if(currentLocation !== location.pathname){
  			tokenRefresh(accessToken)
			document.body.scrollTop = 0
			document.documentElement.scrollTop = 0	
			setCurrentLocation(location.pathname)
			setNav(false)
  		}
  		if (location.pathname === '/'){
			fetch(`http://localhost:3000/api/`, {
				headers: {
					authorization: `Bearer ${accessToken}`,
					'Content-Type' : 'application/json'
				}
			})
			.then(response => response.json())
			.then(response => {
					setPageContent(response)
			})
			.catch(err => {
				fetch('http://localhost:3000/api/default')
				.then(response => response.json())
				.then(response => setPageContent(response))
				.catch(err => console.log(err))
			})
		} else {
			fetch(`http://localhost:3000/api${location.pathname.toLowerCase()}`)
			.then(response => response.json())
			.then(response => {
					setPageContent(response)
			})
			.catch(err => {
				fetch('http://localhost:3000/api/default')
				.then(response => response.json())
				.then(response => setPageContent(response))
				.catch(err => console.log(err))
			})
		}
  	},[location.pathname])

  	useEffect(() => {
  		if(navIsOpen){
  			setOverlay(undefined)
  		}
  	},[navIsOpen])

  	function tokenRefresh(accessToken) {
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
		       		pageContent={pageContent}/>
		        </Route>
		       	<Route path="/u/:userName">
		        	<ProfilePage 
		        	user={user} 
		        	windowWidth={windowWidth} 
		        	Link={Link}
		        	pageContent={pageContent}
		        	setPageContent={setPageContent}/>
		        </Route>
		        <Route exact path="/c/:communityName">
		        	<CommunityPage 
		        	user={user} 
		        	setUser={setUser}
		        	windowWidth={windowWidth} 
		        	Link={Link}
		        	pageContent={pageContent}
		        	setPageContent={setPageContent}/>
		        </Route>
		        <Route path='/c/:communityName/:postID'>
		        	<PostPage 
		        	Link={Link}
		        	user={user} 
		        	setUser={setUser}
		        	windowWidth={windowWidth}
		        	pageContent={pageContent} 
		        	overlayIsOpen={overlayIsOpen} 
		        	setOverlay={setOverlay}/>
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