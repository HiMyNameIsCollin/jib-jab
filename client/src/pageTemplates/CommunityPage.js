import React, { useState, useEffect } from 'react'
import Intro from '../components/intro/Intro'
import Feed from '../components/feed/Feed'
import WidgetContainer from '../components/widgetContainer/WidgetContainer'
import Footer from '../components/footer/Footer'
import Loading from '../components/loading/Loading'


const CommunityPage = ({user, setUser, windowWidth, Link, location, history, pageType, setMessage, setOverlay, setReportOverlayIsOpen, setLoading, url}) => {

	const [pageContent, setPageContent] = useState(undefined)
	const [mobileViewIsFeed, setMobileView] = useState(true)
	const [currentPage, setCurrentPage] = useState(undefined)

	useEffect(() => {
		if(location.pathname.toLowerCase() === '/c/popular'){
			history.push('/')
		} else {
			fetch(`${url}/api${location.pathname.toLowerCase()}`)
			.then(response => response.json())
			.then(response => {
					setPageContent(response)
			})
			.catch(err => {
				setMessage('There doesnt seem to be anything here...')
				history.push('/')
			})	
		}
	},[location.pathname])

  	useEffect(() => {
  		if(currentPage !== location.pathname){
  			setPageContent(undefined)
  			setCurrentPage(location.pathname)
  		}
  	},[location.pathname])

	if(pageContent){
		return(
			<React.Fragment>
					<Intro pageType={pageType} windowWidth={windowWidth} pageContent={pageContent} user={user} setOverlay={setOverlay} url={url}/> 
				{
					windowWidth <= 920 ?
					<div className='container mobileViewToggle'>
						<span onClick={() => setMobileView(true)} className={mobileViewIsFeed ? 'mobileViewChoice' : null}> Feed </span>
						<span onClick={() => setMobileView(false)} className={!mobileViewIsFeed ? 'mobileViewChoice' : null}> About </span>
					</div> :
					null
				}
				{
					windowWidth > 920 ?
					<React.Fragment >
						<Feed 
						Link={Link} 
						pageType={pageType} 
						user={user} 
						setUser={setUser}
						windowWidth={windowWidth}
						pageContent={pageContent} 
						setMessage={setMessage}
						history={history} 
						setOverlay={setOverlay}
						setReportOverlayIsOpen={setReportOverlayIsOpen} 
						setLoading={setLoading} 
						url={url}/>
						<WidgetContainer Link={Link} pageType={pageType} pageContent={pageContent} url={url}/> 
					</React.Fragment> :
					mobileViewIsFeed ?
					<Feed 
					Link={Link} 
					pageType={'communityPage'} 
					user={user} 
					setUser={setUser} 
					windowWidth={windowWidth}
					pageContent={pageContent}
					setMessage={setMessage}
					setLoading={setLoading} 
					history={history}
					url={url}/>:
					<WidgetContainer Link={Link} pageType={pageType} pageContent={pageContent} url={url}/> 
				}

				<Footer />
			</React.Fragment>
		)
	} else {
		return <Loading />
	}
	
}

export default CommunityPage