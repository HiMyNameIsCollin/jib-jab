import React, {useState, useEffect } from 'react'
import './_intro.sass'


const Intro = ({pageType, windowWidth, pageContent, user, setUser, Link, location, setOverlay, setMessage}) => {

	const TrendingIntro = () => {
		const [trendingPosts, setTrendingPosts] = useState(undefined)

		useEffect(() => {
			fetch('https://jibjab.herokuapp.com/api/p', {
				method: 'post',
				headers: {'Content-Type' : 'application/json'}, 
				body: JSON.stringify({
					posts: pageContent.posts,
					sortType: 'top',
					sortTypeCont: 'day',
				})
			})
			.then(result => result.json())
			.then(result => {
				setTrendingPosts(result)
			})
			.catch(err => console.log(err))
		},[])

		const TrendingBtn = ({post}) => {
			return(
				<Link className='trendingBtn' to={post.postType === 'community' ? `/c/${post.communityName}/${post.id}` : `/u/${post.userName}/${post.id}`} >
					<span className='trendingText'>
						<h2>{post.title}</h2>
						<p> {post.text && post.text !== '' ? post.text.length > 50 ? post.text.slice(0, 50) + '...' : post.text : null } </p>
					</span>
					{
						post.imageLink !== '' ?
						<img src={post.imageLink} alt="Post content" /> :
						post.imageRefs.length > 0 ?
						<img src={`https://jibjab.herokuapp.com/api/p/img/${post.imageRefs[0]}`} alt='Post content'/> :
						<img src='https://source.unsplash.com/random/200x200' alt='Post content' />
					}
				</Link>
			
			)
		}
		if(trendingPosts !== undefined) {
			return(
				<div className='container trendingIntro'>
					<span> Currently trending </span>
					<div className='container'>
						{
							trendingPosts.map((p , i) => {
								if(i < 4){
									return <TrendingBtn post={p} key={i} />
								}
							})
						}
					</div>
				</div>
			)				
		} else {
			return null
		}
	
	}

	const CommunityHeader = () => {
		return(
			<div className='communityHeader' style={{backgroundImage: `url(${pageContent.configuration.headerImg})` }}> 
				<div className='container'>
					<img src={pageContent.configuration.image }alt=""/>
					{
						pageContent.moderators.includes(user.userName)?
						<span onClick={() => setOverlay('manageCommunity')}className='imgUpdateBtn'> Manage community  </span>:
						null
					}
				</div>
				<div className=' container'>
					<p> {pageContent.communityName}</p>
					<p> {pageContent.configuration.communityHeader} </p>
				</div>
			</div>
		)
	}

	const ProfileHeader = ({windowWidth}) => {

		const handleFollow = (target, request) => {
			if(user.userName !== '' && user.userName !== pageContent.userName){
	  			const accessToken = window.localStorage.getItem('accessToken')
				fetch('https://jibjab.herokuapp.com/api/u/subscribe', {
					method: 'post',
					headers: {
						authorization: `Bearer ${accessToken}`,
						'Content-Type' : 'application/json'
					},
					body: JSON.stringify({
						userName: target,
						request,
					})
				})
				.then(response => response.json())
				.then(response => {
					setUser(response)
				})
				.catch(err => {
					setMessage('There has been an error trying to follow that user')
				})			
			} else {
				if(user.userName === ''){
					setMessage('You must be logged in to follow a user') 
				} else {
				setMessage('Dont believe your own hype')	
				}
			}

		}

		return(
			<div className='container profileHeader' style={{backgroundImage: `url(${pageContent.configuration.headerImg})`}} >
				<div className='profileAvatar container' >
					<img src={pageContent.configuration.image} alt=""/>
				</div>
				<div className=' container'>
					<p> {pageContent.userName}</p>
				</div>
				{
					windowWidth > 920 ?
					null :
					<React.Fragment>
					<div className='profileInteract'>
					{
						user.following.includes(pageContent.userName)?
						<div
							className='profileFollow' 
							onClick={() => handleFollow(pageContent.userNameLower, 'unsubscribe')}>
							Unfollow
						</div> :
						<div className='profileFollow'  
							onClick={() => handleFollow(pageContent.userNameLower, 'subscribe')}>
							Follow
						</div> 
					}
						<div className='profileMessage' 
							onClick={() => {
							if(user.userName !== ''){
								setOverlay('submitMessage')
							} else {
								setMessage('You must be logged in to send a message')
							}
						}}>
							Message
						</div>
					</div>
					<div className='profileScore container'>
						<div >
							<p> {pageContent.karma} </p>
							<p> Karma </p>
						</div>
						<div >
							<p> {pageContent.followers.length} </p>
							<p> Followers </p>
						</div>
						<div>
							<p> User since: </p>
							<p> {pageContent.createdOn}</p>
						</div>
					</div>
					</React.Fragment>
				}
			</div>
		)
	}



	return(
		<div className='intro'>
		{
			pageContent !== undefined || pageType === 'frontPage' || pageType === 'profilePage' ?
			windowWidth > 920 && pageType === 'frontPage' ?
			<TrendingIntro /> :
			pageType === 'communityPage' && pageContent.communityNameLower !== 'global' ?
			<CommunityHeader /> :
			pageType === 'profilePage' ?
			<ProfileHeader  windowWidth={windowWidth}/> :
			null : null
		}
		</div>
	)
}

export default Intro