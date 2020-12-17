import React, { useState, useEffect } from 'react'
import WidgetContainer from '../components/widgetContainer/WidgetContainer'
import Footer from '../components/footer/Footer'
import PostExpanded from '../components/postExpanded/PostExpanded'
import Loading from '../components/loading/Loading'

const PostPage = ({Link, user, setUser,  windowWidth, overlayIsOpen, setOverlay, location, pageType, setMessage, history, setReportOverlayIsOpen, setLoading}) => {

	const [pageContent, setPageContent] = useState(undefined)

	useEffect(() => {
				fetch(`https://jibjab.herokuapp.com/api${location.pathname.toLowerCase()}`)
				.then(response => response.json())
				.then(response => {

					setPageContent(response)
				})
				.catch(err => {
					setMessage('There doesnt seem to be anything there...')
					history.push('/')
				})
	},[location])

		{
			if (pageContent) {
				return(
				<React.Fragment>
					<PostExpanded 
					location={location}
					Link={Link} 
					user={user} 
					setUser={setUser}
					windowWidth={windowWidth}
					pageContent={pageContent}
					overlayIsOpen={overlayIsOpen} 
					setOverlay={setOverlay}
					pageType={pageType}
					setMessage={setMessage}
					history={history}
					setReportOverlayIsOpen={setReportOverlayIsOpen}
					setLoading={setLoading} />
					{
						windowWidth > 920 ?
						<WidgetContainer Link={Link} pageType={pageType} pageContent={pageContent} user={user} setUser={setUser}/> :
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