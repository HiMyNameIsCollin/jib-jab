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


const MobileNavMenu = ({Link, navType, user, setUser, setNav, history}) => {



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
		<div> Feed view: </div>

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