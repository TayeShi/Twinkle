'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.get('/cos/tencent/buckets/list', controller.cos.getService)
  // /cos/tencent/object/update
};
