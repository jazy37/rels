'use strict';

/**
 * course controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::course.course', ({ strapi }) => ({
  async findPublic(ctx) {
    const { query } = ctx;
    const entities = await strapi.entityService.findMany('api::course.course', {
      ...query,
      populate: {
        lessons: {
          fields: ['id', 'documentId', 'title', 'createdAt', 'updatedAt', 'publishedAt']
          // Nie zwracamy video i videoUrl
        },
        coursePhoto: true
      }
    });
    
    // Transform to match expected format
    const transformedEntities = entities.map(entity => ({
      id: entity.id,
      documentId: entity.documentId,
      title: entity.title,
      description: entity.description,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      publishedAt: entity.publishedAt,
      lessons: entity.lessons || [],
      coursePhoto: entity.coursePhoto || []
    }));
    
    return {
      data: transformedEntities,
      meta: {
        pagination: {
          page: 1,
          pageSize: transformedEntities.length,
          pageCount: 1,
          total: transformedEntities.length
        }
      }
    };
  },

  async findOnePublic(ctx) {
    const { slug } = ctx.params;
    
    const entities = await strapi.entityService.findMany('api::course.course', {
      filters: { slug },
      populate: {
        lessons: {
          fields: ['id', 'documentId', 'title', 'createdAt', 'updatedAt', 'publishedAt']
          // Nie zwracamy video i videoUrl
        },
        coursePhoto: true
      }
    });
    
    if (entities.length === 0) {
      return ctx.notFound('Course not found');
    }
    
    const entity = entities[0];
    const transformedEntity = {
      id: entity.id,
      documentId: entity.documentId,
      title: entity.title,
      description: entity.description,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      publishedAt: entity.publishedAt,
      lessons: entity.lessons || [],
      coursePhoto: entity.coursePhoto || []
    };
    
    return {
      data: [transformedEntity],
      meta: {}
    };
  }
}));
