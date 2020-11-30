import React, {useState, useEffect } from 'react'
import Header from './components/header/Header'
import MobileNav from './components/mobileNav/MobileNav'
import Overlay from './components/overlay/Overlay'
import FrontPage from './pageTemplates/FrontPage'
import CommunityPage from './pageTemplates/CommunityPage'
import ProfilePage from './pageTemplates/ProfilePage'
import PostPage from './pageTemplates/PostPage'
import AboutPage from './pageTemplates/AboutPage'
import Loading from './components/loading/Loading'


const initialUser = {
	userName: '',
	communities: ['Announcements'],
	karma: 1,
	followers: [],
	following: [],
	settings: {
		feedType: 'list'
	}
}



const AppContainer = ({Link, Route, Switch, useLocation, useHistory}) => {

	const [windowWidth, setWindowWidth] = useState()
	const [navIsOpen, setNav] = useState(false)
	const [currentLocation, setCurrentLocation] = useState(undefined)
	const [overlayIsOpen, setOverlay] = useState(undefined)
	const [user, setUser] = useState(undefined)
	const [error, setError] = useState(undefined)

	const location = useLocation()
	const history = useHistory()

  	useEffect(() => {
  		tokenRefresh()
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

  	useEffect(() => {
  		if(error !== undefined){
  			setTimeout(() => {
  				document.getElementsByClassName('error')[0].classList.add('errorSlideOut')
  			}, 3000)
  			setTimeout(() => {
  				setError(undefined)
  			}, 5000)
  		}
  	},[error])

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
			} else {
				setUser(initialUser)
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
				} else {
					setUser(initialUser)
				}
			})
			.catch(err => setUser(initialUser))
		})

  	}

  	if(user !== undefined){
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
				<Overlay 
				overlayIsOpen={overlayIsOpen} 
				setOverlay={setOverlay} 
				setUser={setUser} 
				user={user}/>
				:
				null
			} 
			{
				error !== undefined ?
				<div className='error errorSlideIn container'> 
					<p> {error }</p>
				</div> :
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
					setOverlay={setOverlay} 
					setError={setError}/>
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
		       		pageType={'frontPage'}
		       		setError={setError} />
		        </Route>
		       	<Route exact path="/u/:userName">
		        	<ProfilePage 
		        	user={user} 
		        	setUser={setUser} 
		        	windowWidth={windowWidth} 
		        	Link={Link}
		       		location={location}
		       		pageType={'profilePage'}
		       		setError={setError}/>
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
		       		setError={setError}/>
		        </Route>
		       	<Route exact path="/u/:userName/:postID/">
		        	<PostPage 
		        	Link={Link}
		        	user={user} 
		        	setUser={setUser}
		        	windowWidth={windowWidth}
		        	overlayIsOpen={overlayIsOpen} 
		        	setOverlay={setOverlay}
		       		location={location}
		       		pageType={'userPostPage'}
		       		setError={setError}/>
		        </Route>
		        <Route exact path='/c/:communityName/:postID'>
		        	<PostPage 
		        	Link={Link}
		        	user={user} 
		        	setUser={setUser}
		        	windowWidth={windowWidth}
		        	overlayIsOpen={overlayIsOpen} 
		        	setOverlay={setOverlay}
		       		location={location}
					pageType={'postPage'} 
					setError={setError}/>
		        </Route>
		        <Route exact path='/about'>
		        	<AboutPage />
		        </Route>
	        </Switch>
		</div>
	)		
  	} else {
  		return <Loading />
  	}

}

export default AppContainer