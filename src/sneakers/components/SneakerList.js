import React from "react";

import Card from "../../shared/components/UIElements/Card";
import SneakerItem from "./SneakerItem";
import Button from "../../shared/components/FormElements/Button";
import "./SneakerList.css";

const SneakerList = (props) => {
	if (props.items.length === 0) {
		return (
			<div className="sneaker-list center">
				<Card>
					<h2>No sneakers found. Maybe create one?</h2>
					<Button to="/sneakery/sneakers/new">Share Your Favorite Pair of Kicks!</Button>
				</Card>
			</div>
		);
	}

	return (
		<ul className="sneaker-list">
			{props.items.map((sneaker) => (
				<SneakerItem
					key={sneaker.id}
					id={sneaker.id}
					image={sneaker.image}
					title={sneaker.title}
					description={sneaker.description}
					creatorId={sneaker.creator}
					onDelete={props.onDeleteSneaker}
				/>
			))}
		</ul>
	);
};

export default SneakerList;
