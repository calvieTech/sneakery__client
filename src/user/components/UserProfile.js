import { Link } from "react-router-dom";
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import "./UserProfile.css";

const UserProfile = (props) => {
	return (
		<li className="user-profile">
			<Card className="user-profile__content">
				<Link to={`/sneakery/${props.id}/sneakers`}>
					<div className="user-profile__image">
						<Avatar
							className="avatar"
							image={props.avatar}
							alt={props.name}
							width={68}
							height={68}
						/>
					</div>
					<div className="user-profile__info">
						<h2>{props.name}</h2>
						<h3>
							{props.sneakerCount} {props.sneakerCount === 1 ? "Sneaker" : "Sneakers"}
						</h3>
					</div>
				</Link>
			</Card>
		</li>
	);
};

export default UserProfile;
