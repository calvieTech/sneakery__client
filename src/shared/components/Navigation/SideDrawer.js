import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import "./SideDrawer.css";

const SideDrawer = (props) => {
	const asideContent = (
		<aside
			className="side-drawer"
			onClick={props.onClick}>
			{props.children}
		</aside>
	);
	const content = (
		<TransitionGroup component={null}>
			<CSSTransition
				timeout={400}
				classNames="slide-in-left"
				appear
				unmountOnExit>
				{asideContent}
			</CSSTransition>
		</TransitionGroup>
	);

	const drawerHook = createPortal(content, document.getElementById("drawer-hook"));

	return <React.Fragment>{drawerHook}</React.Fragment>;
};

export default SideDrawer;
