import React, { useEffect , useState} from 'react'
import Intro from '../components/intro/Intro'
import Feed from '../components/feed/Feed'
import WidgetContainer from '../components/widgetContainer/WidgetContainer'
import Footer from '../components/footer/Footer'
import Loading from '../components/loading/Loading'

const ProfilePage = ({user, windowWidth, Link, posts}) => {
	const [profileInfo, setProfileInfo] = useState(undefined)

	useEffect(() => {
		
	}, [])

	return(
		<React.Fragment>
			<Intro pageType='profilePage' windowWidth={windowWidth}/>
			<Feed Link={Link} pageType={'profilePage'} user={user} windowWidth={windowWidth} posts={posts}/>
			{
				windowWidth > 920 ?
				<WidgetContainer Link={Link} pageType={'profilePage'}/> :
				null
			}

			<Footer />
		</React.Fragment>
	)
}

export default ProfilePage