module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/courses/public',
      handler: 'course.findPublic',
      config: {
        auth: false,
        policies: []
      }
    },
    {
      method: 'GET',
      path: '/courses/public/:slug',
      handler: 'course.findOnePublic',
      config: {
        auth: false,
        policies: []
      }
    }
  ]
};