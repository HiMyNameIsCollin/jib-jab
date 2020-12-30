import React, { useState, useEffect } from 'react'

const initialUser = {
	userName: '',
	communities: ['Announcements', 'General'],
	karma: 1,
	followers: [],
	following: [],
	settings: {
		feedType: 'list'
	},
	configuration: {
		image: 'https://robohash.org/100',
		headerImg: ''
	},
	unseenMessages: {
		user: false,
		replies: false,
		mentions: false
	}
}


const MobileNavMenu = ({Link, navType, user, setUser, setNav, history, setMessage, url}) => {

	const MobileNavCommunity = ({ listItem, Link}) => {

		const [communityImg, setCommunityImg] = useState(undefined)

		useEffect(() => {
			let isMounted = true
				fetch(`${url}/api/c/img/${listItem.toLowerCase()}`)
				.then(response => response.json())
				.then(response => {
					if(isMounted) {
						setCommunityImg(response)
					}})
				.catch(err => console.log(err))
				return () => { isMounted = false }
		}, [])
		return(
			<li className='mobileNavCommunityItem'>
				<Link to={`/c/${listItem}`} className='link' >
					<img src={communityImg} alt=""/>
					<span> {listItem} </span>
				</Link>
			</li>	
			)
	}

	const handleFeedType = () => {
		if(user.userName !== ''){
  			const accessToken = window.localStorage.getItem('accessToken')
			fetch(`${url}/api/u/settings`, {
				headers: {
					authorization: `Bearer ${accessToken}`,
					'Content-Type' : 'application/json'
				}
			})
			.then(response => response.json())
			.then(response => response.success !== true ? setMessage('There seems to have been an error') : null)
			.catch(err => setMessage('There seems to have been an error'))
		}

	}


	if(navType === 'myComm'){
	return(
		<div className='mobileNavMenu'>
			{
				user.communities.length !== 0 ?
				user.communities.map((c, i) => {
					return	<MobileNavCommunity listItem={c} Link={Link} />
				}) :
				<p style={{textAlign: 'center', paddingRight: '1em'}}> You are not subscribed to any communities </p>
			}

			<Link to ='/createCommunity'>
				Create community
			</Link>
			{
				user.communities.length >= 10 ?
				<Link to='/community/list' className='link'>
					View more
				</Link> :
				null
			}
		</div>
	)
	} else if (navType === 'comm') {
	return(
		<div className='mobileNavMenu'>
		{
			initialUser.communities.map((c, i) => {
				return <MobileNavCommunity listItem={c} Link={Link} />
			})
		}
			<Link to ='/createCommunity'>
				Create community
			</Link>
			<Link to='/community/list' className='link'>
				View more
			</Link>
		</div>
	)
	} else if (navType === 'settings'){
	return(
		<div className='mobileNavMenu'>
		<div> 
			<span>
			Feed view:
			</span>
			<div className={user.settings.feedType === 'card' ? 'mobileNavMenuSelection ' : null}
				onClick={(e) => {
				e.stopPropagation()
				let userMod = {...user}
				userMod.settings.feedType = 'card' 
				setUser(userMod)
				handleFeedType()
			}}> 
				<i className="fas fa-square"></i>
				<span>Card</span>
			</div>
			<div 
				className={user.settings.feedType === 'list' ? 'mobileNavMenuSelection' : null}
				onClick={(e) => {
				e.stopPropagation()
				let userMod = {...user}
				userMod.settings.feedType = 'list'
				setUser(userMod)
				handleFeedType()
			}}> 
				<i className="fas fa-bars"></i>
				<span>List</span>
			</div>
		</div>

		{
			user.userName !== '' ?
			<div onClick={() => {
				const refreshToken = window.localStorage.getItem('refreshToken')
				setNav(false)
				fetch(`${url}/api/logout`, {
					method: 'delete',
					headers: {'Content-Type' : 'application/json'},
					body: JSON.stringify({
						token: refreshToken
					})
				})
				.then(response => {
					setUser(initialUser)
		  			window.localStorage.removeItem("accessToken")
					window.localStorage.removeItem("refreshToken")
					history.push('/c/popular')
				})
				.catch(err => console.log(err))
			}}> 
				<span> Logout </span> 
			</div> :
			null
		}
		</div>
	)
	}
}

export default MobileNavMenu