import React, {useState} from 'react'
import './_desktopWidgetContainer.sass'

const CommunityListWidget = () => {

	const CommunityListWidgetItem = () => {
		return(
			<li className='communityListWidgetItem'>
				<img src="https://robohash.org/4" alt=""/>
				<span> Community name </span>
			</li>	
		)
	}

	return(
		<React.Fragment>
			<div id='communityListWidget'>
				<h3>Communities</h3>
				<ul>
					<CommunityListWidgetItem />
					<CommunityListWidgetItem />
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
		<div id='topPostListWidget'>
			<h3> Most viewed posts in 24 hours </h3>
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
		<div id='rulesListWidget'>
			<h3>Community Rules </h3>
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
		<div id='linkListWidget'>
			<h3>Links</h3> 
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
		<div id='moderatorListWidget'>
			<h3> Community Moderators </h3>
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
		<div id='aboutCommunityWidget'>
			<h3>About the community</h3>
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
		<div id='appendixWidget'>
			<a href=""> About </a>
			<a href=""> Hire me </a>
		</div>
	)
}
/*###########################TYPE OF MENU#######################################*/
/*##########################HOMEPAGE MENU##################################*/

const WidgetSizingContainer = () => {
	return(
		<div id='widgetSizingContainer'>
			<AboutCommunityWidget />
			<CommunityListWidget />
			<TopPostListWidget />
			<RulesListWidget />
			<LinkListWidget />
			<ModeratorListWidget /> 
			<AppendixWidget />
		</div>
	)
}



const DesktopWidgetContainer = () => {
	return(
		<div id='desktopWidgetContainer' className='container'>
			<WidgetSizingContainer />
		</div>
	)
}

export default DesktopWidgetContainer

