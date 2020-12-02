import React, { useEffect , useState } from 'react'
import Intro from '../components/intro/Intro'
import Feed from '../components/feed/Feed'
import WidgetContainer from '../components/widgetContainer/WidgetContainer'
import Footer from '../components/footer/Footer'
import Loading from '../components/loading/Loading'

const ProfilePage = ({user, setUser, windowWidth, Link, location, pageType, setMessage, history}) => {
	const [profileInfo, setProfileInfo] = useState(undefined)
	const [pageContent, setPageContent] = useState(undefined)

	useEffect(() => {
		fetch(`http://localhost:3000/api${location.pathname.toLowerCase()}`)
		.then(response => response.json())
		.then(response => {
				console.log(response)
				setPageContent(response)
		})
		.catch(err => {
			setMessage('There doesnt seem to be anything there...')
			history.push('/')
		})
	}, [])


	if(pageContent) {
	return(
		<React.Fragment>
			<Intro pageType='profilePage' windowWidth={windowWidth} pageContent={pageContent}/>
			<Feed 
				Link={Link} 
				pageType={pageType} 
				user={user} 
				setUser={setUser} 
				windowWidth={windowWidth} 
				pageContent={pageContent} 
				setMessage={setMessage}
				history={history}/>
			{
				windowWidth > 920 ?
				<WidgetContainer Link={Link} pageType={pageType} pageContent={pageContent}/> :
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