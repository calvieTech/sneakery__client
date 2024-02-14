import { createContext } from "react";

export const AuthContext = createContext({
	isLoggedIn: false,
	userId: null,
	jwt: null,
	login: () => {},
	logout: () => {},
});
