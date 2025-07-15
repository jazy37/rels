module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/lessons/:id/access',
      handler: 'lesson.checkAccess',
      config: {
        policies: [],
        middlewares: [],
        auth: {
          scope: ['authenticated']
        }
      }
    }
  ]
};