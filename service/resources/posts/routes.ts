import * as Hapi from 'hapi';
import * as Joi from 'joi';
import * as Boom from 'boom';
import * as marked from 'marked';
import * as highlight from 'highlight.js';
import * as slug from 'speakingurl';
import { PostsRepository } from './repository';

marked.setOptions({
    highlight: function(code, lang, callback): string {
        return highlight.highlightAuto(code).value;
    }
});

export class Routes {
    static register(server: Hapi.Server) {
        server.route({
            method: 'GET',
            path: '/posts',
            config: {
                validate: {
                    query: {
                        pageSize: Joi.number().min(1).max(25).default(10),
                        page: Joi.number().min(0).max(9999).default(0)
                    }
                }
            },
            handler: (request, reply) => {
                new PostsRepository()
                    .list(request.query['page'], request.query['pageSize'])
                    .then(posts => reply(posts))
                    .catch(err => reply(Boom.badImplementation(err)));
            }
        });

        server.route({
            method: 'GET',
            path: '/posts/{year}/{month}/{slug}',
            config: {
                validate: {
                    params: {
                        year: Joi.number().required(),
                        month: Joi.number().required(),
                        slug: Joi.string().min(1).max(256).required()
                    }
                }
            },
            handler: (request, reply) => {
                new PostsRepository()
                    .singleBySlug(request.params.slug)
                    .then(post => reply(post))
                    .catch(err => reply(Boom.badImplementation(err)));
            }
        });

        server.route({
            method: 'POST',
            path: '/posts',
            config: {
                validate: {
                    payload: {
                        title: Joi.string().max(256).required(),
                        markdown: Joi.string().required()
                    }
                }
            },
            handler: (request, reply) => {
                const post = {
                    title: request.payload.title,
                    slug: slug(request.payload.title),
                    body: marked(request.payload.markdown),
                    bodyRaw: request.payload.markdown
                };
                new PostsRepository()
                    .create(post)
                    .then(post => reply(post))
                    .catch(err => reply(Boom.badImplementation(err)));
            }
        });

        server.route({
            method: 'PUT',
            path: '/posts/{slug}',
            config: {
                validate: {
                    payload: {
                        title: Joi.string().max(256).required(),
                        markdown: Joi.string().required()
                    }                    
                }
            },
            handler: (request, reply) => {
                const post = {
                    title: request.payload.title,
                    slug: slug(request.payload.title),
                    body: marked(request.payload.markdown),
                    bodyRaw: request.payload.markdown
                };
                new PostsRepository()
                    .updateBySlug(request.params.slug, post)
                    .then(post => reply(post))
                    .catch(err => reply(Boom.badImplementation(err)));
            }
        })
    }
}
