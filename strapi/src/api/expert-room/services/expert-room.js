'use strict';

/**
 * expert-room service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::expert-room.expert-room');
