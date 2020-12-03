import React, {useState, useEffect } from 'react'
import Loading from '../loading/Loading'
import './_intro.sass'


const Intro = ({pageType, windowWidth, pageContent, user, Link}) => {

	const TrendingIntro = () => {
		const [trendingPosts, setTrendingPosts] = useState(undefined)

		useEffect(() => {
			fetch('http://localhost:3000/api/p', {
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
					<span class='trendingText'>
						<h2>{post.title}</h2>
						<p> {post.text && post.text !== '' ? post.text.length > 50 ? post.text.slice(0, 50) + '...' : post.text : null } </p>
					</span>
					{
						post.imageLink !== '' ?
						<img src={post.imageLink} alt="" /> :
						post.imageRefs.length > 0 ?
						<img src={`http://localhost:3000/api/p/img/${post.imageRefs[0]}`}/> :
						<img src='http://source.unsplash.com/random/200x200' alt='' />
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
									return <TrendingBtn post={p} />
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
					<img src={pageContent.configuration.communityImg }alt=""/>
				</div>
				<div className=' container'>
					<p> {pageContent.communityName}</p>
					<p> {pageContent.configuration.communityHeader} </p>
				</div>
			</div>
		)
	}

	const ProfileHeader = ({windowWidth}) => {
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
						<div className='profileFollow'>
							Follow
						</div>
						<div className='profileMessage'>
							Message
						</div>
					</div>
					<div className='profileScore container'>
						<div >
							<p> 0 </p>
							<p> Karma </p>
						</div>
						<div >
							<p> 0 </p>
							<p> Followers </p>
						</div>
						<div>
							<p> User since: </p>
							<p> November 5th 2020 </p>
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