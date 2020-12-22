import React, { useEffect , useState } from 'react'
import Intro from '../components/intro/Intro'
import Feed from '../components/feed/Feed'
import WidgetContainer from '../components/widgetContainer/WidgetContainer'
import Footer from '../components/footer/Footer'
import Loading from '../components/loading/Loading'

const ProfilePage = ({user, setUser, windowWidth, Link, location, pageType, setMessage, setOverlay, history, setReportOverlayIsOpen, setLoading, url}) => {
	const [pageContent, setPageContent] = useState(undefined)

	useEffect(() => {
		fetch(`${url}/api${location.pathname.toLowerCase()}`)
		.then(response => response.json())
		.then(response => {
				setPageContent(response)
		})
		.catch(err => {
			setMessage('There doesnt seem to be anything there...')
			history.push('/')
		})
	}, [location.pathname])


	if(pageContent) {
	return(
		<React.Fragment>
			<Intro 
			pageType='profilePage' 
			windowWidth={windowWidth} 
			pageContent={pageContent} 
			location={location} 
			user={user}
			setUser={setUser}
			setOverlay={setOverlay}
			setMessage={setMessage}
			url={url}/>
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
			{
				windowWidth > 920 ?
				<WidgetContainer 
					user={user} 
					setUser={setUser}
					setMessage={setMessage} 
					Link={Link} 
					pageType={pageType} 
					pageContent={pageContent}
					setOverlay={setOverlay}
					url={url}
					/> :
				null
			}

			<Footer />
		</React.Fragment>
	)		
} else {
	return <Loading />
}

}

export default ProfilePage