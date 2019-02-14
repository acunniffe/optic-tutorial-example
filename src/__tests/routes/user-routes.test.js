import assert from 'assert'
import {app} from '../../router'
import {createUser, followUser, loginUser} from "../../controllers/UserController";
import {createUserMessage} from "../../mockdb/Users";
import {withOptic} from "../withOpticFixture";
// import {appReady, request, stopServer} from '../RequestFixture'
import supertestRequest from 'supertest'

describe('user router', () => {


	const request = supertestRequest(withOptic(app, 3005))

	// before(() => appReady)
	// after(stopServer)

	const testUserCreateMessage = {username: 'testABC', password: 'abcdefg', email: 'a@gmail.com'}
	const testUser = createUser(testUserCreateMessage)
	const testUserJWt = loginUser(testUserCreateMessage).item.jwt


	describe('user creation', () => {
		it('works with valid input', (done) => {
			request
					.post('/users')
					.set('Content-Type', 'application/json')
					.send({
						username: 'Test',
						password: 'abcdefgAAAff2',
						email: 'test@gmail.com'
				 	 })
					.expect(200, done)
		})

		it('is rejected with invalid input', (done) => {
			request
				.post('/users')
				.set('Content-Type', 'application/json')
				.send({
					email: 'test@gmail.com'
				})
				.expect(400, done)
		})

		it('is rejected if email is duplicated', (done) => {
			const user = {
				username: 'Test',
				password: 'abcdefgAAAff2',
				email: 'test1@gmail.com'
			}
			request
				.post('/users')
				.set('Content-Type', 'application/json')
				.send(user)
				.expect(200, () => {
					request
						.post('/users')
						.set('Content-Type', 'application/json')
						.send(user)
						.expect(400, done)
				})
		})
	})

	describe('user login', () => {
		it('succeeds with valid credentials', (done) => {
			request
				.post('/users/login')
				.set('Content-Type', 'application/json')
				.send({
					username: testUserCreateMessage.username,
					password: testUserCreateMessage.password
				})
				.expect(200)
				.then(response => {
					assert(response.body.jwt)
					assert(response.body.userId)
					done()
				})
		})

		it('fails with invalid credentials', (done) => {
			request
				.post('/users/login')
				.set('Content-Type', 'application/json')
				.send({
					username: 'wrong',
					password: testUserCreateMessage.password
				})
				.expect(401, done)
		})

	})

	describe('follow / unfollow user', () => {

		const target = createUser( {username: 'adam', password: 'abcdefg', email: 'b@gmail.com'}).item
		const targetId = target.__id

		it('can follow a user', (done) => {
			request
				.post(`/users/${target.__id}/followers`)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer '+testUserJWt)
				.expect(200, done)
		})

		it('fails when no user exists', (done) => {
			request
				.post(`/users/${'not-real'}/followers`)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer '+testUserJWt)
				.expect(404, done)
		})


		it('can unfollow a user', (done) => {
			request
				.delete(`/users/${target.__id}/followers`)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer '+testUserJWt)
				.expect(200, done)
		})

		it('unfollow fails when target user does not exists', (done) => {
			request
				.delete(`/users/${'not-real'}/followers`)
				.set('Content-Type', 'application/json')
				.set('Authorization', 'Bearer '+testUserJWt)
				.expect(404, done)
		})

	})




})
