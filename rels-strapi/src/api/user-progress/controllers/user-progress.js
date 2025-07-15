'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-progress.user-progress', ({ strapi }) => ({
  async updateProgress(ctx) {
    try {
      // Manual token parsing if ctx.state.user is not set
      if (!ctx.state.user) {
        const authHeader = ctx.request.header.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return ctx.unauthorized('You must be authenticated to update progress');
        }
        
        const token = authHeader.substring(7);
        try {
          const { id } = await strapi.plugins['users-permissions'].services.jwt.verify(token);
          const user = await strapi.entityService.findOne('plugin::users-permissions.user', id);
          if (!user) {
            return ctx.unauthorized('Invalid token');
          }
          ctx.state.user = user;
        } catch (error) {
          return ctx.unauthorized('Invalid token');
        }
      }

      const { lessonId, courseId, watchedDuration, totalDuration, completed } = ctx.request.body;
      const userId = ctx.state.user.id;


      if (!lessonId || !courseId) {
        return ctx.badRequest('Lesson ID and Course ID are required');
      }

      // Find existing progress record - use IDs after we resolve lesson and course
      // We'll do this after we get the lesson and course objects

      // First, verify that lesson and course exist by documentId
      const lessons = await strapi.entityService.findMany('api::lesson.lesson', {
        filters: { documentId: lessonId }
      });
      const courses = await strapi.entityService.findMany('api::course.course', {
        filters: { documentId: courseId }
      });

      if (lessons.length === 0) {
        return ctx.badRequest('Lesson not found');
      }
      if (courses.length === 0) {
        return ctx.badRequest('Course not found');
      }

      const lesson = lessons[0];
      const course = courses[0];

      // Now find existing progress record using the actual IDs
      const existingProgress = await strapi.entityService.findMany('api::user-progress.user-progress', {
        filters: {
          user: userId,
          lesson: lesson.id,
          course: course.id
        }
      });

      const progressData = {
        user: userId,
        lesson: lesson.id,
        course: course.id,
        watchedDuration: watchedDuration || 0,
        totalDuration: totalDuration || 0,
        completed: completed || false,
        lastWatchedAt: new Date()
      };

      if (completed) {
        progressData.completedAt = new Date();
      }

      let result;
      if (existingProgress.length > 0) {
        // Update existing progress
        result = await strapi.entityService.update('api::user-progress.user-progress', existingProgress[0].id, {
          data: progressData
        });
      } else {
        // Create new progress record
        result = await strapi.entityService.create('api::user-progress.user-progress', {
          data: progressData
        });
      }

      return ctx.send({ data: result });
    } catch (error) {
      console.error('Error updating progress:', error);
      return ctx.internalServerError('Failed to update progress');
    }
  },

  async getUserProgress(ctx) {
    try {
      // Check if user is authenticated
      if (!ctx.state.user) {
        return ctx.unauthorized('You must be authenticated to get progress');
      }

      const userId = ctx.state.user.id;
      const { courseId } = ctx.params;

      const filters = {
        user: userId
      };

      if (courseId) {
        filters.course = courseId;
      }

      const progress = await strapi.entityService.findMany('api::user-progress.user-progress', {
        filters,
        populate: {
          lesson: true,
          course: true
        }
      });

      return ctx.send({ data: progress });
    } catch (error) {
      console.error('Error getting user progress:', error);
      return ctx.internalServerError('Failed to get user progress');
    }
  },

  async getCourseProgress(ctx) {
    try {
      // Manual token parsing if ctx.state.user is not set
      if (!ctx.state.user) {
        const authHeader = ctx.request.header.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return ctx.unauthorized('You must be authenticated to get course progress');
        }
        
        const token = authHeader.substring(7);
        try {
          const { id } = await strapi.plugins['users-permissions'].services.jwt.verify(token);
          const user = await strapi.entityService.findOne('plugin::users-permissions.user', id);
          if (!user) {
            return ctx.unauthorized('Invalid token');
          }
          ctx.state.user = user;
        } catch (error) {
          return ctx.unauthorized('Invalid token');
        }
      }

      const userId = ctx.state.user.id;
      const { courseId } = ctx.params;


      if (!courseId) {
        return ctx.badRequest('Course ID is required');
      }

      // Get all lessons for the course by documentId
      const courses = await strapi.entityService.findMany('api::course.course', {
        filters: { documentId: courseId },
        populate: {
          lessons: true
        }
      });


      if (courses.length === 0) {
        return ctx.notFound('Course not found');
      }

      const course = courses[0];

      // Get user progress for this course using the actual course ID
      const progress = await strapi.entityService.findMany('api::user-progress.user-progress', {
        filters: {
          user: userId,
          course: course.id
        },
        populate: {
          lesson: true
        }
      });


      // Calculate progress statistics
      const totalLessons = course.lessons ? course.lessons.length : 0;
      const completedLessons = progress.filter(p => p.completed).length;
      
      // Safe sorting with null check
      let lastWatchedLesson = null;
      if (progress.length > 0) {
        const validProgress = progress.filter(p => p.lastWatchedAt);
        
        if (validProgress.length > 0) {
          lastWatchedLesson = validProgress
            .sort((a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt))[0];
        }
      }

      return ctx.send({
        data: {
          course: {
            id: course.id,
            title: course.title,
            slug: course.slug
          },
          totalLessons,
          completedLessons,
          progressPercentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
          lastWatchedLesson: lastWatchedLesson ? {
            progressId: lastWatchedLesson.id,
            lastWatchedAt: lastWatchedLesson.lastWatchedAt
          } : null,
          lessons: progress
        }
      });
    } catch (error) {
      console.error('Error getting course progress:', error);
      return ctx.internalServerError('Failed to get course progress');
    }
  }
}));