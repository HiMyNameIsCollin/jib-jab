import React, {useState, useEffect} from 'react'
import './_header.sass'

const Header = ({navIsOpen, setNav, user, setUser, windowWidth, Link}) => {

	const [headerIsSticky, setHeaderIsSticky] = useState(false)

	useEffect(() => {
		if(navIsOpen){
			document.querySelector('.fa-ellipsis-h').classList.add('navBtnOpen')
		}else{
			document.querySelector('.fa-ellipsis-h').classList.remove('navBtnOpen')
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
				<Link to='/' className='link '> Jib-Jab </Link> :
				null
			}
			{
				headerIsSticky ?
				<span className='backToTopBtn' onClick={() => setHeaderIsSticky(false)}>
					<i class="fas fa-angle-double-up"></i>
					To top
				</span> :
				windowWidth <= 920 ?
				<Link to='/' className='link'> Jib-Jab </Link>:
				<span className='backToTopBtn backToTopBtnHidden'>
					<i class="fas fa-angle-double-up"></i>
					To top
				</span>
			}
			<form>
			 	<button> <i className="fas fa-search"></i></button>
			 	<input type="text" value='Search' />
			</form>

			{

				user.userName === '' ?
				<span className='headerBtn'> Login <i className="fas fa-sign-in-alt"></i> </span> :
				<span className='headerBtn'><i class="fas fa-pencil-alt"></i> </span>
			}

				<span onClick={() => setNav(!navIsOpen)} 
				className='navBtn'> <i className="fas fa-ellipsis-h"></i> </span>
		</div>
	)
}

export default Header