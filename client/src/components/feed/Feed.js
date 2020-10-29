import React, { useState, useEffect } from 'react'
import Post from '../post/Post'
import SortOptionsContainer from './sortOptionsContainer/SortOptionsContainer'
import './_feed.sass'

const initialSort = {
	sortOptionsChoice: 'spicy',
	sortOptionsContChoice: 'day'
}

const Feed = ({user, setUser,  windowWidth, pageType, Link}) => {

	const [feedSort, setFeedSort] = useState(initialSort)

	const ProfileFeedSort = () => {

		const [profileFeedChoice, setProfileFeedChoice] = useState(1)

		return(
			<div className='container profileFeedSort'>
				<div onClick={(e) => {
			    	e.stopPropagation()
			    	setProfileFeedChoice(1)
				}} className={profileFeedChoice === 1 ? 'profileFeedChoice' : null}>
					<i class="fas fa-fire"></i>
					<span>Spicy</span>
				</div>
				<div onClick={(e) => {
			    	e.stopPropagation()
			    	setProfileFeedChoice(2)
				}} className={profileFeedChoice === 2 ? 'profileFeedChoice' : null}>
					<i class="fas fa-baby"></i>
					<span>New</span>
				</div>
			</div>
		)
	}

	return(
		<div className={pageType === 'globalPage' ? 'feedGlobalPage feed' : 'feed'}>
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
			<Post pageType={pageType} Link={Link} user={user} windowWidth={windowWidth}/>
			<Post pageType={pageType} Link={Link} user={user} windowWidth={windowWidth}/>

			<div className='pageSelectorContainer container'>
			{
				windowWidth <= 920 ?
				<React.Fragment>
					<p>Prev</p>
					<p>More</p>
				</React.Fragment> :
				<p className='feedSeeMore'> See more </p>
			}

			</div>
		</div>
	)
}

export default Feed