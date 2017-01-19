/*
 * Bedrock Key HTTP Module Configuration
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
var config = require('bedrock').config;
var path = require('path');
require('bedrock-validation');

config['website-user-http'] = {};

// module features
config['website-user-http'].features = {};
config['website-user-http'].features.join = false;

// HTTP API endpoints
config['website-user-http'].routes = {};
config['website-user-http'].routes.join = '/join';

// common validation schemas
config.validation.schema.paths.push(
  path.join(__dirname, '..', 'schemas')
);
