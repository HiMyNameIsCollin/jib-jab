import React from 'react'
import WidgetContainer from '../components/widgetContainer/WidgetContainer'
import Footer from '../components/footer/Footer'
import PostExpanded from '../components/postExpanded/PostExpanded'
import Loading from '../components/loading/Loading'

const PostPage = ({Link, user,  windowWidth, pageContent, overlayIsOpen, setOverlay}) => {

		{
			if (pageContent) {
				return(
				<React.Fragment>
					<PostExpanded 
					pageType={'communityPage'} 
					Link={Link} 
					user={user} 
					windowWidth={windowWidth}
					pageContent={pageContent}
					overlayIsOpen={overlayIsOpen} 
					setOverlay={setOverlay}/>
					{
						windowWidth > 920 ?
						<WidgetContainer Link={Link} pageType={'postPage'} pageContent={pageContent}/> :
						null				
					}

					<Footer />
				</React.Fragment> 
				)
				} else {
					return <Loading />
				}
		}
}

export default PostPage