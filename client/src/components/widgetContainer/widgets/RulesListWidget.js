import React, { useState } from 'react'

const RulesListWidget = ({widgetContent}) => {

	const RulesListWidgetItem = ({rule}) => {

		const [ruleIsOpen, setRuleOpen] = useState(false)

		return(
			<React.Fragment>
				<li onClick ={() => setRuleOpen(!ruleIsOpen)}>
					<span>1.</span> <span> {rule.rule} </span>  <i className="fas fa-caret-down"></i>
				</li>
				{
					ruleIsOpen === true ?
					<div>
						<p> {rule.definition} </p>
					</div> :
					null
				}
			</React.Fragment>
		)
	}

	return(
		<div className='rulesListWidget'>
			<h4>{widgetContent.header} </h4>
			<ul> 
				{
					widgetContent.rules.map((r, i) => {
						return <RulesListWidgetItem rule={r} key={i}/>
					})
				}
			</ul>
		</div> 
	)
}

export default RulesListWidget