import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import './_inboxPage.sass'

const InboxPage = ({ Link, user, setUser, windowWidth, overlayIsOpen, setOverlay, location, pageType, setMessage, history}) => {

	const InboxBtnsContainer= () => {
		return(
		<div className='container inboxBtns'>
			<div 
				onClick={() => setInboxType('messages')}
				className={inboxType === 'messages' ? 'selectedBtn' : null}>
				<i class="fas fa-inbox fa-2x"></i>
				<p> Messages </p>
			</div>
			<div
				onClick={() => setInboxType('replies')}
				className={inboxType === 'replies' ? 'selectedBtn' : null}>
				<i class="far fa-comment-dots fa-2x"></i>
				<p> Replies </p>
			</div>
			<div
				onClick={() => setInboxType('mentions')}
				className={inboxType === 'mentions' ? 'selectedBtn' : null}>
				<i class="fas fa-quote-left fa-2x"></i>
				<p> Mentions </p>
			</div>
		</div>
		)
	}

	const InboxMessage = () => {
	return(
		<div 
			className='inboxMessage'>
			<div className='container'>
				<p> Post asdkjsadjasdasdksdaa </p>
				<i onClick={() => setRoute('message')} class="far fa-arrow-alt-circle-right fa-2x"></i>
				<p> post time </p>
			</div>
			<p> Message body will go up in this little part right here, just to be followed by the users name </p>
			<p className='messageSender'> - users name </p>
		</div>
		)
	}

	const MessageEnlarged = () => {
		return(
			<div className='messageEnlarged'>
				<div className='container inboxHeader'>
					<i onClick={() => setRoute('inbox')} class="far fa-arrow-alt-circle-left fa-2x"></i> 
					<h3> Message Titlasdkj oke adigj aas ee </h3>
				</div>
				<div className='messageContent'>
					<p> post time </p>
					<p> Message body will go up in this little part right here, just to be followed by the users name </p>
					<p className='messageSender'> - users name </p>
					<p onClick={() => setOverlay('submitMessage')}> Reply </p>
				</div>
			</div>
		)
	}

	const [route, setRoute] = useState('inbox')
	const [inboxType, setInboxType] = useState('messages')
	return(
		<div className='inboxPage'>
		{
			route === 'inbox' ?
			<React.Fragment>
				<div className='container inboxHeader'>
					<h3> Inbox </h3>
					<i onClick={() => setOverlay('submitMessage')} class="fas fa-pencil-alt fa-2x "></i> 
				</div>
				<InboxBtnsContainer />
				{
					<InboxMessage />	
				}
			</React.Fragment> :
			<MessageEnlarged />
		}
		</div> 
	)
}

export default InboxPage