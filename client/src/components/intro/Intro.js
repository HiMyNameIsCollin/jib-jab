import React, {useState, useEffect } from 'react'
import Loading from '../loading/Loading'
import './_intro.sass'


const Intro = ({pageType, windowWidth, pageContent, user}) => {

	const TrendingIntro = () => {

		const [trendingPosts, setTrendingPosts] = useState(undefined)

		useEffect(() => {
			fetch('http://localhost:3000/api/p', {
				method: 'post',
				headers: {'Content-Type' : 'application/json'}, 
				body: JSON.stringify({
					posts: pageContent.posts,
					sortType: 'best',
					sortTypeCont: 'day',
					limit: 4,
				})
			})
			.then(result => result.json())
			.catch(err => console.log(err))
		},[])

		const TrendingBtn = ({post}) => {
			return(
				<div>
					<span class='trendingText'>
						<h2>{post.title}</h2>
						<p> {post.text} </p>
					</span>
					<img src={post.img} alt="" />
				</div>
			)
		}
		if(trendingPosts !== undefined) {
			return(
				<div className='container trendingIntro'>
					<span> Trending today</span>
					<div className='container'>
						{
							trendingPosts.map((p , i) => {
								return <TrendingBtn post={p} />
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
					<img src={pageContent.configuration.communityImg} alt=""/>
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