import * as Hapi from 'hapi';
import * as Joi from 'joi';
import * as Boom from 'boom';
import * as bunyan from 'bunyan';
import * as marked from 'marked';

import { Resources } from './resources';

console.log(marked('I am using __markdown__.'))

const log = bunyan.createLogger({
	name: 'api'
});
	
const server = new Hapi.Server({
	debug: {
		request: [ 'error' ]
	}
});

server.connection({
	host: '0.0.0.0',
	port: process.env.PORT || 5000
});

server.route({
	method: 'GET',
	path: '/health',
	handler: (request, reply) => {
		reply(null);
	}
});

server.register({
	register: require('hapi-bunyan'),
	options: {
		logger: log
	}
})
	.then(() => {
		Resources.register(server);
		return server.start();
	})
	.then(() => log.info('Server ready'))
	.catch(err => log.error({ error: err }, 'Error starting server'));
