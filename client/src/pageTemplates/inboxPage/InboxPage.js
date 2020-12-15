
import React, {useState, useEffect} from 'react'
import { useForm } from 'react-hook-form'
import './_inboxPage.sass'
import Loading from '../../components/loading/Loading'
import timeDifference from '../../utils/timeDifference'

const InboxPage = ({ Link, user, setUser, windowWidth, overlayIsOpen, setOverlay, pageType, setMessage, history}) => {

	const InboxBtnsContainer= () => {
		return(
		<div className='container inboxBtns'>
			<div 
				onClick={() => {
					setInboxMessages(undefined)
					setInboxType('user')
				}}
				className={inboxType === 'user' ? 'selectedBtn' : null}>
				<i class="fas fa-inbox fa-2x"></i>
				<p> Messages </p>
			</div>
			<div
				onClick={() => {
					setInboxMessages(undefined)
					setInboxType('replies')
					}
				}
				className={inboxType === 'replies' ? 'selectedBtn' : null}>
				<i class="far fa-comment-dots fa-2x"></i>
				<p> Replies </p>
			</div>
			<div
				onClick={() => {
					setInboxMessages(undefined)
					setInboxType('mentions')
				}}
				className={inboxType === 'mentions' ? 'selectedBtn' : null}>
				<i class="fas fa-quote-left fa-2x"></i>
				<p> Mentions </p>
			</div>
		</div>
		)
	}

	const InboxMessage = ({message}) => {
	return(
		<div 
			className='inboxMessage'>
			<div className={message.seen === false ? 'newMessageIndicator' : null}>
				<p> {message.subject}</p>
				{
					user.userName !== message.sender && message.type !== 'reply' && message.type !=='mentions' ?
					<div onClick={() => setReplyWindowOpen(message)} className='container'>
						<p> Reply </p>
						<i class="far fa-arrow-alt-circle-right fa-2x"></i>
					</div> :
					null
				}
				<p className='messageTime'> {timeDifference(message.time)}</p>
			</div>
			<p> {message.body} </p>
			<Link
				className='link' 
				to={`/u/${message.sender}`}>
				<p className='messageSender'> - {message.sender} </p>
			</Link>

		</div>
		)
	}

	const MessageReply = () => {

		const [formSent, setFormSent] = useState(false)
		const { register, handleSubmit, errors} = useForm()		

		const onSubmit = (data) => {
			if(formSent === false){
			setFormSent(true)
			const accessToken = window.localStorage.getItem('accessToken')
			fetch('http://localhost:3000/api/message', {
				method: 'post',
				headers: {
					authorization: `Bearer ${accessToken}`,
					'Content-Type' : 'application/json'
				},
				body: JSON.stringify({
					target: replyWindowOpen.sender,
					subject: data.messageSubject,
					body: data.messageBody,
					type: 'user'
				})
			})
			.then(response => response.text())
			.then(response => {
				if(response === 'Success'){
					setMessage('Message successfully sent')
					setFormSent(false)
					setReplyWindowOpen(undefined)
				} else{
					setFormSent(false)
					setMessage('Something went wrong...')
				}
			})
			.catch(err => {
				setFormSent(false)
				setMessage('Something went wrong...')
				})
			}
		}

		return(
			<div className='messageReplyOverlay container'>
				<div className='messageReply'>
					<h3>Reply: </h3>
					<span 
					className='closeReplyOverlay'
					onClick={() => setReplyWindowOpen(undefined)}> X </span>
					<p> {replyWindowOpen.sender}</p>
					<form 
					onSubmit={handleSubmit(onSubmit)} 
					className={formSent ? 'formDeactivated' : null}>
						{errors.messageSubject && errors.messageSubject.type === 'maxLength' && <p> Whoa whoa, why not make that title a bit more concise? </p>}
						<input type='text' defaultValue={`RE:${replyWindowOpen.subject}`} name='messageSubject' ref={register({required: false, maxLength: 150})}/>
						{errors.messageBody && errors.messageBody.type === 'required' && <p> Your message needs some substance  </p>}
						<textarea rows='4' placeholder="What's going on?" name="messageBody" ref={register({required: true, maxLength: 5000})} />
						<button> Submit </button>
					</form>
				</div>
			</div>
		)
	}


	const [inboxMessages, setInboxMessages] = useState(undefined)
	const [messageOptions, setMessageOptions] = useState('received')
	const [inboxType, setInboxType] = useState('user')
	const [replyWindowOpen, setReplyWindowOpen] = useState(undefined)


	useEffect(() => {
  		const accessToken = window.localStorage.getItem('accessToken')
		fetch(`http://localhost:3000/api/inbox/${inboxType}`, {
			headers: {
				'authorization' : `Bearer ${accessToken}`,
				'Content-Type' : 'application/json'
			},
		})
		.then(response => response.json())
		.then(response => {
			let updatedUser = { ...user }
			updatedUser.unseenMessages[inboxType] = false
			setUser(updatedUser)
			setInboxMessages(response)
		})
		.catch(err => {
			setMessage('There was an issue retreiving your messages')
		})
	}, [inboxType])

>>>>>>> inbox

	return(
		<div className='inboxPage'>
<<<<<<< HEAD
			<div className='container'>
				<h3> Inbox </h3>
			</div>
=======
			{
				replyWindowOpen !== undefined ?
				<MessageReply /> :
				null
			}
			<React.Fragment>
				<div className='container inboxHeader'>
					<h3> Inbox </h3>
					<i onClick={() => setOverlay('submitMessage')} class="fas fa-pencil-alt fa-2x "></i> 
				</div>
				<InboxBtnsContainer />
				{
					inboxType === 'user' ? 
					<div className='container messageOptions'>
						<div
						onClick={() => setMessageOptions('received')}
						className={messageOptions === 'received' ? 'messageOptionsChoice' : null }> Received</div>
						<div
						onClick={() => setMessageOptions('sent')}
						className={messageOptions === 'sent' ? 'messageOptionsChoice' : null }> Sent</div>
					</div> :
					null
				}

				{
					inboxType === 'user' ?
					inboxMessages === undefined ?
					<Loading /> :
					messageOptions === 'received' ?
					inboxMessages.received.length > 0 ?
					inboxMessages.received.map((m, i) => { 
							return <InboxMessage message={m} /> 
						}):
					<p style={{padding: '.5em'}}> You dont have any messages! </p> :
					inboxMessages.sent.length > 0 ?
					inboxMessages.sent.map((m, i) => {
						return <InboxMessage message={m} /> 
					}) :
					<p style={{padding: '.5em'}}> You havent sent any messages yet </p> :
					inboxType === 'replies' ?
					inboxMessages === undefined ?
					<Loading /> :
					inboxMessages.replies.length > 0 ?
					inboxMessages.replies.map((m, i) => {
						return <InboxMessage message={m} />
					}) :
					<p style={{padding: '.5em'}}> Nobody has replied to your posts/comments yet </p> :
					inboxType === 'mentions' ?
					inboxMessages === undefined ?
					<Loading /> :
					inboxMessages.mentions.length > 0 ?
					inboxMessages.mentions.map((m, i) => {
						return <InboxMessage message={m} />
					}):
					<p style={{padding: '.5em'}}> Nobody has mentioned you yet </p> :
					null
				}
				
			</React.Fragment>
>>>>>>> inbox
		</div> 
	)
}

export default InboxPage