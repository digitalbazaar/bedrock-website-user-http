/*
 * Bedrock Key HTTP Module Configuration
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
var config = require('bedrock').config;
var path = require('path');
require('bedrock-validation');

// HTTP API endpoints
config['website-user-http'] = {};
config['website-user-http'].enableJoining = false;
config['website-user-http'].routes = {};
config['website-user-http'].routes.join = '/join';

// common validation schemas
config.validation.schema.paths.push(
  path.join(__dirname, '..', 'schemas')
);
