import React, { useState, useEffect } from 'react'
import Post from '../post/Post'
import SortOptionsContainer from './sortOptionsContainer/SortOptionsContainer'
import Loading from '../loading/Loading'
import './_feed.sass'

const initialSort = {
	sortOptionsChoice: 'spicy',
	sortOptionsContChoice: 'day'
}

const Feed = ({user, setUser,  windowWidth, pageType, Link, pageContent, setError, setMessage, setOverlay, setReportOverlayIsOpen, setLoading, history, url}) => {

	const [feedSort, setFeedSort] = useState(initialSort)
	const [posts, setPosts] = useState(undefined)
	const [profileFeedChoice, setProfileFeedChoice] = useState('soapBox')

	useEffect(() => {
		if(pageContent.posts.length !== 0 || (pageContent.soapBox && pageContent.soapBox.length !== 0)){
			handlePostFetch()
		}
	},[profileFeedChoice, feedSort])

	useEffect(() => {
			handlePostFetch()
		
	},[])
	
	const handlePostFetch = () => {
		if(pageType === 'profilePage') {
			if(profileFeedChoice === 'soapBox'){
				if(pageContent.soapBox.length > 0){
				fetch(`${url}/api/p/`,{
						method: 'post',
						headers: {'Content-Type' : 'application/json'},
						body: JSON.stringify({
							posts: pageContent.soapBox,
							sortType: profileFeedChoice
						})
					})
					.then(response => response.json())
					.then(response => setPosts(response))
					.catch(err => console.log(err))							
				} else {
					setPosts([])
				}
			}else {
				if(pageContent.posts.length > 0){
					fetch(`${url}/api/p/`,{
					method: 'post',
					headers: {'Content-Type' : 'application/json'},
					body: JSON.stringify({
						posts: pageContent.posts,
						sortType: profileFeedChoice
						})
					})
					.then(response => response.json())
					.then(response => setPosts(response))
					.catch(err => console.log(err))				
				} else {
					setPosts([])
				}
			}
		} else {
			if(pageContent.posts.length > 0){
				fetch(`${url}/api/p/`, {
					method: 'post',
					headers: {'Content-Type' : 'application/json'}, 
					body: JSON.stringify({
						posts: pageContent.posts,
						sortType: feedSort.sortOptionsChoice,
						sortTypeCont: feedSort.sortOptionsContChoice
					})
				})
				.then(response => response.json())
				.then(response => setPosts(response))
				.catch(err => {
					setPosts([])
					setMessage('There seems to have been an error')
				})
			} else {
				setPosts([])
			}
		}
	}



	const ProfileFeedSort = () => {
		return(
			<div className='container profileFeedSort'>
				<div onClick={(e) => {
			    	e.stopPropagation()
			    	setProfileFeedChoice('soapBox')
				}} className={profileFeedChoice === 'soapBox' ? 'profileFeedChoice' : null}>
					<i className="fas fa-fire"></i>
					<span>Soap Box</span>
				</div>
				<div onClick={(e) => {
			    	e.stopPropagation()
			    	setProfileFeedChoice('communities')
				}} className={profileFeedChoice === 'communities' ? 'profileFeedChoice' : null}>
					<i className="fas fa-baby"></i>
					<span>Communities</span>
				</div>
			</div>
		)
	}

	const handleVote = (postID, postUserName,  request) => {
		if(user.userName !== '') {
	  		const accessToken = window.localStorage.getItem('accessToken')
			fetch(`${url}/api/vote`, {
				method: 'post',
				headers: {
					authorization: `Bearer ${accessToken}`,
					'Content-Type' : 'application/json'
				},
				body: JSON.stringify({
					postID,
					postUserName, 
					request,
				})
			})
			.then(response => response.json())
			.then(response => {
				let updatedPosts = [...posts]
				updatedPosts.forEach((p, i) => {
					if(p.id === response.id){
						updatedPosts[i] = response
					}
				})
				setPosts(updatedPosts)
			})
			.catch(err => console.log(err))
			} else {
				setMessage('Must be logged in to vote')
			}
	}


	return(
		<div className={pageContent ? pageContent.communityNameLower === 'global' ? 'feedGlobalPage feed' : 'feed' : 'feed'}>
			{
				pageType === 'frontPage' ?
				<p className='feedHeader'> Popular posts </p> :
				null
			}
			{
				pageType === 'profilePage' ?
				<ProfileFeedSort />:
				<SortOptionsContainer 
				setUser={setUser} 
				user={user} 
				feedSort={feedSort} 
				setFeedSort={setFeedSort} 
				setError={setError}
				url={url}/>
			}
			{
				posts !== null && posts !== undefined ?
				posts.length !== 0 ?
				posts.map((p, i) => {
					return <Post 
							pageType={pageType} 
							Link={Link} 
							user={user} 
							setUser={setUser}
							windowWidth={windowWidth}
							post={p}
							key={i}
							handleVote={handleVote}
							setError={setError}
							pageContent={pageContent}
							setOverlay={setOverlay}
							setMessage={setMessage}
							setReportOverlayIsOpen={setReportOverlayIsOpen}
							setLoading={setLoading}
							history={history}
							url={url}/> 
						
				}): 
				<p style={{textAlign: 'center', padding: '1em'}}> 
				{
				pageType === 'frontPage' || pageContent.communityName === 'Global' ?
					'There are no posts by anybody you are following, or communities you are subscribed too :( ' :
					'There doesnt seem to be anything here :('
				}
				</p>:
				<Loading /> 
			}

			
			

{/*			<div className='pageSelectorContainer container'>
			{
				windowWidth <= 920 ?
				<React.Fragment>
					<p>Prev</p>
					<p>More</p>
				</React.Fragment> :
				<p className='feedSeeMore'> See more </p>
			}

			</div>*/}
		</div>
	)
}

export default Feed