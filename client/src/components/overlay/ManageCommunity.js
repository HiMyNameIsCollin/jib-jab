import React, { useState, useEffect } from 'react'
import SearchBar from '../../components/searchBar/SearchBar'
import { useForm } from 'react-hook-form'


const ManageCommunity = ({setOverlay, user, location, setMessage, history, Link, setLoading }) => {

	const [image, setImage] = useState('')
	const [headerImg, setHeaderImg] = useState('https://source.unsplash.com/random/800x1200')
	const [community, setCommunity] = useState(undefined)
	const [reportedPosts, setReportedPosts] = useState(undefined)
	const [managePage, setManagePage] = useState('banner')
	const [communityWidgets, setCommunityWidgets] = useState([])
	const [ruleHandler, setRuleHandler] = useState(undefined)
	const [linkHandler, setLinkHandler] = useState(undefined)
	const [formSent, setFormSent] = useState(false)
	const { register, handleSubmit, errors, watch} = useForm()


	useEffect(() => {
		fetch(`http://jibjab.herokuapp.com/api/manageCommunity/${location.pathname.substr(3, location.pathname.length - 3)}`)
		.then(response => response.json())
		.then(response => {
				setHeaderImg(response.community.configuration.headerImg)
				setRuleHandler(response.community.configuration.widgets.rulesWidget.rules.length)
				setLinkHandler(response.community.configuration.widgets.linkListWidget.links.length)
				setCommunity(response.community)
				setCommunityWidgets(response.community.communities)
				setReportedPosts(response.reportedPosts)
		})
		.catch(err => {
			setMessage('There has been an error')
		})	
	},[])


	const HeaderExample = () => {
	return(
		<div className='communityHeader createCommunityPreview' style={{backgroundImage: `url(${headerImg}})` }}> 
			<div className='container'>
				<img src={image !== '' ? image : community.configuration.image}  alt="Your community avatar goes here"/>
			</div>
			<div className=' container'>
				<p> {location.pathname.substr(3, location.pathname.length - 3)} </p>
				<p> {community.configuration.communityHeader} </p>
			</div>
		</div>
		)
	}

	const ReportedPost = ({p}) => {

		const [reportsAreOpen, setReportsAreOpen] = useState(false)
		return(
			<div className='report'>
				<h3 onClick={() => {
					history.push(`/c/${p.communityNameLower}/${p.id}`)
					setOverlay(undefined)
				}}> {p.title} </h3>
				{
					p.text !== '' ?
					<p> {p.text} </p> :
					null
				}
				<p> {p.reports.length} reports </p>
				<button onClick={() => setReportsAreOpen(!reportsAreOpen)}> View reports </button>
				{
					reportsAreOpen ?
					p.reports.map((r, i) => {
						return(
							<div
							key={i} 
							style={{margin: '.5em 0', border: 'solid black 1px', borderLeft: '0', borderRight: '0',  padding: '1em 0'}}>
								<h5> {r.category} </h5>
								<p> {r.reason} </p>
								<p> Reported by: {r.reportedBy} </p>
							</div>
						)
					}) :
					null
				}
				{
					p.postStatus === 'active' ?
					<button onClick={() =>{
						const accessToken = window.localStorage.getItem('accessToken')
						fetch('http://jibjab.herokuapp.com/api/mod/deletePost', {
							method: 'post',
							headers: {
								'Content-Type' : 'application/json',
								authorization: `Bearer ${accessToken}`
							},
							body: JSON.stringify({
								post: p
							})
						})
						.then(response => response.json())
						.then(response => {
							let updatedReportedPosts = [...reportedPosts]
							updatedReportedPosts.map((u, j) => {
									if(u.id === response.id){
										updatedReportedPosts[j] = response
									}
								})
								setReportedPosts(updatedReportedPosts)
							})
							
						.catch(err => {
							setMessage('There seems to have been an error')
						})
					}}> Delete post </button> :
					<h5> Post has been removed </h5>									
				}

			</div>
		)
	}

	const onSubmit = (payload) => {
		if(formSent === false){
			setFormSent(true)
			let data 
			if(managePage === 'banner'){
				data = {image: payload.image, headerImg: payload.headerImg, postPermission: payload.postPermission, visibility: payload.communityVisibility}
			}
			if(managePage === 'widgets'){
				const {aboutWidget, communityListWidget, announcementWidget, rulesWidget, linkListWidget } = community.configuration.widgets
				let rules = []
				payload.communityRule.map((r, i) => {
					rules.push({
						rule: r !== '' ? r : rulesWidget.rules[i].rule , 
						definition: payload.communityRuleDefinition[i] !== '' ? payload.communityRuleDefinition[i] : rulesWidget.rules[i].definition
					})
				})
				let links = []
				payload.communityLink.map((l, i) => {
					links.push({
						name: l !== '' ? l : linkListWidget.links[i].name,
						link: payload.communityLinkUrl[i] !== '' ? payload.communityLinkUrl[i] : linkListWidget.links[i].link
					})
				})
				data = {
					aboutWidgetActive: payload.aboutCommunityActive ,
					aboutWidgetHeader: payload.aboutWidgetHeader !=='' ? payload.aboutWidgetHeader : aboutWidget.header,
					aboutWidgetBody: payload.aboutWidgetBody !== '' ? payload.aboutWidgetBody : aboutWidget.body,
					communityListWidgetActive: payload.communityListWidgetActive,
					communityListWidgetHeader: payload.communityListWidgetHeader !== '' ? payload.communityListWidgetHeader : communityListWidget.header,
					communityListWidgetCommunities: communityWidgets,
					announcementWidgetActive: payload.announcementWidgetActive,
					announcementWidgetHeader: payload.announcementWidgetHeader !== '' ? payload.announcementWidgetHeader : announcementWidget.header,
					announcementWidgetBody: payload.announcementWidgetBody !== '' ? payload.announcementWidgetBody : announcementWidget.body,
					communityRulesWidgetActive: payload.communityRulesActive,
					communityRulesWidgetHeader: payload.communityRulesWidgetHeader !== '' ? payload.communityRulesWidgetHeader : rulesWidget.header,
					communityRulesWidgetRules: rules,
					linkListWidgetActive: payload.linkListWidgetActive,
					linkListWidgetHeader: payload.linkListWidgetHeader !== '' ? payload.linkListWidgetHeader : linkListWidget.header,
					linkListWidgetLinks: links
				}

				
			} else if (managePage === 'moderation'){

			}
			setLoading(true)
			const accessToken = window.localStorage.getItem('accessToken')
			fetch(`http://jibjab.herokuapp.com/api/manageCommunity/${community.communityNameLower}`, {
				method: 'post',
				headers: {
				'Content-Type' : 'application/json',
				authorization: `Bearer ${accessToken}`
				},
				body: JSON.stringify({
					data,
					request: managePage,
				})
			})
			.then(response => response.json())
			.then(response =>{
				if(response.success){
					setOverlay(undefined)
					history.push('/')
					history.goBack()
					setLoading(false)
				} else{
					setMessage('There has been an error')
					setFormSent(false)
					setLoading(false)
				}
			})
			.catch(err => {
				setMessage('There has been an error')
				setFormSent(false)
				setLoading(false)
			})
		}
	}

	const handleCommunityWidgets = (object) => {
		let communities = [...communityWidgets]
		communities.push(object.name)
		setCommunityWidgets(communities)
	}

    function numberOfRules() {
    	return [...Array(parseInt(watchNumberOfRules || 0)).keys()];
	} 

    function numberOfLinks() {
    	return [...Array(parseInt(watchNumberOfLinks || 0)).keys()];
	} 

	const watchNumberOfRules = watch('numOfRules')
	const watchNumberOfLinks = watch('numOfLinks')

	return(
		<div className='manageCommunity'>
			<h3>Manage Community:</h3>
			<span 
			className='closeOverlay'
			onClick={() => setOverlay(undefined)}> X </span>
			<div className='container postSelectionMenu'>
				<span 
					className={ managePage === 'banner' ? 'postSelectionSelected' : null }
					onClick={() => setManagePage('banner')}>
					Banner
				</span>
				<span 	
					className={ managePage === 'widgets' ? 'postSelectionSelected' : null }
					onClick={() => setManagePage('widgets')}>
					Widgets
				</span>
				<span
					className={ managePage === 'moderation' ? 'postSelectionSelected' : null }
					onClick={() => setManagePage('moderation')}>
					Moderation
				</span>
			</div>
			{
				community !== undefined ?
				managePage === 'banner' ?
				<form 
				className={formSent ? 'formDeactivated' : null}
				onSubmit={handleSubmit(onSubmit)}>
					<HeaderExample /> 
					<label htmlFor="image" >Community avatar</label>
					<input 
					type="text" 
					name='image'
					onBlur={(e) => setImage(e.target.value)} 
					placeholder='eg. http://robohash.org/picture' 
					ref={register({required: false})}/>
					<label htmlFor="headerImg" >Community banner:</label>
					<input 
					onBlur={(e) => setHeaderImg(e.target.value)}
					type="text" 
					name='headerImg' 
					placeholder='eg. https://source.unsplash.com/random/800x1200'
					ref={register({required: false})}/>
					<div className='container communityRadioOptions'>
						<h5>
							Community visibility settings:
						</h5>
						{errors.communityVisibility && errors.communityVisibility.type === 'required' && <p className='formError'> Please select a visibility option for your community</p>}
						<div>
						{
							community.configuration.visibility === 'public' ?
							<input type='radio' name='communityVisibility' value='public' checked ref={register({required: true})}/> :
							<input type='radio' name='communityVisibility' value='public' ref={register({required: true})}/> 
						}
							<label htmlFor="communityVisibility"> Public </label>
							<p> Your community will be free for anybody to view, and will appear in the global feeds </p>
						</div>
						<div>
						{
							community.configuration.visibility === 'private' ?
							<input type='radio' name='communityVisibility' value='private' selected ref={register({required: true})}/> :
							<input type='radio' name='communityVisibility' value='private' ref={register({required: true})}/> 
						}
							
							<label htmlFor="communityVisibility"> Private </label>
							<p> Your community will not appear in global feeds, but can still be accessed and joined by users. </p>
						</div>
						<div>
						{
							community.configuration.visibility === 'locked' ?
							<input type='radio' name='communityVisibility' value='locked' selected ref={register({required: true})}/> :
							<input type='radio' name='communityVisibility' value='locked' ref={register({required: true})}/> 
						}
							<label htmlFor="communityVisibility"> Locked </label>
							<p> Your community will be locked, meaning it will not appear in global feeds, and will be unavailable to non members. Cannot be joined unless approved by moderators. </p>
						</div>
					</div>
					<div className='container communityRadioOptions'>
						<h5>
							Post permission settings:
						</h5>
						{errors.postPermission && errors.postPermission.type === 'required' && <p className='formError'> Please select a permission seting for your community</p>}
						<div>
						{
							community.configuration.postPermission === 'open' ?
							<input type='radio' name='postPermission' value='open' selected ref={register({required: true})}/> :
							<input type='radio' name='postPermission' value='open' ref={register({required: true})}/>
						} 
							<label htmlFor="postPermission"> Open </label>
							<p> Anybody may make a post in this community </p>
						</div>
						<div>
						{
							community.configuration.postPermission === 'locked' ?
							<input type='radio' name='postPermission' value='locked' selected ref={register({required: true})}/> :
							<input type='radio' name='postPermission' value='locked' ref={register({required: true})}/> 
						}
							<label htmlFor="postPermission"> Locked </label>
							<p> Only moderators may post in this community</p>
						</div>
					</div>
					<button> Submit </button> 
				</form>	:
				managePage === 'widgets' ?
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
							{
								community.configuration.widgets.aboutWidget.active === 'true' ?
								<option selected value={true}>Active</option> :
								<option value="true">Active</option>
							}
							{
								community.configuration.widgets.aboutWidget.active === 'false' ?
								<option selected value={false}>Inactive</option> : 
								<option value="false">Inactive</option>
							}
							</select>
							<label htmlFor="aboutWidgetHeader">Announcement widget header: </label>
							<input type='text' name='aboutWidgetHeader' placeholder={community.configuration.widgets.aboutWidget.header} ref={register({required: false})} />
							<label htmlFor="aboutWidgetBody">Announcement body: </label>
							<input type='text' name='aboutWidgetBody' placeholder={community.configuration.widgets.aboutWidget.body} ref={register({required: false})} />
						</div>	
					{/*##########COMMUNITY LIST WIDGET FORM##############*/}
						<div>
							<h5> Community list widget</h5>
							<label htmlFor="communityListWidgetActive"> Community list widget active: </label>
							<select name='communityListWidgetActive' ref={register({required: false})}>
							{
								community.configuration.widgets.communityListWidget.active === 'true' ?
								<option selected value={true} >Active</option> :
								<option value="true">Active</option>
							}
							{
								community.configuration.widgets.communityListWidget.active === 'false' ?
								<option selected value={false}>Inactive</option> : 
								<option value="false">Inactive</option>
							}
							</select>
							<label htmlFor="communityListWidgetHeader">Community links header: </label>
							<input type="text" name='communityListWidgetHeader' placeholder={community.configuration.widgets.communityListWidget.header} ref={register({required: false})}/>
							{
								communityWidgets.map((c, i) =>{
									return (
									<div className='container targetWidgetCommunity' style={{padding: '1em'}}>
										{c}
										<span
											style={{margin: 'auto .5em auto auto', fontWeight: '700'}} 
											onClick={()=>{
											let commWidgets = [...communityWidgets]
											commWidgets.splice(i, 1)
											setCommunityWidgets(commWidgets)
										}}> X </span>
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
							{
								community.configuration.widgets.announcementWidget.active === 'true' ?
								<option selected value={true}>Active</option> :
								<option value="true">Active</option>
							}
							{
								community.configuration.widgets.announcementWidget.active === 'false' ?
								<option selected value={false}>Inactive</option> : 
								<option value="false">Inactive</option>
							}
							</select>
							<label htmlFor="announcementWidgetHeader">Announcement widget header: </label>
							<input type='text' name='announcementWidgetHeader' placeholder={community.configuration.widgets.announcementWidget.header} ref={register({required: false})} />
							<label htmlFor="announcementWidgetBody">Announcement body: </label>
							<input type='text' name='announcementWidgetBody' placeholder={community.configuration.widgets.announcementWidget.body} ref={register({required: false})} />
						</div>					
					{/*##########COMMUNITY RULES FORM#############*/}
						<div>
							<h5> Community rules widget</h5>
							<label htmlFor="communityRulesActive"> Community rules widget active: </label>
							<select name='communityRulesActive' ref={register({required: false})}>
							{
								community.configuration.widgets.rulesWidget.active === 'true' ?
								<option selected value={true}>Active</option> :
								<option value="true">Active</option>
							}
							{
								community.configuration.widgets.rulesWidget.active === 'false' ?
								<option selected value={false}>Inactive</option> : 
								<option value="false">Inactive</option>
							}
								
							</select>
							<label htmlFor="communityRulesWidgetHeader">Community rules header: </label>
							<input type='text' name='communityRulesWidgetHeader' placeholder={community.configuration.widgets.rulesWidget.header} ref={register({required: false})} />
							<label htmlFor="numOfRules">How many rules? </label>
							<select name='numOfRules' ref={register} defaultValue={ruleHandler} onChange={(e) => setRuleHandler(e.target.value)}>
							{
								[0,1,2,3,4,5,6,7,8,9,10].map(i => {
								return <option key={i} value={i}> {i} </option>
								})
							}
							</select>
							{
								numberOfRules().map(i => (
									<div key={i}>
										<label htmlFor={`communityRule[${i}]`}> Rule {i + 1}: </label>
										<input 
										type="text" 
										name={`communityRule[${i}]`} 
										placeholder={community.configuration.widgets.rulesWidget.rules[i] ? community.configuration.widgets.rulesWidget.rules[i].header : null} 
										ref={register({required: false})}/>
										<label htmlFor={`communityRuleDefinition[${i}]`}>Rule definition</label>
										<input 
										type="text" 
										name={`communityRuleDefinition[${i}]`} 
										placeholder={community.configuration.widgets.rulesWidget.rules[i] ? community.configuration.widgets.rulesWidget.rules[i].body : null} 
										ref={register({required: false})}/>
									 </div>
								))
							}
						</div>
						{/*#########LINK WIDGET FORM############*/}
						<div>
							<h5> Community links widget</h5>
							<label htmlFor="communityLinksActive"> Community links widget active: </label>
							<select name='linkListWidgetActive' ref={register({required: false})}>
							{
								community.configuration.widgets.linkListWidget.active === 'true' ?
								<option selected value={true}>Active</option> :
								<option value="true">Active</option>
							}
							{
								community.configuration.widgets.linkListWidget.active === 'false' ?
								<option selected value={false}>Inactive</option> : 
								<option value="false">Inactive</option>
							}
							</select>
							<label htmlFor="linkListWidgetHeader">Community Links header: </label>
							<input type='text' name='linkListWidgetHeader' placeholder={`eg. Links pertaining to ${community.communityName}`} ref={register} />
							<label htmlFor="numOfLinks">How many links? </label>
							<select name='numOfLinks' ref={register} defaultValue={linkHandler}>
							{
								[0,1,2,3,4,5,6,7,8,9,10].map(i => {
								return <option key={i} value={i}> {i} </option>
								})
							}
							</select>
							{
								numberOfLinks().map(i => (
									<div key={i}>
										<label htmlFor={`communityLinkUrl[${i}]`}>Link {i + 1}:</label>
										<input 
										type="text" 
										name={`communityLinkUrl[${i}]`} 
										placeholder={community.configuration.widgets.linkListWidget.links[i] ? community.configuration.widgets.linkListWidget.links[i].link : null} 
										ref={register({required: false})}/>
										<label htmlFor={`communityLink[${i}]`}> Link Descriptor: </label>
										<input 
										type="text" 
										name={`communityLink[${i}]`} 
										placeholder={community.configuration.widgets.linkListWidget.links[i] ? community.configuration.widgets.linkListWidget.links[i].name : null} 
										ref={register({required: false})}/>
									 </div>
								))
							}
						</div>
						<div className='createCommunityNavBtnContainer container'>
							<button onSubmit={handleSubmit(onSubmit)} className='nextPage'> Submit </button>
						</div> 
					</form>
				</div>	 :
				managePage === 'moderation' ?
				<div>
					<h3> Community reports </h3>
				{
					reportedPosts.map((p, i) => {
						return(
							<ReportedPost p={p} key={i}/>
						)
					})
				}
				</div> :
				null : null	
			}

		</div>
	)
}

export default ManageCommunity