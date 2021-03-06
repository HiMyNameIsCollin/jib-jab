import React, {useState, useEffect} from 'react'
import './_mobileNav.sass'
import MobileNavMenu from './MobileNavMenu'
import SearchBar from '../searchBar/SearchBar'

const MobileNav = ({Link, history, navIsOpen, setNav, user, setUser, setOverlay, setMessage, url }) => {
	const [commIsOpen, setComm]  = useState(false)
	const [myCommIsOpen, setMyComm] = useState(false)
	const [settingIsOpen, setSettings] = useState(false)

	useEffect(() => {
		if(commIsOpen === true){
			document.querySelector('.fa-angle-double-right').classList.add('navBtnOpen')
		} else {
			document.querySelector('.fa-angle-double-right').classList.remove('navBtnOpen')
		}

		if(myCommIsOpen === true){
			document.querySelector('.fa-angle-right').classList.add('navBtnOpen')
		} else {
			document.querySelector('.fa-angle-right').classList.remove('navBtnOpen')
		}

	},[commIsOpen, myCommIsOpen])

	return(
		<nav className='container mobileNav'>
			<SearchBar Link={Link} user={user} searchBarType='header' url={url}/>
			{
				user.userName === '' ?
				<div className='navItem container'>
					<div onClick={() => {
						setOverlay('login')
						setNav(!navIsOpen)
					}}> 
						<i className="fas fa-sign-in-alt "></i>
						 Login 
					</div>
					<div onClick={() => {
						setOverlay('register')
						setNav(!navIsOpen)
					}}> 
						<i className="fas fa-sign-in-alt "></i>
						 Sign Up 
					</div>
				</div> :
				<React.Fragment>
					<div className='navItem navUserName'>
						<Link className='link' to={`/u/${user.userNameLower}`}> 
							<img src={user.configuration.image} alt='User avatar'/>
							<span> {user.userName}</span>
						</Link>
					</div>
					<div className='navItem'>
						<Link className='link' to='/inbox'>
							<i className="fas fa-inbox "></i>
							<span className={user.unseenMessages.user === true ||
								user.unseenMessages.replies === true ||
								user.unseenMessages.mentions === true ? 
								'inboxNewMessage' : 
								null }>Inbox</span>
						</Link>
					</div>
				</React.Fragment>
			}
			<div className='navItem' onClick={() => setComm(!commIsOpen)}>
				<i className="fas fa-angle-double-right "></i>
				<span>Communities</span>
				<i className="fas fa-caret-down"></i>
			</div>
			{
				commIsOpen ?
				<MobileNavMenu navType={'comm'} Link={Link} setNav={setNav} user={user} setMessage={setMessage} url={url} /> :
				null
			}
			<div className='navItem' onClick={() => setMyComm(!myCommIsOpen)}>
				<i className="fas fa-angle-right "></i>
				<span>My Communities</span>
				<i className="fas fa-caret-down"></i>
			</div>
			{
				myCommIsOpen ?
				<MobileNavMenu navType={'myComm'} Link={Link} user={user} setMessage={setMessage} url={url} /> :
				null
			}
			<div className='navItem' onClick={() => setSettings(!settingIsOpen)}>
				<i className="fas fa-cog "></i>
				<span>Settings</span>
				<i className="fas fa-caret-down"></i>
			</div>
			{
				settingIsOpen ?
				<MobileNavMenu setUser={setUser} user={user} setNav={setNav} navType={'settings'} url={url} Link={Link} setMessage={setMessage} history={history}/> :
				null
			}
			<Link to='/c/global' className='navItem link'>
				<i className="fas fa-globe-americas "></i>
				<span>Global </span>
			</Link>
			<Link to='/' className='navItem link'>
				<i className="fas fa-caravan "></i>
				<span>Home </span>
			</Link>
			<Link to='./about' className='navItem link'>
				<i className="far fa-address-card "></i>
				<span>About</span>
			</Link>
			<a href='httpss://twitter.com/to_coding' target='_blank' className='navItem'>
				<i className="fab fa-twitter-square "></i>
				<span>Follow me on Twitter </span>
			</a>
		</nav>
	)
}

export default MobileNav