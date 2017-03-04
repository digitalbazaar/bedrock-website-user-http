/*
 * Bedrock Key HTTP Module Configuration
 *
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const config = require('bedrock').config;
const path = require('path');
const permissions = config.permission.permissions;
const roles = config.permission.roles;

config['website-user-http'] = {};

// module features
config['website-user-http'].features = {};
config['website-user-http'].features.join = false;

// HTTP API endpoints
config['website-user-http'].routes = {};
config['website-user-http'].routes.join = '/join';

// default registered identity role (contains all permissions for a regular
// identity)
roles['identity.registered'] = {
  id: 'identity.registered',
  label: 'Registered Identity',
  comment: 'Role for registered identities.',
  sysPermission: [
    permissions.AGREEMENT_ACCESS.id,
    permissions.AGREEMENT_ACCEPT.id,
    permissions.IDENTITY_ACCESS.id,
    permissions.IDENTITY_INSERT.id,
    permissions.IDENTITY_EDIT.id,
    permissions.IDENTITY_UPDATE_MEMBERSHIP.id,
    permissions.PUBLIC_KEY_ACCESS.id,
    permissions.PUBLIC_KEY_CREATE.id,
    permissions.PUBLIC_KEY_EDIT.id,
    permissions.PUBLIC_KEY_REMOVE.id
  ]
};

// identity defaults for newly created users
config['website-user-http'].identity = {};
config['website-user-http'].identity.defaults = {
  '@context': config.constants.IDENTITY_CONTEXT_V1_URL,
  type: 'Identity',
  address: [],
  preferences: {
    type: 'IdentityPreferences'
  },
  sysPublic: [],
  sysResourceRole: [{
    sysRole: 'identity.registered',
    generateResource: 'id'
  }],
  sysStatus: 'active'
};

// common validation schemas
config.validation.schema.paths.push(
  path.join(__dirname, '..', 'schemas')
);
