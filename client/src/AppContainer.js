import React, {useState, useEffect } from 'react'
import Header from './components/header/Header'
import MobileNav from './components/mobileNav/MobileNav'
import Overlay from './components/overlay/Overlay'
import FrontPage from './pageTemplates/FrontPage'
import CommunityPage from './pageTemplates/CommunityPage'
import ProfilePage from './pageTemplates/ProfilePage'
import PostPage from './pageTemplates/PostPage'
import AboutPage from './pageTemplates/AboutPage'
import InboxPage from './pageTemplates/inboxPage/InboxPage'
import CreateCommunity from './pageTemplates/createCommunity/CreateCommunity'
import ReportOverlay from './components/reportOverlay/ReportOverlay'
import Loading from './components/loading/Loading'


const initialUser = {
	userName: '',
	communities: ['Announcements', 'General'],
	karma: 1,
	followers: [],
	following: [],
	settings: {
		feedType: 'list'
	},
	configuration: {
		image: 'https://robohash.org/100',
		headerImg: ''
	},
	unseenMessages: []
}



const AppContainer = ({Link, Route, Switch, useLocation, useHistory}) => {

	const [windowWidth, setWindowWidth] = useState()
	const [navIsOpen, setNav] = useState(false)
	const [currentLocation, setCurrentLocation] = useState(undefined)
	const [overlayIsOpen, setOverlay] = useState(undefined)
	const [user, setUser] = useState(undefined)
	const [message, setMessage] = useState(undefined)
	const [reportOverlayIsOpen, setReportOverlayIsOpen] = useState(undefined)
	const [loading, setLoading] = useState(false)
	const [url, setUrl] = useState(undefined)
	const location = useLocation()
	const history = useHistory()

	useEffect(() => {
		if(process.env.NODE_ENV === 'development'){
			setUrl('http://localhost:3000')
			tokenRefresh('http://localhost:3000')
		} else{
			setUrl('https://jibjab.herokuapp.com')
			tokenRefresh('https://jibjab.herokuapp.com')
		}
	},[])


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
			if(process.env.NODE_ENV === 'development'){
				tokenRefresh('http://localhost:3000')
			} else{
				tokenRefresh('https://jibjab.herokuapp.com')
			}
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
  		if(message !== undefined){
  			setTimeout(() => {
  				const messagePopUp = document.getElementsByClassName('message')
  				if(messagePopUp[0]){
  					messagePopUp[0].classList.add('messageSlideOut')
  				}
  			}, 3000)
  			setTimeout(() => {
  				setMessage(undefined)
  			}, 5000)
  		}
  	},[message])

  	function tokenRefresh(url) {
  		const accessToken = window.localStorage.getItem('accessToken')
		fetch(`${url}/api/refresh`, {
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
			fetch(`${url}/api/token`, {
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

  	if(user !== undefined && url !== undefined){
  	return(
		<div id='AppContainer'>
			<Header 
			location={location}
			navIsOpen={navIsOpen} 
			Link={Link} 
			setNav={setNav} 
			user={user} 
			setUser={setUser} 
			windowWidth={windowWidth}
			setOverlay={setOverlay}
			history={history}
			url={url}/>
			{
				loading ?
				<Loading /> :
				null
			}
			{
				overlayIsOpen !== undefined ?
				<Overlay 
				overlayIsOpen={overlayIsOpen} 
				setOverlay={setOverlay} 
				setUser={setUser} 
				user={user}
				setMessage={setMessage}
				history={history}
				location={location}
				url={url}/>
				:
				null
			} 
			{
				reportOverlayIsOpen !== undefined ?
				<ReportOverlay 
				setUser={setUser} 
				user={user}
				setMessage={setMessage}
				history={history}
				location={location}
				setReportOverlayIsOpen={setReportOverlayIsOpen}
				reportOverlayIsOpen={reportOverlayIsOpen}
				Link={Link}
				url={url}/> :
				null
			}
			{
				message !== undefined ?
				<div className='message messageSlideIn container'> 
					<p> {message }</p>
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
					setMessage={setMessage}
					history={history}
					url={url}/>
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
		       		setMessage={setMessage}
		       		setOverlay={setOverlay}
		       		setReportOverlayIsOpen={setReportOverlayIsOpen}
		       		setLoading={setLoading}
		       		history={history} 
		       		url={url}/>
		        </Route>
		       	<Route exact path="/u/:userName">
		        	<ProfilePage 
		        	user={user} 
		        	setUser={setUser} 
		        	windowWidth={windowWidth} 
		        	Link={Link}
		       		location={location}
		       		pageType={'profilePage'}
		       		setMessage={setMessage}
		       		history={history}
		       		setOverlay={setOverlay}
		       		setReportOverlayIsOpen={setReportOverlayIsOpen}
		       		setLoading={setLoading} 
		       		url={url}/>
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
		       		setMessage={setMessage}
		       		setOverlay={setOverlay}
		       		setReportOverlayIsOpen={setReportOverlayIsOpen}
		       		setLoading={setLoading} 
		       		url={url}/>
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
		       		setMessage={setMessage}
		       		history={history}
		       		setReportOverlayIsOpen={setReportOverlayIsOpen}
		       		setLoading={setLoading} 
		       		url={url}/>
		        </Route>
		        <Route exact path='/c/:communityName/:postID'>
		        	<PostPage 
		        	Link={Link}
		        	location={location}
		        	user={user} 
		        	setUser={setUser}
		        	windowWidth={windowWidth}
		        	overlayIsOpen={overlayIsOpen} 
		        	setOverlay={setOverlay}
					pageType={'postPage'} 
					setMessage={setMessage}
					history={history}
					setReportOverlayIsOpen={setReportOverlayIsOpen}
					setLoading={setLoading} 
					url={url}/>
		        </Route>
		        <Route exact path='/c/:communityName/:postID/:commentID'>
		        	<PostPage 
		        	Link={Link}
		        	location={location}
		        	user={user} 
		        	setUser={setUser}
		        	windowWidth={windowWidth}
		        	overlayIsOpen={overlayIsOpen} 
		        	setOverlay={setOverlay}
					pageType={'postPage'} 
					setMessage={setMessage}
					history={history}
					setReportOverlayIsOpen={setReportOverlayIsOpen}
					setLoading={setLoading} 
					url={url}/>
		        </Route>
		        <Route path='/inbox'>
		        	<InboxPage 
		        	Link={Link}
		        	user={user} 
		        	setUser={setUser}
		        	windowWidth={windowWidth}
		        	overlayIsOpen={overlayIsOpen}
		        	setMessage={setMessage} 
		        	setOverlay={setOverlay}
					pageType={'postPage'} 
					history={history}
					setReportOverlayIsOpen={setReportOverlayIsOpen}
					url={url}/>
		        </Route>
		        <Route path='/createCommunity'>
		        	<CreateCommunity user={user} setMessage={setMessage} history={history} url={url}/>
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