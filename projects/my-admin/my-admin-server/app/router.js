'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.post('/user/login', controller.user.login)

  router.get('/cos/tencent/buckets/list', controller.cos.getService)
  router.post('/cos/tencent/object/update', controller.cos.uploadObject)
  // /cos/tencent/object/update
};
