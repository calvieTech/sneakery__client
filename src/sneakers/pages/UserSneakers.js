import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SneakerList from "../components/SneakerList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserSneakers = () => {
	const [loadedSneakers, setLoadedSneakers] = useState();
	const userId = useParams().userId;

	let url =
		process.env.NODE_ENV === "development"
			? `http://${window.location.hostname}:3001/api/sneakers/user/${userId}`
			: `https://${window.location.hostname}:3001/api/sneakers/user/${userId}`;

	const { isLoading, error, sendRequest, clearError } =
		useHttpClient();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchSneakers = async (url) => {
			let responseData;
			try {
				responseData = await sendRequest(url);
				setLoadedSneakers(responseData.sneakers);
			} catch (err) {
				console.error(err.message);
			}
		};
		fetchSneakers(url);
		navigate(`/sneakery/${userId}/sneakers`);
	}, [sendRequest, userId, url]);

	const sneakerDeletedHandler = (deletedSneakerId) => {
		const updatedSneakers = loadedSneakers.filter(
			(prevSneaker) => prevSneaker !== deletedSneakerId
		);
		setLoadedSneakers(updatedSneakers);
	};

	return (
		<React.Fragment>
			<ErrorModal
				error={error}
				onClear={clearError}
			/>
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && loadedSneakers && (
				<SneakerList
					items={loadedSneakers}
					onDeleteSneaker={sneakerDeletedHandler}
				/>
			)}
		</React.Fragment>
	);
};

export default UserSneakers;
