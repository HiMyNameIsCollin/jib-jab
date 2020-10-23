import React, {useState, useEffect } from 'react'

import './_intro.sass'

const TrendingIntro = () => {

	const TrendingBtn = () => {
		return(
			<div>
				<span class='trendingText'>
					<h2> Trending title</h2>
					<p> Trending text </p>
				</span>
				<img src="https://robohash.org/1" alt="" />
			</div>
		)
	}

	return(
		<div className='container trendingIntro'>
			<span> Trending today</span>
			<div className='container'>
				<TrendingBtn />
				<TrendingBtn />
				<TrendingBtn />
				<TrendingBtn />
			</div>
		</div>
	)
}

const CommunityHeader = () => {
	return(
		<div className='communityHeader'> 
			<div className=' container'>
				<img src="https://robohash.org/4" alt=""/>
				<p> Name of community</p>
				<p> Welcome to this community, here you can discuss whatever pertains to this communities interests. </p>
			</div>
		</div>
	)
}

const ProfileHeader = ({windowWidth}) => {
	return(
		<div className='container profileHeader'>
			<div className='profileAvatar container'>
				<img src="https://robohash.org/4" alt=""/>
				<p>/u/UserName</p>
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

const Intro = ({pageType, windowWidth}) => {
	return(
		<div className='intro'>
		{
			windowWidth > 920 && pageType === 'frontPage' ?
			<TrendingIntro /> :
			pageType === 'communityPage' ?
			<CommunityHeader /> :
			pageType === 'profilePage' ?
			<ProfileHeader  windowWidth={windowWidth}/> :
			null
		}
		</div>
	)
}

export default Intro