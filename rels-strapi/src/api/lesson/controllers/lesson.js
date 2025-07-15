'use strict';

/**
 * lesson controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::lesson.lesson', ({ strapi }) => ({
  async checkAccess(ctx) {
    const { id } = ctx.params;
    const userId = ctx.state.user?.id;

    if (!userId) {
      return ctx.unauthorized('User not authenticated');
    }

    try {
      // Get user subscription status
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
        fields: ['isSubscribe']
      });

      if (!user) {
        return ctx.notFound('User not found');
      }

      // Get lesson details
      const lesson = await strapi.entityService.findOne('api::lesson.lesson', id, {
        populate: {
          course: {
            fields: ['title', 'slug']
          }
        }
      });

      if (!lesson) {
        return ctx.notFound('Lesson not found');
      }

      const hasAccess = user.isSubscribe;

      return ctx.send({
        data: {
          lessonId: id,
          hasAccess,
          lesson: {
            title: lesson.title,
            course: lesson.course
          },
          subscriptionRequired: !hasAccess
        }
      });

    } catch (error) {
      strapi.log.error('Check access error:', error);
      return ctx.internalServerError('Unable to check lesson access');
    }
  }
}));
