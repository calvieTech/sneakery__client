import React, { useState, useContext } from "react";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./SneakerItem.css";
const { useNavigate } = require("react-router-dom");

const PlaceSneaker = (props) => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const auth = useContext(AuthContext);
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	let url =
		process.env.NODE_ENV === "development"
			? `http://${window.location.hostname}:3001/sneakers/${props.id}`
			: `https://${window.location.hostname}:3001/sneakers/${props.id}`;

	const navigate = useNavigate();

	const showDeleteWarningHandler = () => {
		setShowConfirmModal(true);
	};

	const cancelDeleteHandler = () => {
		setShowConfirmModal(false);
	};

	const confirmDeleteHandler = async () => {
		setShowConfirmModal(false);
		try {
			const res = await sendRequest(url, "DELETE", null, {
				Authorization: "Bearer " + auth.jwt,
			});
			props.onDelete(props.id);
		} catch (err) {
			console.error(err.message);
			throw new Error(err);
		}
		navigate("/sneakery", { replace: true });
	};

	return (
		<React.Fragment>
			<ErrorModal
				error={error}
				onClear={clearError}
			/>
			<Modal
				show={showConfirmModal}
				onCancel={cancelDeleteHandler}
				header="Are you sure?"
				footerClass="sneakers-item__modal-actions"
				footer={
					<React.Fragment>
						<Button
							inverse
							onClick={cancelDeleteHandler}>
							CANCEL
						</Button>
						<Button
							danger
							onClick={confirmDeleteHandler}>
							DELETE
						</Button>
					</React.Fragment>
				}>
				<p>
					Do you want to proceed and delete this sneakers? Please note that it can't be undone
					thereafter.
				</p>
			</Modal>
			<li className="sneakers-item">
				{isLoading && <LoadingSpinner asOverlay />}
				<Card className="sneakers-item__content">
					<div className="sneakers-item__image">
						<img
							src={`${props.image}`}
							alt={props.title}
						/>
					</div>
					<div className="sneakers-item__info">
						<h2>{props.title}</h2>
						<p>{props.description}</p>
					</div>
					<div className="sneakers-item__actions">
						{<Button to={`/sneakery/sneakers/${props.id}`}>COMMENT</Button>}
						{auth.userId === props.creatorId && (
							<Button to={`/sneakery/sneakers/${props.id}`}>EDIT</Button>
						)}

						{auth.userId === props.creatorId && (
							<Button
								danger
								onClick={showDeleteWarningHandler}>
								DELETE
							</Button>
						)}
					</div>
				</Card>
			</li>
		</React.Fragment>
	);
};

export default PlaceSneaker;
