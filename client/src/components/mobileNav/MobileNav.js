import React, {useState, useEffect} from 'react'
import './_mobileNav.sass'
import MobileNavMenu from './MobileNavMenu'
import SearchBar from '../searchBar/SearchBar'

const MobileNav = ({Link, navIsOpen, setNav, user, setUser, setOverlay, setMessage}) => {
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
			<SearchBar Link={Link} user={user} searchBarType='header'/>
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
							<i class="fas fa-inbox "></i>
							<span>Inbox</span>
						</Link>
					</div>
				</React.Fragment>
			}
			<div className='navItem' onClick={() => setComm(!commIsOpen)}>
				<i class="fas fa-angle-double-right "></i>
				<span>Communities</span>
				<i class="fas fa-caret-down"></i>
			</div>
			{
				commIsOpen ?
				<MobileNavMenu navType={'comm'} Link={Link} setNav={setNav} user={user} setMessage={setMessage}/> :
				null
			}
			<div className='navItem' onClick={() => setMyComm(!myCommIsOpen)}>
				<i class="fas fa-angle-right "></i>
				<span>My Communities</span>
				<i class="fas fa-caret-down"></i>
			</div>
			{
				myCommIsOpen ?
				<MobileNavMenu navType={'myComm'} Link={Link} user={user} setMessage={setMessage}/> :
				null
			}
			<div className='navItem' onClick={() => setSettings(!settingIsOpen)}>
				<i class="fas fa-cog "></i>
				<span>Settings</span>
				<i class="fas fa-caret-down"></i>
			</div>
			{
				settingIsOpen ?
				<MobileNavMenu setUser={setUser} user={user} setNav={setNav} navType={'settings'} Link={Link} setMessage={setMessage}/> :
				null
			}
			<Link to='/c/global' className='navItem link'>
				<i class="fas fa-globe-americas "></i>
				<span>Global </span>
			</Link>
			<Link to='/' className='navItem link'>
				<i class="fas fa-caravan "></i>
				<span>Home </span>
			</Link>
			<Link to='./about' className='navItem link'>
				<i class="far fa-address-card "></i>
				<span>About</span>
			</Link>
			<a href='#' target='_blank' className='navItem'>
				<i class="fab fa-twitter-square "></i>
				<span>Follow me on Twitter </span>
			</a>
		</nav>
	)
}

export default MobileNav