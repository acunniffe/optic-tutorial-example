import uuidv1 from 'uuid/v1'
import Joi from 'joi'

const _usersStore = {}


export const lookupUser = (userId) => _usersStore[userId]

export const queryUser = (predicate) =>
	Object.entries(_usersStore).map(i => i[1]).find(predicate)

export const queryUsers = (predicate) =>
	Object.entries(_usersStore).map(i => i[1]).filter(predicate)

export const addUser = (user) => {
	const id = uuidv1()
	const fullUser = {...user, __id: id, follows: []}
	_usersStore[id] = fullUser
	return fullUser
}

export const updateUser = (id, updates) => {
	const user = _usersStore[id]
	if (user) {
		_usersStore[id] = {...user, ...updates}
		return user
	}
}


//Messages
export const createUserMessage = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    email: Joi.string().email()
})


export const loginMessage = Joi.object().keys({
	username: Joi.string().alphanum().min(3).max(30),
	password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
})

export const toClientSafeUser = (user) => {
	const copy = {...user, followsCount: user.follows.length}
	delete copy.password
	delete copy.follows
	return copy
}
