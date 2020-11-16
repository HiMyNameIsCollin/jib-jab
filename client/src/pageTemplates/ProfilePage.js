import React, { useEffect , useState} from 'react'
import Intro from '../components/intro/Intro'
import Feed from '../components/feed/Feed'
import WidgetContainer from '../components/widgetContainer/WidgetContainer'
import Footer from '../components/footer/Footer'
import Loading from '../components/loading/Loading'

const ProfilePage = ({user, windowWidth, Link, pageContent}) => {
	const [profileInfo, setProfileInfo] = useState(undefined)

	useEffect(() => {
		
	}, [])
	if(pageContent) {
	return(
		<React.Fragment>
			<Intro pageType='profilePage' windowWidth={windowWidth} pageContent={pageContent}/>
			<Feed Link={Link} pageType={'profilePage'} user={user} windowWidth={windowWidth} pageContent={pageContent} />
			{
				windowWidth > 920 ?
				<WidgetContainer Link={Link} pageType={'profilePage'} pageContent={pageContent}/> :
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