import React from "react";
import "./Logo.css";
import SneakeryImg from "../../../static/sneakery_logo2.png";

function Logo() {
	return (
		<div className="logo-container">
			<img
				src={SneakeryImg}
				className="logo"
				alt="logo"
			/>
		</div>
	);
}

export default Logo;
