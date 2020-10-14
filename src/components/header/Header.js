import React, {useEffect} from 'react'
import './_header.sass'

const Header = ({navIsOpen, setNav, userLoggedIn, setLoggedIn}) => {

	useEffect(() => {
		if(navIsOpen){
			document.querySelector('.fa-ellipsis-h').classList.add('navBtnOpen')
		}else{
			document.querySelector('.fa-ellipsis-h').classList.remove('navBtnOpen')
		}
	
	}, [navIsOpen])

	return(
		<div id='header' className='container'>
			<div>Jib-Jab</div>
			<form>
			 	<button> <i className="fas fa-search"></i></button>
			 	<input type="text" value='Search' />
			</form>

			{
				!userLoggedIn ?
				<span className='headerBtn'> Login <i className="fas fa-sign-in-alt"></i> </span> :
				<span className='headerBtn'><i class="fas fa-pencil-alt"></i> </span>
			}
			<span onClick={() => {
				setNav(!navIsOpen)
			}} className='navBtn'> <i className="fas fa-ellipsis-h"></i> </span>
			
		</div>
	)
}

export default Header