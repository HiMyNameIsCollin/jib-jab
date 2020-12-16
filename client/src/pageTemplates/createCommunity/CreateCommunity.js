import React, { useState, useEffect } from 'react'
import SearchBar from '../../components/searchBar/SearchBar'
import './_createCommunity.sass'
import Loading from '../../components/loading/Loading'
import { useForm } from 'react-hook-form'


const initialPageOne = {
	complete: false,
	communityName: '',
	communityHeaderBlurb: '',
	image: '',
	headerImg: '',
	communityVisibility: '',
	postPermission: ''                                                                        
}
const initialPageTwo = {
	complete: false,
	aboutWidget: {
		active: false,
		header: '',
		body: ''
	},
	communityListWidget: {
		active: false,
		communities: [],
		header: 'Related communities'
	},
	announcementWidget: {
		active: false,
		header: '',
		body: '',
		links: []
	},
	rulesWidget: {
		active: false,
		header: '',
		rules: []
	},
	linkListWidget: {
		active: false,
		header: '',
		links: []
	}
}


const CreateCommunity = ({user, setMessage, history}) => {



	const HeaderExample = () => {

		return(
			<div className='communityHeader createCommunityPreview' style={{backgroundImage: `url(${headerImg}})` }}> 
				<div className='container'>
					<img src={image !== '' ? image : 'https://robohash.org/250'} alt="Your community image goes here"/>
				</div>
				<div className=' container'>
					<p> {communityName !== '' ? communityName : 'eg. Movies, Anime, Television'} </p>
					<p> {communityHeaderBlurb !== '' ? communityHeaderBlurb : 'eg. /c/Movies is a community to discuss films.'} </p>
				</div>
			</div>
		)
	}

	const [formSent, setFormSent] = useState(false)
	const [communityName, setCommunityName] = useState('')
	const [communityHeaderBlurb, setCommunityHeaderBlurb] = useState('')
	const [image, setImage] = useState('')
	const [headerImg, setHeaderImg] = useState('https://source.unsplash.com/random/800x1200')
	const [communityCreationPageOne, setCommunityCreationPageOne] = useState(initialPageOne)
	const [communityCreationPageTwo, setCommunityCreationPageTwo] = useState(initialPageTwo)
	const [communityCreationPageThree, setCommunityCreationPageThree] = useState([])
	const [communityWidgets, setCommunityWidgets] = useState([])
	const [moderatorArray, setModeratorArray] = useState([])
	const [isLoading, setLoading] = useState(false)
	const { register, handleSubmit, errors, watch} = useForm()



	const onSubmit = (data) => {
		if(communityCreationPageOne.complete === false){
			const pageOne = {
				complete: true,
				communityName: data.communityName ,
				communityHeaderBlurb: data.communityHeader,
				image: data.image ? data.image : `https://robohash.org/${data.communityName}` ,
				headerImg: data.headerImg ? data.headerImg : 'https://source.unsplash.com/random/800x1200',
				communityVisibility: data.communityVisibility,
				postPermission: data.postPermission                                                                         
			}
			fetch('https://jibjab.herokuapp.com/api/search',{
				method: 'post',
				headers: {'Content-Type' : 'application/json'},
				body: JSON.stringify({
					query: pageOne.communityName
				})
			})
			.then(response => response.json())
			.then(response => {
				if(response.communityArray.length === 0){
					setCommunityCreationPageOne(pageOne)
				} else{
					setMessage('There is already a community with that name')
				}
			})
			.catch(err => {
				setMessage('There seems to have been an error')
			})
			
		} else if(communityCreationPageTwo.complete === false) {
			let rules = []
			let links = []
			if(data.communityLink){
				data.communityLink.map((l, i) => {
					links.push({
						linkName: l,
						linkUrl: data.communityLinkUrl[i]
					})
				})				
			}
			if(data.communityRule){
				data.communityRule.map((r, i) => {
					rules.push({
						rule: r,
						definition: data.communityRuleDefinition[i]
					})
				})
			}
			let relatedCommunities = []
			if(communityWidgets.length > 0 ){
				communityWidgets.map((c, i) => {
					relatedCommunities.push(c.name)
				})
			}else {
				relatedCommunities.push('Announcements')
			}
			const pageTwo = {
				complete: true,
				aboutWidget: {
					active: data.aboutCommunityActive,
					header: data.aboutWidgetHeader !== '' ? data.aboutWidgetHeader : `About ${communityCreationPageOne.communityName}`,
					body: data.aboutWidgetBody !=='' ? data.aboutWidgetBody : `This is a community pertaining to ${communityCreationPageOne.communityName} and ${communityCreationPageOne.communityName} accessories` ,
				},
				communityListWidget: {
					active: data.communityListWidgetActive,
					communities: relatedCommunities,
					header: data.communityListWidgetHeader ? data.communityListWidgetHeader : 'Related Communities',
				},
				announcementWidget: {
					active: data.announcementWidgetActive,
					header: data.announcementWidgetHeader ? data.announcementWidgetHeader : 'Announcements' ,
					body: data.announcementWidgetBody,
				},
				rulesWidget: {
					active: data.communityRulesActive,
					header: data.communityRulesWidgetHeader !== '' ? data.communityRulesWidgetHeader : `${communityCreationPageOne.communityName} rules`,
					rules: rules
				},
				linkListWidget: {
					active: data.communityLinksActive,
					header: data.linkListWidgetHeader !== '' ? data.linkListWidgetHeader : `${communityCreationPageOne.communityName}'s favorite links`,
					links: links
				}
			}	
			setCommunityCreationPageTwo(pageTwo)
		} 			
	}

	const handleCommunityWidgets = (object) => {
		let communities = [...communityWidgets]
		communities.push(object)
		setCommunityWidgets(communities)
	}

	const handleModeratorInvites = (object) => {
		let moderators = [...moderatorArray]
		moderators.push(object)
		setModeratorArray(moderators)
	}

    function numberOfRules() {
    	return [...Array(parseInt(watchNumberOfRules || 0)).keys()];
	} 

    function numberOfLinks() {
    	return [...Array(parseInt(watchNumberOfLinks || 0)).keys()];
	} 

	const watchNumberOfRules = watch('numOfRules')
	const watchNumberOfLinks = watch('numOfLinks')

	const handleCommunityCreation = () => {
		if(!formSent){
			setFormSent(true)
			const accessToken = window.localStorage.getItem('accessToken')
			setLoading(true)
			fetch('https://jibjab.herokuapp.com/api/createCommunity', {
				method: 'post',
				headers: {
					authorization: `Bearer ${accessToken}`,
					'Content-Type' : 'application/json'
				},
				body: JSON.stringify({
					pageOne: communityCreationPageOne,
					pageTwo: communityCreationPageTwo,
					moderators: moderatorArray
				})
			})
			.then(response => response.json())
			.then(response => {
				if(response.success){
					setLoading(false)
					setFormSent(false)
					history.push(`/c/${communityCreationPageOne.communityName}`)	
				}

			})
			.catch(err => {
				setMessage('There seems to have been an error')
			})			
		}
	}


	return(
		<div className='createCommunity container' >
		{
			isLoading ?
			<Loading /> :
			null
		}
			{
				user.karma < 1 ?
				<p className='notEnoughKarmaMessage'> 
				You must have at least 100 karma to create a community.<br/> Get out there and start socializing! 
				</p> : 
				communityCreationPageOne.complete === false ?
				/*#################PAGE ONE##################*/
				<div className='communitySetUp'>
					<h3> Create a community</h3>
					<p className='createCommunityBlurb'> Communities are a great way to make friends! </p>
					<form onSubmit={handleSubmit(onSubmit)} 
					className={formSent ? 'formDeactivated ' : null}> 
						<label htmlFor="communityName">Community name: </label>
						{errors.communityName && errors.communityName.type === 'required' && <p className='formError'> Community name required </p>} 
						{errors.communityName && errors.communityName.type === 'maxLength' && <p className='formError'> Community name must not exceed 20 characters </p>} 
						{errors.communityName && errors.communityName.type === 'minLength' && <p className='formError'> Community name must exceed 2 characters</p>} 
						<input 
						onChange={(e) => setCommunityName(e.target.value)}
						placeholder='eg. Movies, Anime, Television'
						type="text"  
						name='communityName'
						ref={register({required: true, maxLength: 20, minLength: 2})} />
						<label htmlFor="communityHeader">A quick description of this community:  </label>
						{errors.communityHeader && errors.communityHeader.type ===  'maxLength' && <p className='formError'> Community header blurb must not exceed 100 characters </p>}
						<input 
						type="text" 
						onChange={(e) => setCommunityHeaderBlurb(e.target.value)}
						placeholder='eg. /c/Movies is a community to discuss films.' 
						name='communityHeader' 
						ref={register({required: false, maxLength: 100})} />
						<HeaderExample /> 
						<label htmlFor="image" >Community Image</label>
						<input 
						type="text" 
						name='image'
						onBlur={(e) => setImage(e.target.value)} 
						placeholder='eg. https://robohash.org/picture' 
						ref={register({required: false})}/>
						<label htmlFor="headerImg" >Community banner:</label>
						<input 
						onBlur={(e) => setHeaderImg(e.target.value)}
						type="text" 
						name='headerImg' 
						placeholder='eg. https://source.unsplash.com/random/800x1200'
						ref={register({required: false})}/>
						<div className='container communityVisibilitySettings'>
							<h5>
								Community visibility settings:
							</h5>
							{errors.communityVisibility && errors.communityVisibility.type === 'required' && <p className='formError'> Please select a visibility option for your community</p>}
							<div>
								<input type='radio' name='communityVisibility' value='public' ref={register({required: true})}/> 
								<label htmlFor="communityVisibility"> Public </label>
								<p> Your community will be free for anybody to view, and will appear in the global feeds </p>
							</div>
							<div>
								<input type='radio' name='communityVisibility' value='private' ref={register({required: true})}/> 
								<label htmlFor="communityVisibility"> Private </label>
								<p> Your community will not appear in global feeds, but can still be accessed and joined by users. </p>
							</div>
							<div>
								<input type='radio' name='communityVisibility' value='locked' ref={register({required: true})}/> 
								<label htmlFor="communityVisibility"> Locked </label>
								<p> Your community will be locked, meaning it will not appear in global feeds, and will be unavailable to non members. Cannot be joined unless approved by moderators. </p>
							</div>
						</div>
						<div className='container communityVisibilitySettings'>
							<h5>
								Post permission settings:
							</h5>
							{errors.postPermission && errors.postPermission.type === 'required' && <p className='formError'> Please select a permission seting for your community</p>}
							<div>
								<input type='radio' name='postPermission' value='open' ref={register({required: true})}/> 
								<label htmlFor="postPermission"> Open </label>
								<p> Anybody may make a post in this community </p>
							</div>
							<div>
								<input type='radio' name='postPermission' value='locked' ref={register({required: true})}/> 
								<label htmlFor="postPermission"> Locked </label>
								<p> Only moderators may post in this community</p>
							</div>
						</div>
						<div className='createCommunityNavBtnContainer container'>
							<button className='nextPage'> Next </button>
						</div>
					</form> 
				</div> :
				communityCreationPageTwo.complete === false ?
			/*######################PAGE TWO#################################*/
				<div className='widgetSelection'>
					<form
					onSubmit={handleSubmit(onSubmit)}
					className={formSent ? 'formDeactivated ' : null}>  
						<h3> Configure your communities widgets :</h3>
						<p className='createCommunityBlurb'> Widgets are a great way to consolidate information about the community in one place </p>
						{/*########ABOUT COMMUNITY WIDGET #############*/}
						<div>
							<h5> About community widget</h5>
							<label htmlFor="aboutCommunityActive">About community widget active: </label>
							<select name='aboutCommunityActive' ref={register({required: false})}>
								<option value="false">Inactive</option>
								<option value="true">Active</option>
							</select>
							<label htmlFor="aboutWidgetHeader">Announcement widget header: </label>
							<input type='text' name='aboutWidgetHeader' placeholder={`About ${communityCreationPageOne.communityName}`} ref={register({required: false})} />
							<label htmlFor="aboutWidgetBody">Announcement body: </label>
							<input type='text' name='aboutWidgetBody' placeholder={`${communityCreationPageOne.communityName} is a community dedicated to...`} ref={register({required: false})} />
						</div>	
					{/*##########COMMUNITY LIST WIDGET FORM##############*/}
						<div>
							<h5> Community list widget</h5>
							<label htmlFor="communityListWidgetActive"> Community list widget active: </label>
							<select name='communityListWidgetActive' ref={register({required: false})}>
								<option value="false">Inactive</option>
								<option value="true">Active</option>
							</select>
							<label htmlFor="communityListWidgetHeader">Community links header: </label>
							<input type="text" name='communityListWidgetHeader' placeholder='eg. Related communities' ref={register({required: false})}/>
							{
								communityWidgets.map((c, i) =>{
									return (
									<div className='container targetWidgetCommunity'>
										<img src={c.image} alt="" />
										{c.name}
									</div>
									)
								})
							}
							<SearchBar user={user}  searchBarType='submitPost' setTargetCommunity={handleCommunityWidgets}/>
						</div>
					{/*##############ANNOUNCMENT WIDGET FORM #######################*/}
						<div>
							<h5> Announcment widget</h5>
							<label htmlFor="announcementWidgetActive"> Announcement widget active: </label>
							<select name='announcementWidgetActive' ref={register({required: false})}>
								<option value="false">Inactive</option>
								<option value="true">Active</option>
							</select>
							<label htmlFor="announcementWidgetHeader">Announcement widget header: </label>
							<input type='text' name='announcementWidgetHeader' placeholder={`Whats new in ${communityCreationPageOne.communityName}?`} ref={register({required: false})} />
							<label htmlFor="announcementWidgetBody">Announcement body: </label>
							<input type='text' name='announcementWidgetBody' placeholder={`${communityCreationPageOne.communityName} is now live!`} ref={register({required: false})} />
						</div>					
					{/*##########COMMUNITY RULES FORM#############*/}
						<div>
							<h5> Community rules widget</h5>
							<label htmlFor="communityRulesActive"> Community rules widget active: </label>
							<select name='communityRulesActive' ref={register({required: false})}>
								<option value="false">Inactive</option>
								<option value="true">Active</option>
							</select>
							<label htmlFor="communityRulesWidgetHeader">Community rules header: </label>
							<input type='text' name='communityRulesWidgetHeader' placeholder={`eg. ${communityCreationPageOne.communityName} rules`} ref={register({required: false})} />
							<label htmlFor="numOfRules">How many rules? </label>
							<select name='numOfRules' ref={register}>
							{
								[0,1,2,3,4,5,6,7,8,9,10].map(i => {
								return <option key={i} value={i}> {i} </option>
								})
							}
							</select>
							{
								numberOfRules().map(i => (
									<div>
										<label htmlFor={`communityRule[${i}]`}> Rule {i + 1}: </label>
										<input type="text" name={`communityRule[${i}]`} placeholder='eg. No Doxxing, no racism, no hateful shit' ref={register({required: true})}/>
										<label htmlFor={`communityRuleDefinition[${i}]`}>Rule definition</label>
										<input type="text" name={`communityRuleDefinition[${i}]`} placeholder='Reiterate on the nuances of said rule' ref={register({required: true})}/>
									 </div>
								))
							}
						</div>
						{/*#########LINK WIDGET FORM############*/}
						<div>
							<h5> Community links widget</h5>
							<label htmlFor="communityLinksActive"> Community links widget active: </label>
							<select name='communityLinksActive' ref={register({required: false})}>
								<option value="false">Inactive</option>
								<option value="true">Active</option>
							</select>
							<label htmlFor="linkListWidgetHeader">Community Links header: </label>
							<input type='text' name='linkListWidgetHeader' placeholder={`eg. Links pertaining to ${communityCreationPageOne.communityName}`} ref={register} />
							<label htmlFor="numOfLinks">How many links? </label>
							<select name='numOfLinks' ref={register}>
							{
								[0,1,2,3,4,5,6,7,8,9,10].map(i => {
								return <option key={i} value={i}> {i} </option>
								})
							}
							</select>
							{
								numberOfLinks().map(i => (
									<div>
										<label htmlFor={`communityLinkUrl[${i}]`}>Link Url {i + 1}</label>
										<input type="text" name={`communityLinkUrl[${i}]`} placeholder='eg. https://google.ca' ref={register({required: true})}/>
										<label htmlFor={`communityLink[${i}]`}> Link Descriptor : </label>
										<input type="text" name={`communityLink[${i}]`} placeholder='A search engine' ref={register({required: true})}/>
									 </div>
								))
							}
						</div>
						<div className='createCommunityNavBtnContainer container'>
							<button onClick={() => setCommunityCreationPageOne(initialPageOne)} className='lastPage'> Back </button> 
							<button onSubmit={handleSubmit(onSubmit)} className='nextPage'> Next </button>
						</div> 
					</form>
				</div>	:
			/*###################PAGE THREE########################*/
				<div className='moderatorSelection'>
					<h3> Add some moderators</h3>
					<p className='addModeratorBlurb'> Selected users will be invited to moderate your community alongside yourself.  </p>
					<SearchBar user={user}  searchBarType='submitMessage' setTargetCommunity={handleModeratorInvites}/>
					{
						moderatorArray.map((m, i) => {
							return(
							<div className='container targetUser'>
								<img src={m.image} alt="" />
								{m.name}
								<span
									onClick={() => {
										let moderators = [...moderatorArray]
										moderators.map((c, j) => {
											if(c.name === m.name){
												moderators.splice(j, 1)
											}
										})
										setModeratorArray(moderators)
									}} 
									style={{marginLeft: 'auto', fontWeight: '700', pointer: 'cursor'}}> X </span>
							</div>
							)
						})
					}
					<div className='createCommunityNavBtnContainer container'>
						<button onClick={() => setCommunityCreationPageOne(initialPageTwo)} className='lastPage'> Back </button> 
						<button onClick={() => handleCommunityCreation()} className='nextPage'> Finish </button>
					</div> 
				</div>

			}
		</div>
	)
}

export default CreateCommunity