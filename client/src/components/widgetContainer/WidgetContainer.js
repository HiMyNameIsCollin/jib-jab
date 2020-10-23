import React, {useState} from 'react'
import './_widgetContainer.sass'
const WidgetContainer = ({pageType, Link}) => {


const CommunityListWidget = () => {
	return(
		<React.Fragment>
			<div className='communityListWidget'>
				<h4>Communities</h4>
				<ul>
					{
						pageType === 'communityPage' ?
						<li className='communityListWidgetItem'>
							<Link to='/community' className='link' >
								<img src="https://robohash.org/4" alt=""/>
								<span> Community name </span>
							</Link>
						</li>:
						<React.Fragment>
							<li className='communityListWidgetItem'>
								<Link to='/' className='link' >
									<img src="https://robohash.org/4" alt=""/>
									<span> Your Feed </span>
								</Link>
							</li>	
							<li className='communityListWidgetItem'>
								<Link to='/global' className='link' >
									<img src="https://robohash.org/4" alt=""/>
									<span> Global </span>
								</Link>
							</li>
							<li className='communityListWidgetItem'>
								<Link to='/community' className='link' >
									<img src="https://robohash.org/4" alt=""/>
									<span> Community name </span>
								</Link>
							</li>					
						</React.Fragment>
					}
				</ul>
				<a className='widgetButton' href=""> View more </a>
			</div>
		</React.Fragment>
		)
	}

const TopPostListWidget = () => {

	const TopPostListWidgetItem = () => {
		return(
			<li className='topPostListWidgetItem'>
				<span> Post title </span> <span>0 Comments</span> <span> 0 upvotes </span>
			</li>
		)
	}

	return(
		<div className='topPostListWidget'>
			<h4> Most viewed posts in 24 hours </h4>
			<ul>	
				<TopPostListWidgetItem />
			</ul>
				<a className='widgetButton' href=""> View more </a>
		</div>	
	)
}


const RulesListWidget = () => {

	const RulesListWidgetItem = () => {

		const [ruleIsOpen, setRuleOpen] = useState(false)

		return(
			<React.Fragment>
				<li onClick ={() => setRuleOpen(!ruleIsOpen)}>
					<span>1.</span> <span> Rules synopsis blah blah blah blah blah blah</span>  <i class="fas fa-caret-down"></i>
				</li>
				{
					ruleIsOpen === true ?
					<div>
						<p> Rules to be enforced blah blah blah </p>
					</div> :
					null
				}
			</React.Fragment>
		)
	}

	return(
		<div className='rulesListWidget'>
			<h4>Community Rules </h4>
			<ul> 
				<RulesListWidgetItem />
				<RulesListWidgetItem />
			</ul>
		</div> 
	)
}

const LinkListWidget = () => {
	/*NTS: LIMIT THE CHARACTERS ALLOWED IN LINKS*/
	return(
		<div className='linkListWidget'>
			<h4>Links</h4> 
			<ul>
				<li>
					<a className='widgetButton' href="" target='_blank'> Link to somewhere</a>
				</li>
				<li>
					<a className='widgetButton' href="" target='_blank'> Link to somewhere</a>
				</li>
			</ul>

		</div>
	)
}

const ModeratorListWidget = () => {
	return(
		<div className='moderatorListWidget'>
			<h4> Community Moderators </h4>
			<a className='widgetButton' href=""> <i class="fas fa-inbox"></i><span>Message the mods</span> </a>
			<ul>
				<li>
					<a href="">/u/Collin</a> <span>Flair </span>
				</li>
				<li>
					<a href="">/u/Collin</a> <span>Flair </span>
				</li>
			</ul>
			<div className='container'>
				<a href=""> View all moderators </a>
			</div>
		</div>
	)
}

const AboutCommunityWidget = () => {
	return(
		<div className='aboutCommunityWidget'>
			<h4>About the community</h4>
			<p> This is where we talk about the community, blah blah blah</p>
			<div className='container'>
				<div className='container'>
					<p> 0 </p>
					<p> Subscribers </p>
				</div>
				<div className='container'>
					<p> 0 </p>
					<p> Online </p>
				</div>
			</div>
			<p><i class="fas fa-pepper-hot"></i>Created: November 5 2020 </p>
		</div>
	)
}

const AppendixWidget = () => {
	return(
		<div className='appendixWidget'>
			<a href=""> About </a>
			<a href=""> Hire me </a>
		</div>
	)
}

const InteractionWidget = () => {
	return(
		<div className='interactionWidget'>
			<h4>
				Interact
			</h4>
			<div className='interactionWidgetButtons'>
				<div>
					Follow
				</div>
				<div>
					Message
				</div>
			</div>
			<div className='interactionWidgetScore container'>
				<div >
					<p> 0 </p>
					<p> Karma </p>
				</div>
				<div >
					<p> 0 </p>
					<p> Followers </p>
				</div>
				<div>
					<p> User since: </p>
					<p> Nov 5th, 2020</p>
				</div>
			</div>
		</div>
	)
}

const AnnouncementWithLinkWidget = () => {
	return(
		<div className='announcementWithLinkWidget'>
			<h4> Announcment here </h4>
			<p> Community announcement with a link goes here in this box </p>
			<div className="widgetButton"> Link goes here </div>
		</div>
	)
}


/*###########################TYPE OF MENU#######################################*/

const FrontPageWidgets = () => {
	return(
		<React.Fragment>
			<CommunityListWidget />
			<TopPostListWidget />
			<AppendixWidget />				
		</React.Fragment>
	)
}

const GlobalPageWidgets = () => {
	return(
		<React.Fragment>
			<CommunityListWidget />
			<TopPostListWidget />
			<AppendixWidget />	
		</React.Fragment> 
	)
}

const CommunityWidgets = () => {
	return(
		<React.Fragment>
			<AboutCommunityWidget />
			<CommunityListWidget />
			<AnnouncementWithLinkWidget />
			<TopPostListWidget />
			<RulesListWidget />
			<LinkListWidget />
			<ModeratorListWidget /> 
			<AppendixWidget />	
		</React.Fragment>
	)
}

const ProfileWidgets = () => {
	return(
		<React.Fragment>
			<InteractionWidget />
			<AppendixWidget />	
		</React.Fragment>
	)
}

const PostPageWidgets = () => {
	return(
		<React.Fragment>
			<AboutCommunityWidget />
			<CommunityListWidget />
			<AnnouncementWithLinkWidget />
			<RulesListWidget />
			<LinkListWidget />
			<ModeratorListWidget /> 
			<AppendixWidget /> 
		</React.Fragment>
	)
}


	return(
		<div className={pageType === 'globalPage' || pageType === 'postPage' ? 'widgetContainerGlobalPage container widgetContainer' : 'container widgetContainer'}>
			<div className={pageType === 'frontPage' ? 'widgetSizingContainerFrontPage widgetSizingContainer' : 'widgetSizingContainer'}>
			{
				pageType === 'frontPage' ?
				<FrontPageWidgets  /> :
				pageType === 'profilePage' ?
				<ProfileWidgets /> :
				pageType === 'communityPage' ?
				<CommunityWidgets /> : 
				pageType === 'globalPage' ?
				<GlobalPageWidgets /> :
				pageType === 'postPage' ?
				<PostPageWidgets /> :
				null
			}
			</div>
		</div>
	)
}

export default WidgetContainer

