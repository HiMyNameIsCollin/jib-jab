import React, {useState, useEffect} from 'react'
import './_mobileNav.sass'
import MobileNavMenu from './MobileNavMenu'


const UserMobileNav = () => {

	const [commIsOpen, setComm]  = useState(false)
	const [myCommIsOpen, setMyComm] = useState(false)
	const [settingIsOpen, setSettings] = useState(false)
	const [aboutIsOpen, setAbout] = useState(false)

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
		<nav id='mobileNav' className='container'>
			<form>
			 	<button> <i className="fas fa-search"></i></button>
			 	<input type="text" value='Search' />
			</form>
			<div className='navItem navUserName'>
				<img src='https://robohash.org/1' alt='User avatar'/>
				<span> Users Name </span>
			</div>
			<div className='navItem'>
				<i class="fas fa-inbox fa-2x"></i>
				<span>Inbox</span>
			</div>
			<div className='navItem' onClick={() => setComm(!commIsOpen)}>
				<i class="fas fa-angle-double-right fa-2x"></i>
				<span>Communities</span>
				<i class="fas fa-caret-down"></i>
			</div>
			{
				commIsOpen ?
				<MobileNavMenu type={'comm'} /> :
				null
			}
			<div className='navItem' onClick={() => setMyComm(!myCommIsOpen)}>
				<i class="fas fa-angle-right fa-2x"></i>
				<span>My Communities</span>
				<i class="fas fa-caret-down"></i>
			</div>
			{
				myCommIsOpen ?
				<MobileNavMenu type={'myComm'}/> :
				null
			}
			<div className='navItem' onClick={() => setSettings(!settingIsOpen)}>
				<i class="fas fa-cog fa-2x"></i>
				<span>Settings</span>
				<i class="fas fa-caret-down"></i>
			</div>
			{
				settingIsOpen ?
				<MobileNavMenu type={'settings'} /> :
				null
			}
			<div className='navItem' onClick={() => setAbout(!aboutIsOpen)}>
				<i class="far fa-address-card fa-2x"></i>
				<span>About</span>
				<i class="fas fa-caret-down"></i>
			</div>
			{
				aboutIsOpen ?
				<MobileNavMenu type={'about'} /> :
				null
			}
			<a href='#' className='navItem navItemSolo'>
				<i class="fab fa-twitter-square fa-2x"></i>
				<span> Follow me on Twitter </span>
			</a>
		</nav>
	)
}

const DefaultMobileNav = () => {

	const [commIsOpen, setComm]  = useState(false)

	const [aboutIsOpen, setAbout] = useState(false)

	useEffect(() => {
		if(commIsOpen === true){
			document.querySelector('.fa-angle-double-right').classList.add('navBtnOpen')
		} else {
			document.querySelector('.fa-angle-double-right').classList.remove('navBtnOpen')
		}
	},[commIsOpen])
	return(
		<nav id='mobileNav' className='container'>
			<form>
			 	<button> <i className="fas fa-search"></i></button>
			 	<input type="text" value='Search' />
			</form>
			<div className='navItem container'>
				<div> <i className="fas fa-sign-in-alt "></i> Login </div>
				<div> <i className="fas fa-sign-in-alt "></i> Sign Up </div>
			</div>
			<div className='navItem' onClick={() => setComm(!commIsOpen)}>
				<i class="fas fa-angle-double-right fa-2x"></i>
				<span>Communities</span>
				<i class="fas fa-caret-down"></i>
			</div>
		{
			commIsOpen ?
			<MobileNavMenu type={'comm'} /> :
			null
		}
			<div className='navItem navItemSolo' >
				<i class="fas fa-globe-americas fa-2x"></i>
				<span>Global</span>
			</div>

			<div className='navItem' onClick={() => setAbout(!aboutIsOpen)}>
				<i class="far fa-address-card fa-2x"></i>
				<span>About</span>
				<i class="fas fa-caret-down"></i>
			</div>
		{
			aboutIsOpen ?
			<MobileNavMenu type={'about'} /> :
			null
		}

			<a href='#' className='navItem navItemSolo'>
				<i class="fab fa-twitter-square fa-2x"></i>
				<span> Follow me on Twitter </span>
			</a>
		</nav>
	)
}

const MobileNav = ({userLoggedIn}) => {
	if(userLoggedIn === true) {
		return <UserMobileNav />
	}else{
		return <DefaultMobileNav />
	}
}

export default MobileNav