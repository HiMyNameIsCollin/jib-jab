import React, { useState, useEffect } from 'react'

const initialState = {
	userName: '',
	communities: ['announcements'],
	karma: 1,
	followers: [],
	settings: {
		feedType: 'list'
	}
}


const MobileNavMenu = ({Link, navType, user, setUser, setNav, history, setError}) => {

	const MobileNavCommunity = ({ listItem, Link}) => {

		const [communityImg, setCommunityImg] = useState(undefined)

		useEffect(() => {
			let isMounted = true
				fetch(`http://localhost:3000/img/${listItem.toLowerCase()}`)
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
			fetch('http://localhost:3000/api/u/settings', {
				headers: {
					authorization: `Bearer ${accessToken}`,
					'Content-Type' : 'application/json'
				}
			})
			.then(response => response.json())
			.then(response => response.success !== true ? setError('There seems to have been an error') : null)
			.catch(err => setError('There seems to have been an error'))
		}

	}


	if(navType === 'myComm'){
	return(
		<div className='mobileNavMenu'>
			<div>
			{
				user.communities.length !== 0 ?
				user.communities.map((c, i) => {
					return	<MobileNavCommunity listItem={c} Link={Link} />
				}) :
				<p style={{textAlign: 'center', paddingRight: '1em'}}> You are not subscribed to any communities </p>
			}

			</div>
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
				fetch('http://localhost:4000/api/logout', {
					method: 'delete',
					headers: {'Content-Type' : 'application/json'},
					body: JSON.stringify({
						token: refreshToken
					})
				})
				.then(response => {
					setUser(undefined)
		  			window.localStorage.removeItem("accessToken")
					window.localStorage.removeItem("refreshToken")
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