/*
 * Copyright (c) 2012-2017 Digital Bazaar, Inc. All rights reserved.
 */
var async = require('async');
var bedrock = require('bedrock');
var brIdentity = require('bedrock-identity');
var brPassword = require('bedrock-authn-password');
var database = require('bedrock-mongodb');

var BedrockError = bedrock.util.BedrockError;
var validate = require('bedrock-validation').validate;
var logger = bedrock.loggers.get('app');

// pull in the default config
require('./config');

// add routes
bedrock.events.on('bedrock-express.configure.routes', addRoutes);

function addRoutes(app) {
  // warn if this module is included but all functionality is disabled
  if(!bedrock.config['website-user-http'].features.join) {
    logger.warning('user joining is disabled, enable by setting ' +
      'bedrock.config.website-user-http.enableJoining to true');
  }

  // creating new identities must be enabled via flags
  if(bedrock.config['website-user-http'].features.join) {
    app.post(bedrock.config['website-user-http'].routes.join,
      validate('services.join.postJoin'),
      function(req, res, next) {
        async.waterfall([
          function(callback) {
            _createIdentity(req, callback);
          },
          function(results, callback) {
            req.body.sysIdentifier = results.identity.id;
            req.body.password = req.body.sysPassword;
            brPassword.login(req, res, next, function(err) {
              if(err) {
                return callback(new BedrockError(
                  'Could not create a session for the newly created identity.',
                  'AutoLoginFailed', {}, err));
              }
              // return identity
              res.set('Location', results.identity.id);
              res.status(201).json(results.identity);
              callback();
            });
          }
        ], function(err) {
          if(err) {
            return next(err);
          }
        });
      });
  }

}

/**
 * Identity creation service. Used by normal and testing services.
 */
function _createIdentity(req, callback) {
  var identityId = req.body.id;

  async.auto({
    createIdentity: function(callback) {
      // create identity
      var identity = {
        '@context': bedrock.config.constants.IDENTITY_CONTEXT_V1_URL,
        id: identityId,
        sysSlug: req.body.sysSlug,
        label: req.body.label,
        email: req.body.email,
        sysPassword: req.body.sysPassword
      };
      brIdentity.insert(null, identity, function(err, record) {
        callback(err, record ? record.identity : null);
      });
    }
  }, function(err, results) {
    if(err) {
      if(database.isDuplicateError(err)) {
        err = new BedrockError(
          'Could not create identity, it is a duplicate.',
          'DuplicateIdentity', {
            identity: identityId,
            'public': true,
            httpStatusCode: 400
          });
      }
      return callback(err);
    }
    // result details
    var details = {identity: results.createIdentity};
    callback(null, details);
  });
}
