import {addUser, lookupUser, queryUser, queryUsers, toClientSafeUser, updateUser} from "../mockdb/Users";
import {generateToken} from "../authentication";


export function createUser(user) {
	const emailConflict = !!queryUser((u) => u.email === user.email)

	if (emailConflict) {
		return {success: false, error: 'Email is already in use', errorStatus: 400}
	}

	const addedUser = addUser(user)
	return {success: true, item: toClientSafeUser(addedUser)}
}


export function loginUser({username, password}) {
	//so insecure, never use this in production.
	const validLogin = queryUser((u) => u.username === username && u.password === password)

	if (validLogin) {
		return {success: true, item: {
			userId: validLogin.__id,
			jwt: generateToken(validLogin.__id)
		}}
	} else {
		return {success: false, error: 'username & password did not match', errorStatus: 401}
	}
}

export function followUser(myId, theirId) {
	const me = lookupUser(myId)
	const them = lookupUser(theirId)

	if (!me || !them) {
		return {success: false, error: 'User not found', errorStatus: 404}
	}

	if (me.follows.includes(theirId)) {
		return {success: true}
	}

	updateUser(myId, {follows: [...me.follows, theirId]})

	return {success: true}
}

export function unfollowUser(myId, theirId) {
	const me = lookupUser(myId)
	const them = lookupUser(theirId)

	if (!me || !them) {
		return {success: false, error: 'User not found', errorStatus: 404}
	}

	if (!me.follows.includes(theirId)) {
		return {success: true}
	}

	updateUser(myId, {follows: me.follows.filter(i => i.__id !== theirId)})

	return {success: true}
}

export function getFollowers(userId) {
	const them = lookupUser(userId)

	if (!them) {
		return {success: false, error: 'User not found', errorStatus: 404}
	}

	const followers = queryUsers(user => user.follows.includes(userId)).map(toClientSafeUser)

	return {success: true, followers}
}
