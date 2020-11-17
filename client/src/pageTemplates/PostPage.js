import React, { useState, useEffect } from 'react'
import WidgetContainer from '../components/widgetContainer/WidgetContainer'
import Footer from '../components/footer/Footer'
import PostExpanded from '../components/postExpanded/PostExpanded'
import Loading from '../components/loading/Loading'

const PostPage = ({Link, user,  windowWidth, overlayIsOpen, setOverlay, location, pageType}) => {

	const [pageContent, setPageContent] = useState(undefined)

	useEffect(() => {
			if(pageType !== 'userPostPage'){
				fetch(`http://localhost:3000/api${location.pathname.toLowerCase()}`)
				.then(response => response.json())
				.then(response => {
					setPageContent(response)
				})
				.catch(err => console.log(err))
			} else {
				fetch(`http://localhost:3000/api${location.pathname.toLowerCase()}`,{
					method: 'post',
					headers: {'Content-Type' : 'application/json'},
					body: JSON.stringify({
						communities: user.communities
					})
				})
				.then(response => response.json())
				.then(response => {
					setPageContent(response)
				})
				.catch(err => console.log(err))
			}
	},[])

		{
			if (pageContent) {
				return(
				<React.Fragment>
					<PostExpanded 
					Link={Link} 
					user={user} 
					windowWidth={windowWidth}
					pageContent={pageContent}
					overlayIsOpen={overlayIsOpen} 
					setOverlay={setOverlay}/>
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
}

export default PostPage