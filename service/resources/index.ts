import * as Hapi from 'hapi';
import * as posts from './posts';

export class Resources {
	static register(server: Hapi.Server) {
		posts.Routes.register(server);
	}
}
