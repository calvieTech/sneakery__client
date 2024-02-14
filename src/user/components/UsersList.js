import UserProfile from "./UserProfile";
import Card from "../../shared/components/UIElements/Card";
import "./UsersList.css";

const UsersList = (props) => {
	if (props.usersList.length === 0) {
		return (
			<div className="center">
				<Card>
					<h2>No users found.</h2>
				</Card>
			</div>
		);
	}

	return (
		<ul className="users-list">
			{props.usersList.map((user) => (
				<UserProfile
					key={user.id}
					id={user.id}
					avatar={user.avatar}
					name={user.username}
					sneakerCount={user.sneakers.length}
				/>
			))}
		</ul>
	);
};

export default UsersList;
