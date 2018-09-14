/*
 * Copyright (c) 2012-2018 Digital Bazaar, Inc. All rights reserved.
 */
const constants = require('bedrock').config.constants;
const schemas = require('bedrock-validation').schemas;

const postJoin = {
  title: 'Join',
  description: 'Create an Identity',
  // not required id, url, description, sysPublic
  required: [
    '@context',
    'email',
    'label',
    'sysPassword',
    'sysSlug',
    'type'
  ],
  type: 'object',
  properties: {
    '@context': schemas.jsonldContext(constants.IDENTITY_CONTEXT_V1_URL),
    id: schemas.identifier(),
    type: {
      type: 'string',
      enum: ['Identity']
    },
    sysSlug: schemas.slug(),
    label: schemas.label(),
    email: schemas.email(),
    sysPassword: schemas.password(),
    url: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    sysPublic: {
      title: 'Property Visibility',
      description:
        'A list of object property IRIs that are publicly visible.',
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
        enum: [
          'owner',
          'label'
        ]
      },
      errors: {
        invalid: 'Only "owner" and "label" are permitted.',
        missing:
          'Please enter the properties that should be publicly visible.'
      }
    }
  },
  additionalProperties: false
};

module.exports.postJoin = () => postJoin;
