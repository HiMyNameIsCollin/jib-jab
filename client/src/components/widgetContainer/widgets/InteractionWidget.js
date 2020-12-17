import React from 'react'
import timeDifference from '../../../utils/timeDifference'

const InteractionWidget = ({pageContent, setMessage, setOverlay, user, setUser}) => {

	const handleFollow = (target, request) => {
		if(user.userName !== '' && user.userName !== pageContent.userName){
  			const accessToken = window.localStorage.getItem('accessToken')
			fetch('http://localhost:3000/api/u/subscribe', {
				method: 'post',
				headers: {
					authorization: `Bearer ${accessToken}`,
					'Content-Type' : 'application/json'
				},
				body: JSON.stringify({
					userName: target,
					request,
				})
			})
			.then(response => response.json())
			.then(response => {
				setUser(response)
			})
			.catch(err => {
				setMessage('There has been an error trying to follow that user')
			})			
		} else {
			if(user.userName === ''){
				setMessage('You must be logged in to follow a user') 
			} else {
			setMessage('Dont believe your own hype')	
			}
		}

	}
	return(
		<div className='interactionWidget'>
			<h4>
				Interact
			</h4>
			<div className='interactionWidgetButtons'>
				{
					user.following.includes(pageContent.userName)?
					<div onClick={() => handleFollow(pageContent.userNameLower, 'unsubscribe')}>
						Unfollow
					</div> :
					<div onClick={() => handleFollow(pageContent.userNameLower, 'subscribe')}>
						Follow
					</div> 
				}
				<div onClick={() => {
					if(user.userName !== ''){
						setOverlay('submitMessage')
					} else {
						setMessage('You must be logged in to send a message')
					}
				}}>
					Message
				</div>
			</div>
			<div className='interactionWidgetScore container'>
				<div >
					<p> {pageContent.karma} </p>
					<p> Karma </p>
				</div>
				<div >
					<p> {pageContent.followers.length} </p>
					<p> Followers </p>
				</div>
				<div>
					<p> User EST: </p>
					<p> {timeDifference(pageContent.createdOn)}</p>
				</div>
			</div>
		</div>
	)
}


export default InteractionWidget