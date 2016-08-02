'use strict';

const Boom = require('boom');
const Hoek = require('hoek');
const Joi = require('joi');

const internals = {};


internals.schema = Joi.object({
  principalIdType: Joi.string().lowercase().default('uuid'),
  principalIdHeader: Joi.string().lowercase().default('X-Principal-Id'),
  principalRolesHeader: Joi.string().lowercase().default('X-Principal-Roles')
  //validateFunc: Joi.func()
}).required();


internals.implementation = function (server, _options) {
  const options = Joi.validate(_options, internals.schema);

  Hoek.assert(!options.error, options.error);

  const settings = options.value;

  //server.ext('onPreRequest', (request, reply) => {
  //    console.log('request.auth.credentials', request.auth.credentials);
  //    return reply.continue();
  //});

  const scheme = {
    authenticate: (request, reply) => {
      const principalHeaderId = settings.principalIdHeader.toLowerCase();
      const principalHeaderRoles = settings.principalRolesHeader.toLowerCase();
      const authorizationId = request.headers[principalHeaderId];
      let authorizationRoles = request.headers[principalHeaderRoles];

      if (!authorizationId || authorizationId === undefined) {
        // console.log('[AUTH] authorizationId not set');
        return reply(Boom.unauthorized(null, 'internalHeaderAuth'), null, {});
      }

      if (authorizationRoles !== undefined) {
        try {
          authorizationRoles = JSON.parse(authorizationRoles);
        }
        catch (e) {
          request.log.error('[AUTH] Principal roles syntax error');
          return reply(Boom.unauthorized('Principal roles syntax error', authorizationRoles));
        }
      }

      const validateFunc = function (userId, userRoles, callback) {
        //let request = this;
        // If user id is present, it's valid...

        request.log.info('AUTHENTICATED', userId, userRoles);

        // set credentials property
        callback(null, true, {
          id: userId,
          roles: userRoles,
          scope: userRoles
        });
      };

      //settings.validateFunc.call(request, authorizationId, authorizationRoles, (err, isValid, credentials) => {
      validateFunc.call(request, authorizationId, authorizationRoles, (err, isValid, credentials) => {
        if (err) {
          request.log.warn('Authentication error', err);
          return reply(err, {credentials: credentials, log: {tags: ['auth', 'internalHeader'], data: err}});
        }

        if (!isValid) {
          request.log.warn('Authentication error: Bad principal id');
          return reply(Boom.unauthorized('Bad principal id', options.principalIdType), {credentials: credentials});
        }

        if (!credentials || typeof credentials !== 'object') {
          request.log.warn('Authentication error: Bad id string received for internalHeader auth validation');
          return reply(Boom.badImplementation('Bad id string received for internalHeader auth validation'), {log: {tags: 'principalId'}});
        }

        // AUTHENTICATED

        return reply.continue({credentials: credentials});
      });
    }
  };

  return scheme;
};


exports.register = function (server, options, next) {
  server.auth.scheme('internalHeaderAuth', internals.implementation);

  // Internal auth
  server.auth.strategy('internalHeader', 'internalHeaderAuth', 'try', {});

  // server.log(['internal-header-auth'], 'internalHeaderAuth plugin registered');
  // console.log(['internal-header-auth'], 'internalHeaderAuth plugin registered');

  return next();
};


exports.register.attributes = {
  name: 'internalHeaderAuth'
};
