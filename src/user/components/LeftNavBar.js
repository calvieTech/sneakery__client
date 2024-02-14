import "./LeftNavBar.css";
import { GroupIcon } from "@mui/icons-material/Group";
import { NavLink } from "react-router-dom";

function LeftNavBar() {
	return (
		<div className="leftNavBar__container">
			<NavLink
				to="/sneakery/users"
				className="leftNavBar__link">
				<GroupIcon fontSize="medium" />
				&nbsp;ALL USERS
			</NavLink>
		</div>
	);
}

export default LeftNavBar;
