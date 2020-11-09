import React from 'react'
import WidgetContainer from '../components/widgetContainer/WidgetContainer'
import Footer from '../components/footer/Footer'
import PostExpanded from '../components/postExpanded/PostExpanded'
import Loading from '../components/loading/Loading'

const PostPage = ({Link, user,  windowWidth, posts,community}) => {
		{
			if (posts && community ) {
				return(
				<React.Fragment>
					<PostExpanded 
					pageType={'communityPage'} 
					Link={Link} 
					user={user} 
					windowWidth={windowWidth}
					posts={posts}/>
					{
						windowWidth > 920 ?
						<WidgetContainer Link={Link} pageType={'postPage'} community={community}/> :
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