import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../../context/auth-context";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CottageIcon from "@mui/icons-material/Cottage";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./NavLinks.css";

const NavLinks = () => {
	const auth = useContext(AuthContext);

	return (
		<ul className="nav-links">
			<li>
				<NavLink to="/sneakery">
					<CottageIcon fontSize="small" />
					&nbsp;HOME
				</NavLink>
			</li>
			{auth.isLoggedIn && (
				<li>
					<NavLink to={`/sneakery/${auth.userId}/sneakers`}>
						<AccountCircleIcon fontSize="small" />
						&nbsp;MY SHOES
					</NavLink>
				</li>
			)}
			{auth.isLoggedIn && (
				<li>
					<NavLink to="/sneakery/sneakers/new">
						<AddCircleIcon fontSize="small" />
						&nbsp;ADD SHOES
					</NavLink>
				</li>
			)}
			{!auth.isLoggedIn && (
				<li>
					<NavLink to="/sneakery/auth">
						<LoginIcon fontSize="small" />
						&nbsp;SIGN-UP
					</NavLink>
				</li>
			)}
			{auth.isLoggedIn && (
				<li className="logout">
					<button onClick={auth.logout}>
						<LogoutIcon fontSize="small" />
						&nbsp;LOGOUT
					</button>
				</li>
			)}
		</ul>
	);
};

export default NavLinks;
