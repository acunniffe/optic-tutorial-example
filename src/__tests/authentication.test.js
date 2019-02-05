import assert from 'assert'
import {generateToken, verifyToken} from "../authentication";

describe('authentication', () => {
	it('can generate valid auth tokens', (done) => {
		const token = generateToken('fakeId')
		verifyToken(token, (err, data) => {
			assert(!err)
			assert(data.userId === 'fakeId')
			done()
		})
	})
})
