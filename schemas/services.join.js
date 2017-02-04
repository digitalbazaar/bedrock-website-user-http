/*
 * Copyright (c) 2012-2017 Digital Bazaar, Inc. All rights reserved.
 */
const constants = require('bedrock').config.constants;
const schemas = require('bedrock-validation').schemas;

const postJoin = {
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
      type: {
        required: true,
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
    }
  },
  additionalProperties: false
};

module.exports.postJoin = function() {
  return postJoin;
};
