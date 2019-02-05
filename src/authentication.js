import jwt from 'jsonwebtoken'

const dumbSecret = 'secret'

export const generateToken = (userId) => {
	return jwt.sign({ userId, iat: Math.floor(Date.now() / 1000) - 30 }, dumbSecret)
}

export const verifyToken = (token, callback) => jwt.verify(token, dumbSecret, callback)

export const authenticated = (req, res, next) => {
	const rawHeader = req.get('Authentication')

	const token = rawHeader.split(' ')[1]

	verifyToken(token, (err, data) => {

		if (err) {
			const invalidAuth = 'Unauthorized'
			res.status(401).send(invalidAuth)
		} else {
			req.userId = data.userId
			next()
		}

	})
}
