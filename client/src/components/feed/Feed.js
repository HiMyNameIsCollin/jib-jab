import React, { useState, useEffect } from 'react'
import Post from '../post/Post'
import SortOptionsContainer from './sortOptionsContainer/SortOptionsContainer'
import Loading from '../loading/Loading'
import './_feed.sass'

const initialSort = {
	sortOptionsChoice: 'spicy',
	sortOptionsContChoice: 'day'
}

const Feed = ({user, setUser,  windowWidth, pageType, Link, pageContent}) => {

	const [feedSort, setFeedSort] = useState(initialSort)
	const [posts, setPosts] = useState(undefined)
	const [profileFeedChoice, setProfileFeedChoice] = useState('soapBox')

	useEffect(() => {
		setPosts(undefined)
		if(pageType === 'profilePage') {
			if(profileFeedChoice === 'soapBox'){
				fetch(`http://localhost:3000/api/p/`,{
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
			}else {
				fetch(`http://localhost:3000/api/p/`,{
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
			}
		} else {
			fetch(`http://localhost:3000/api/p/`, {
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
			.catch(err => console.log)
		}
	},[profileFeedChoice])




	const ProfileFeedSort = () => {
		return(
			<div className='container profileFeedSort'>
				<div onClick={(e) => {
			    	e.stopPropagation()
			    	setProfileFeedChoice('soapBox')
				}} className={profileFeedChoice === 'soapBox' ? 'profileFeedChoice' : null}>
					<i class="fas fa-fire"></i>
					<span>Soap Box</span>
				</div>
				<div onClick={(e) => {
			    	e.stopPropagation()
			    	setProfileFeedChoice('communities')
				}} className={profileFeedChoice === 'communities' ? 'profileFeedChoice' : null}>
					<i class="fas fa-baby"></i>
					<span>Communities</span>
				</div>
			</div>
		)
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
				<SortOptionsContainer setUser={setUser} user={user} feedSort={feedSort} setFeedSort={setFeedSort} />
			}
			{
				posts !== undefined ?
				posts.map((p, i) => {
					return <Post 
						pageType={pageType} 
						Link={Link} 
						user={user} 
						windowWidth={windowWidth}
						post={p}
						key={i}/> 
						
				}): <Loading />
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