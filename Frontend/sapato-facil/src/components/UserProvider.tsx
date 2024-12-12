"use client";

import { Session } from "@/services/Session";
import Header from "./Header";
import { getUser } from "@/services/Usuario";
import useSWR from "swr";

const fetchUser = async (userId: number) => {
	const userData = await getUser(userId);
	Session.saveUserData(userData);
	return userData;
};

const UserProvider = () => {
	const userId = Session.getUserId();
	const initialUserData = Session.getUserData() || undefined;
	const { data: userData } = useSWR(
		userId ? `/user/${userId}` : null,
		() => fetchUser(Number(userId)),
		{ fallbackData: initialUserData }
	);

	return <Header userData={userData} />;
};

export default UserProvider;
