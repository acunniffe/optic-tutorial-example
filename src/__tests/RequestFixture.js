import supertestRequest from 'supertest'
import http from 'http'
import {app} from "../router";

const opticWatching = process.env['optic-watching']
const server = http.createServer(app);

export const appReady = new Promise((resolve, reject) => (opticWatching) ? server.listen(3005, resolve) : resolve())
export const stopServer = () => server.close()


export const request = (opticWatching) ? supertestRequest('http://localhost:30333') : supertestRequest(app)
