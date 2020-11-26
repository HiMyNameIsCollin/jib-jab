import React, { useState, useEffect } from 'react'
import Post from '../post/Post'
import SortOptionsContainer from './sortOptionsContainer/SortOptionsContainer'
import Loading from '../loading/Loading'
import './_feed.sass'

const initialSort = {
	sortOptionsChoice: 'spicy',
	sortOptionsContChoice: 'day'
}

const Feed = ({user, setUser,  windowWidth, pageType, Link, pageContent, setError}) => {

	const [feedSort, setFeedSort] = useState(initialSort)
	const [posts, setPosts] = useState(undefined)
	const [profileFeedChoice, setProfileFeedChoice] = useState('soapBox')

	useEffect(() => {
		if(pageContent.posts.length !== 0){
			handlePostFetch()
		}
	},[profileFeedChoice, feedSort])

	useEffect(() => {
			handlePostFetch()
		
	},[])

	const handlePostFetch = () => {
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
	}



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

	const handleVote = (postID, request) => {
		if(user.userName !== '') {
	  		const accessToken = window.localStorage.getItem('accessToken')
			fetch('http://localhost:3000/api/vote', {
				method: 'post',
				headers: {
					authorization: `Bearer ${accessToken}`,
					'Content-Type' : 'application/json'
				},
				body: JSON.stringify({
					postID,
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
				setError('Must be logged in to vote')
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
				setError={setError}/>
			}
			{
				pageContent.posts.length !== 0 ?
				posts !== null && posts !== undefined ?
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
						setError={setError}/> 
						
				}): <Loading /> :
				<p style={{textAlign: 'center', padding: '1em'}}> There are no posts by anybody you are following, or communities you are subscribed too :( </p>
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