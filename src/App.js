import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
// import Home from "./user/pages/Home";
import UserProfile from "./user/components/UserProfile";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { useAuth } from "./shared/hooks/auth-hook";
import { AuthContext } from "./shared/context/auth-context";

const Home = lazy(() => import("./user/pages/Home"));
const Users = lazy(() => import("./user/pages/Users"));
const Auth = lazy(() => import("./user/pages/Auth"));
const UserSneakers = lazy(() => import("./sneakers/pages/UserSneakers"));
const NewSneaker = lazy(() => import("./sneakers/pages/NewSneaker"));
const UpdateSneaker = lazy(() => import("./sneakers/pages/UpdateSneaker"));

const App = () => {
	const { token, login, logout, userId } = useAuth();

	let routes;

	if (token) {
		routes = (
			<>
				<Suspense
					fallback={
						<div className="center">
							<LoadingSpinner />
						</div>
					}>
					<Routes>
						<Route
							path="/"
							element={<Home />}
						/>``
						<Route
							path="/sneakery"
							element={<Users />}
							default
						/>
						<Route
							path="/sneakery/:userId/sneakers"
							exact
							element={<UserSneakers />}
						/>
						<Route
							path="/sneakery/sneakers/new"
							exact
							element={<NewSneaker />}
						/>
						<Route
							path="/sneakery/sneakers/:sneakerId"
							exact
							element={<UpdateSneaker />}
						/>
					</Routes>
				</Suspense>
			</>
		);
	} else {
		routes = (
			<>
				<Suspense
					fallback={
						<div className="center">
							<LoadingSpinner />
						</div>
					}>
					<Routes>
						<Route
							path="/"
							element={<Home />}
						/>
						<Route
							path="/sneakery"
							exact
							element={<Users />}
							default
						/>
						<Route
							path="/sneakery/profile"
							exact
							element={<UserProfile />}
						/>
						<Route
							path="/sneakery/:userId/sneakers"
							exact
							element={<UserSneakers />}
						/>
						<Route
							path="/sneakery/auth"
							element={<Auth />}
						/>
					</Routes>
				</Suspense>
			</>
		);
	}

	return (
		// token will be truthy or falsy
		<AuthContext.Provider
			value={{
				isLoggedIn: !!token,
				jwt: token,
				userId: userId,
				login: login,
				logout: logout,
			}}>
			<Router>
				<MainNavigation />
				<main>{routes}</main>
			</Router>
		</AuthContext.Provider>
	);
};

export default App;
