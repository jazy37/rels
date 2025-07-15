module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/certificate/generate/:courseId',
      handler: 'certificate.generateCertificate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};