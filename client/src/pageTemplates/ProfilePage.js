import React, { useEffect , useState } from 'react'
import Intro from '../components/intro/Intro'
import Feed from '../components/feed/Feed'
import WidgetContainer from '../components/widgetContainer/WidgetContainer'
import Footer from '../components/footer/Footer'
import Loading from '../components/loading/Loading'

const ProfilePage = ({user, windowWidth, Link, location, pageType}) => {
	const [profileInfo, setProfileInfo] = useState(undefined)
	const [pageContent, setPageContent] = useState(undefined)

	useEffect(() => {
		fetch(`http://localhost:3000/api${location.pathname.toLowerCase()}`)
		.then(response => response.json())
		.then(response => {
				setPageContent(response)
		})
		.catch(err => console.log(err))
	}, [])


	if(pageContent) {
	return(
		<React.Fragment>
			<Intro pageType='profilePage' windowWidth={windowWidth} pageContent={pageContent}/>
			<Feed Link={Link} pageType={pageType} user={user} windowWidth={windowWidth} pageContent={pageContent} />
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