import express from 'express'
import request from 'request'
import supertestRequest from 'supertest'

const opticWatching = process.env['optic-watching']
const opticProxyAddress = 'http://localhost:30333';

export function withOptic(app, testPort) {

	if (opticWatching) {
		const proxy = express()
		proxy.all('*', (req, res) => {

			let mockServer;
			new Promise((resolve, reject) => {
				mockServer = app.listen(testPort, resolve)
			}).then(() => {
				req
				  .pipe(request.post({baseUrl: opticProxyAddress, uri: req.url}))
				  .pipe(res);

				res.on('finish', () => {
					mockServer.close()
				})
			})
			.catch((err) => {
				throw new Error(err)
			})

		});
		return proxy
	}

	return app
}
//
// const testApp = express()
// testApp.get('/test', (req, res) => res.send('Hello World!'))
//
// const testInstance = withOptic(testApp, 3005)
//
// supertestRequest(testInstance)
// 	.get('/test')
// 	.expect(200)
// 	.end((err, res) => console.log(res))
