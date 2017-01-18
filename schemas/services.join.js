/*
 * Copyright (c) 2012-2017 Digital Bazaar, Inc. All rights reserved.
 */
var constants = require('bedrock').config.constants;
var schemas = require('bedrock-validation').schemas;

var postJoin = {
  title: 'Join',
  description: 'Create an Identity',
  type: 'object',
  properties: {
    '@context': schemas.jsonldContext(constants.IDENTITY_CONTEXT_V1_URL),
    id: schemas.identifier({required: false}),
    type: {
      required: true,
      type: 'string',
      enum: ['Identity']
    },
    sysSlug: schemas.slug(),
    label: schemas.label(),
    email: schemas.email(),
    sysPassword: schemas.password(),
    url: {
      required: false,
      type: 'string'
    },
    description: {
      required: false,
      type: 'string'
    },
    sysPublic: {
      required: false,
      type: schemas.visibility()
    }
  },
  additionalProperties: false
};

module.exports.postJoin = function() {
  return postJoin;
};
