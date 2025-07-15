module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Skip middleware for non-lesson routes
    if (!ctx.request.url.includes('/api/lessons')) {
      return await next();
    }

    // Skip for GET requests to list all lessons (public access)
    if (ctx.request.method === 'GET' && !ctx.request.url.includes('/api/lessons/')) {
      return await next();
    }

    // Allow access to lesson metadata even without authentication
    // Only restrict video content
    if (!ctx.state.user) {
      await next();
      // Remove video content from response for non-authenticated users
      if (ctx.response.body && ctx.response.body.data) {
        const data = ctx.response.body.data;
        
        // Handle single lesson response
        if (data.attributes && data.attributes.video) {
          data.attributes.video = null;
          data.attributes.videoUrl = null;
          data.attributes.hasAccess = false;
          data.attributes.requiresLogin = true;
        }
        
        // Handle multiple lessons response
        if (Array.isArray(data)) {
          data.forEach(lesson => {
            if (lesson.attributes && lesson.attributes.video) {
              lesson.attributes.video = null;
              lesson.attributes.videoUrl = null;
              lesson.attributes.hasAccess = false;
              lesson.attributes.requiresLogin = true;
            }
          });
        }
      }
      return;
    }

    const userId = ctx.state.user.id;
    
    try {
      // Get user subscription status
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
        fields: ['isSubscribe']
      });

      if (!user) {
        return ctx.unauthorized('User not found');
      }

      // If user has active subscription, allow full access
      if (user.isSubscribe) {
        return await next();
      }

      // For users without subscription, modify response to exclude video URLs
      await next();
      
      // If response contains lesson data, remove video access
      if (ctx.response.body && ctx.response.body.data) {
        const data = ctx.response.body.data;
        
        // Handle single lesson response
        if (data.attributes && data.attributes.video) {
          data.attributes.video = null;
          data.attributes.videoUrl = null;
          data.attributes.hasAccess = false;
        }
        
        // Handle multiple lessons response
        if (Array.isArray(data)) {
          data.forEach(lesson => {
            if (lesson.attributes && lesson.attributes.video) {
              lesson.attributes.video = null;
              lesson.attributes.videoUrl = null;
              lesson.attributes.hasAccess = false;
            }
          });
        }
      }

    } catch (error) {
      strapi.log.error('Subscription check middleware error:', error);
      return ctx.internalServerError('Unable to verify subscription status');
    }
  };
};