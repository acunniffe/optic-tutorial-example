import express from 'express'
import bodyParser from 'body-parser'
import Joi from "joi";
import {createUserMessage, loginMessage} from "./mockdb/Users";
import {invalidRequestBody} from "./constants";
import {createUser, followUser, getFollowers, loginUser, unfollowUser} from "./controllers/UserController";
import {authenticated} from "./authentication";

export const app = express()

app.use(bodyParser.json())

app.post('/users', (req, res) => {
	Joi.validate(req.body, createUserMessage, (err, value) => {
		if (err) {
			return res.status(400).send(invalidRequestBody)
		}
		const {success, item, errorStatus, error} = createUser(value)
		if (success) {
			res.json(item)
		} else {
			res.set('Content-Type', 'text/plain');
			res.status(errorStatus).send(error)
		}
	})
})

app.post('/users/login', (req, res) => {
	Joi.validate(req.body, loginMessage, (err, value) => {
		if (err) {
			return res.status(400).send(invalidRequestBody)
		}
		const {success, item, errorStatus, error} = loginUser(value)
		if (success) {
			res.json(item)
		} else {
			res.set('Content-Type', 'text/plain');
			res.status(errorStatus).send(error)
		}
	})
})

app.get('/users/:userId/followers', (req, res) => {
	const userId = req.params.userId
	const {success, followers, errorStatus, error} = getFollowers(userId)
	if (result.success) {
		res.status(200).json(followers)
	} else {
		res.set('Content-Type', 'text/plain');
		res.status(errorStatus).send(error)
	}
})

app.post('/users/:theirId/followers', authenticated, (req, res) => {
	const theirId = req.params.theirId

	const {success, errorStatus, error} = followUser(req.userId, theirId)

	if (success) {
		res.sendStatus(200)
	} else {
		res.set('Content-Type', 'text/plain');
		res.status(errorStatus).send(error)
	}
})

app.delete('/users/:theirId/followers', authenticated, (req, res) => {
	const theirId = req.params.theirId

	const {success, errorStatus, error} = unfollowUser(req.userId, theirId)

	if (success) {
		res.sendStatus(200)
	} else {
		res.set('Content-Type', 'text/plain');
		res.status(errorStatus).send(error)
	}
})

