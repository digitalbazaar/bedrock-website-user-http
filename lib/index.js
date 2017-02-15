/*
 * Copyright (c) 2012-2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const _ = require('lodash');
const async = require('async');
const bedrock = require('bedrock');
const config = bedrock.config;
const brIdentity = require('bedrock-identity');
const brPassword = require('bedrock-authn-password');
const database = require('bedrock-mongodb');
const logger = bedrock.loggers.get('app');
const validate = require('bedrock-validation').validate;
const BedrockError = bedrock.util.BedrockError;
require('bedrock-agreement');
require('bedrock-express');
require('bedrock-key');
require('bedrock-permission');

// pull in the default config
require('./config');

// add routes
bedrock.events.on('bedrock-express.configure.routes', app => {

  // warn if this module is included but all functionality is disabled
  if(!config['website-user-http'].features.join) {
    logger.warning('User joining is disabled, enable by setting ' +
      '`config[\'website-user-http\'].features.join` to true.');
  }

  // creating new identities must be enabled via flags
  if(config['website-user-http'].features.join) {
    app.post(config['website-user-http'].routes.join,
      validate('services.join.postJoin'), function(req, res, next) {
        async.auto({
          createIdentity: callback => _createIdentity(req, callback),
          login: ['createIdentity', (callback, results) => {
            req.body.sysIdentifier = results.createIdentity.id;
            req.body.password = req.body.sysPassword;

            brPassword.login(req, res, next, err => {
              if(err) {
                return next(new BedrockError(
                  'Could not create a session for the newly created identity.',
                  'AutoLoginFailed', {public: true, httpStatusCode: 401}, err));
              }
              // return identity
              res.set('Location', results.createIdentity.id);
              res.status(201).json(results.createIdentity);
              callback();
            });
          }]
        }, err => {
          if(err) {
            return next(err);
          }
        });
      });
  }
});

/**
 * Identity creation service. Used by normal and testing services.
 */
function _createIdentity(req, callback) {
  const identityId = req.body.id;
  // create identity
  const identity = {
    id: identityId,
    sysSlug: req.body.sysSlug,
    label: req.body.label,
    email: req.body.email,
    sysPassword: req.body.sysPassword
  };

  // add identity defaults
  _.defaults(identity, config['website-user-http'].identity.defaults);

  brIdentity.insert(null, identity, (err, record) => {
    if(err) {
      if(database.isDuplicateError(err)) {
        err = new BedrockError(
          'Could not create identity, it is a duplicate.',
          'DuplicateIdentity', {
            identity: identityId,
            'public': true,
            httpStatusCode: 409
          });
      }
      return callback(err);
    }
    callback(err, record ? record.identity : null);
  });
}
