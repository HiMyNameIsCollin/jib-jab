import React from 'react'
import WidgetContainer from '../components/widgetContainer/WidgetContainer'
import Footer from '../components/footer/Footer'
import PostExpanded from '../components/postExpanded/PostExpanded'

const PostPage = ({Link, user, windowWidth}) => {
	return(
		<React.Fragment>
			<PostExpanded pageType={'communityPage'} Link={Link} user={user} windowWidth={windowWidth}/>
			{
				windowWidth > 920 ?
				<WidgetContainer Link={Link} pageType={'postPage'}/> :
				null				
			}

			<Footer />
		</React.Fragment>
	)
}

export default PostPage