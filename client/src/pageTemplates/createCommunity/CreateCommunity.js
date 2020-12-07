import React, { useState } from 'react'
import './_createCommunity.sass'
import { useForm } from 'react-hook-form'

const CreateCommunity = ({user}) => {
	const [formSent, setFormSent] = useState(false)
	const { register, handleSubmit, errors, watch} = useForm()

	const onSubmit = (data) => {
		console.log(data)
	}

	return(
		<div className='createCommunity container' >
			{
				user.karma < 1 ?
				<p className='notEnoughKarmaMessage'> 
				You must have at least 100 karma to create a community.<br/> Get out there and start socializing! 
				</p> :
				<div>
					<h3> Create a community! </h3>
					<p> Communities are a great way to link up with like minded individuals.  </p>
					<form onSubmit={handleSubmit(onSubmit)} 
					className={formSent ? 'formDeactivated ' : null}> 
					<label htmlFor="communityName">Community name: </label>
					<input type="text" placeholder='eg. Movies, Anime, Television' name='communityName' ref={register({required: true})} />
					<label htmlFor="communityInfo">A quick description of this community:  </label>
					<input type="text" placeholder='/c/Movies is a community to discuss films.' name='communityInfo' ref={register({required: false})} />

					</form>
				</div> 
			}
		</div>
	)
}

export default CreateCommunity