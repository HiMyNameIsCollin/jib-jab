import React from 'react'
import Intro from '../components/intro/Intro'
import Feed from '../components/feed/Feed'
import WidgetContainer from '../components/widgetContainer/WidgetContainer'

const ProfilePage = ({user, windowWidth, Link}) => {
	return(
		<React.Fragment>
			<Intro pageType='profilePage' windowWidth={windowWidth}/>
			<Feed Link={Link} pageType={'profilePage'} user={user} windowWidth={windowWidth}/>
			{
				windowWidth > 920 ?
				<WidgetContainer Link={Link} pageType={'profilePage'}/> :
				null
			}
		</React.Fragment>
	)
}

export default ProfilePage