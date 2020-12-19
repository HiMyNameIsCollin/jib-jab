import React, {useState, useEffect} from 'react'
import SearchBar from '../searchBar/SearchBar'
import './_header.sass'

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

const Header = ({navIsOpen, setNav, user, setUser, windowWidth, Link, setOverlay, history}) => {

	const [headerIsSticky, setHeaderIsSticky] = useState(false)
	const [userDropDownOpen, setUserDropDown] = useState(false)

	useEffect(() => {
		if(windowWidth <= 920){
			if(navIsOpen){
				document.querySelector('.fa-ellipsis-h').classList.add('navBtnOpen')
			}else{
				document.querySelector('.fa-ellipsis-h').classList.remove('navBtnOpen')
			}
		}
	
	}, [navIsOpen])

	useEffect(() => {
		const sticky = document.getElementById('header').offsetTop
		function fireOnScroll(){
		  if (window.pageYOffset > sticky) {
		  	setHeaderIsSticky(true)
		  } else {
			setHeaderIsSticky(false)
		  }
		}
		window.addEventListener('scroll', fireOnScroll)
		return () => window.removeEventListener("resize", fireOnScroll)
	}, [])

	useEffect(() => {
		const header = document.getElementById('header')
		if(headerIsSticky){
		    header.classList.add("sticky")
		    document.getElementById('AppContainer').classList.add('paddedTop')
		} else {
		    header.classList.remove("sticky")
		    document.getElementById('AppContainer').classList.remove('paddedTop')	
			  document.body.scrollTop = 0
			  document.documentElement.scrollTop = 0	
		}
	},[headerIsSticky])

	return(
		<div id='header' className='container header'>
			{
				windowWidth > 920 ?
				<Link to='/c/popular' className='link '> Jib-Jab </Link> :
				null
			}
			{
				headerIsSticky ?
				<span className='backToTopBtn' onClick={() => setHeaderIsSticky(false)}>
					<i className="fas fa-angle-double-up"></i>
					To top
				</span> :
				windowWidth <= 920 ?
				<Link to='/' className='link'> Jib-Jab </Link>:
				<span className='backToTopBtn backToTopBtnHidden'>
					<i className="fas fa-angle-double-up"></i>
					To top
				</span>
			}
				<SearchBar Link={Link} searchBarType='header' user={user}/>

				<Link to='/c/global' className='headerBtn link global'>
					<i className="fas fa-globe-americas "></i>
				</Link>

			{

				user.userName === '' ?
				<span className='headerBtn' onClick={() => setOverlay('login')}> Login <i className="fas fa-sign-in-alt"></i> </span> :
				<React.Fragment>
					<Link
					to='/inbox' 
					className={user.unseenMessages.user === true ||
								user.unseenMessages.replies === true ||
								user.unseenMessages.mentions === true ? 
								'headerBtn inbox newMsgIndicator' :
								 'headerBtn inbox'}>
						<i className="fas fa-inbox"></i>
					</Link>
					<span className='headerBtn' onClick={() => setOverlay('submitPost')}><i className="fas fa-pencil-alt"></i> </span>
				</React.Fragment>
			}
			{
				windowWidth <= 920 ?
				<span 
					onClick={() => setNav(!navIsOpen)} 
					className={user.unseenMessages.user === true ||
								user.unseenMessages.replies === true ||
								user.unseenMessages.mentions === true ? 
								'navBtn newMsgIndicator' :
								 'navBtn'}> 
					<i className="fas fa-ellipsis-h"></i> 
				</span> :
				user.userName !== '' ?
				<div className='userDropDown'> 
					<div onClick={() => setUserDropDown(!userDropDownOpen)} 
						className='container main'> 
						<div className='container'>
							<img src={user.configuration.image} alt=""></img>
							{user.userName}
						</div>
						<div className='container'>
							<i className="fas fa-star-of-life"></i>
							{user.karma} karma
							<i className="fas fa-level-down-alt"></i>                              
						</div>
					</div>
					{
						userDropDownOpen ?
						<div className='userDropDownContent'>
							<Link className='userDropDownItem' onClick={() => setUserDropDown(false)} to={`/u/${user.userNameLower}`}><i className="fas fa-user-circle"></i> Your profile </Link>
							<div onClick={()=>{
								setOverlay('editProfile')
								setUserDropDown(false)
							}} className='userDropDownItem' ><i className="fas fa-cog "></i> User Settings</div>
							<Link onClick={() => setUserDropDown(false)} className='userDropDownItem' to ='/createCommunity'><i className="fas fa-globe-americas "></i>Create community</Link>
							<div className='userDropDownItem'
								onClick={() => {
								const refreshToken = window.localStorage.getItem('refreshToken')
								setNav(false)
								fetch('https://jibjab.herokuapp.com/api/logout', {
									method: 'delete',
									headers: {'Content-Type' : 'application/json'},
									body: JSON.stringify({
										token: refreshToken
									})
								})
								.then(response => {
									setUser(initialUser)
									setUserDropDown(false)
						  			window.localStorage.removeItem("accessToken")
									window.localStorage.removeItem("refreshToken")
									history.push('/c/popular')
								})
								.catch(err => console.log(err))
							}}><i className="fas fa-sign-out-alt"></i> Logout</div>
						</div> :
						null
					} 
				</div> :
				null
			}

		</div>
	)
}

export default Header