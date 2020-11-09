import React, {useState, useEffect} from 'react'
import CommunityListWidget from './widgets/CommunityListWidget'
import TopPostListWidget from './widgets/TopPostListWidget'
import RulesListWidget from './widgets/RulesListWidget'
import LinkListWidget from './widgets/LinkListWidget'
import ModeratorListWidget from './widgets/ModeratorListWidget'
import AboutCommunityWidget from './widgets/AboutCommunityWidget'
import AppendixWidget from './widgets/AppendixWidget'
import InteractionWidget from './widgets/InteractionWidget'
import AnnouncementWithLinkWidget from './widgets/AnnouncementWithLinkWidget'
import './_widgetContainer.sass'
const WidgetContainer = ({pageType, Link, community}) => {


/*###########################TYPE OF MENU#######################################*/

const FrontPageWidgets = () => {
	return(
		<React.Fragment>
			<CommunityListWidget Link={Link} community={community} pageType={pageType} />
			<TopPostListWidget />
			<AppendixWidget Link={Link}/>				
		</React.Fragment>
	)
}

const GlobalPageWidgets = () => {
	return(
		<React.Fragment>
			<CommunityListWidget Link={Link} community={community} pageType={pageType}  />
			<TopPostListWidget />
			<AppendixWidget />	
		</React.Fragment> 
	)
}

const CommunityWidgets = () => {
	return(
		<React.Fragment>
		{
			community.configuration.widgets.aboutWidget.active ? 
			<AboutCommunityWidget community={community}/> :
			null
		}
		{
			community.configuration.widgets.communityListWidget.active ? 
			<CommunityListWidget Link={Link} community={community} pageType={pageType} /> :
			null
		}
		{
			community.configuration.widgets.announcementWidget.active ?
			<AnnouncementWithLinkWidget Link={Link} /> :
			null			
		}
		{
			community.configuration.widgets.rulesWidget.active ?
			<RulesListWidget /> :
			null
		}
		{
			community.configuration.widgets.linkListWidget.active ?
			<LinkListWidget /> :
			null
		}
			<TopPostListWidget />
			<ModeratorListWidget /> 
			<AppendixWidget Link={Link}/>	
		</React.Fragment>
	)
}

const ProfileWidgets = () => {
	return(
		<React.Fragment>
			<InteractionWidget />
			<AppendixWidget Link={Link}/>	
		</React.Fragment>
	)
}

const PostPageWidgets = () => {
	return(
		<React.Fragment>
			<AboutCommunityWidget community={community}/>
			<CommunityListWidget Link={Link} community={community} pageType={pageType} />
			<AnnouncementWithLinkWidget />
			<RulesListWidget />
			<LinkListWidget />
			<ModeratorListWidget /> 
			<AppendixWidget Link={Link}/> 
		</React.Fragment>
	)
}


	return(
		<div className={ community ? community.communityNameLower === 'global'|| pageType === 'postPage' ? 'widgetContainerGlobalPage container widgetContainer' : 'container widgetContainer' : 'container widgetContainer'}>
			<div className={community ? community.communityNameLower === 'frontpage' ? 'widgetSizingContainerFrontPage widgetSizingContainer' : 'widgetSizingContainer' : 'widgetSizingContainer'}>
			{
				pageType === 'frontPage' ?
				<FrontPageWidgets  /> :
				pageType === 'profilePage' ?
				<ProfileWidgets /> :
				pageType === 'communityPage' ?
				<CommunityWidgets community={community}/> : 
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

