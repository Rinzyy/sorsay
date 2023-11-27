export const SaveUserInfo = async (fetchUserFromDatabase: any) => {
	// console.log(user);
	// let usernameq = getUsernameByUID(user.uid);
	let savedUser = {
		uid: fetchUserFromDatabase!.userId,
		name: fetchUserFromDatabase!.name,
		username: fetchUserFromDatabase!.username,
		email: fetchUserFromDatabase!.email,
		photoURL: fetchUserFromDatabase!.photoURL,
		createdAt: fetchUserFromDatabase!.createdAt,
	};
	// console.log(user);
	localStorage.setItem('user', JSON.stringify(savedUser));
};
