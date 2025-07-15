'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/user-progress/update',
      handler: 'user-progress.updateProgress'
    },
    {
      method: 'GET',
      path: '/user-progress/me',
      handler: 'user-progress.getUserProgress'
    },
    {
      method: 'GET',
      path: '/user-progress/course/:courseId',
      handler: 'user-progress.getCourseProgress'
    }
  ]
};