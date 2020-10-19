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
		<div id='trendingIntro' className='container'>
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
		<div id='communityHeader'> 
		</div>
	)
}

const Intro = ({type, windowWidth}) => {
	return(
		<div id='intro'>
		{
			windowWidth > 920 && type === 'frontPage' ?
			<TrendingIntro /> :
			<CommunityHeader />
		}
		</div>
	)
}

export default Intro