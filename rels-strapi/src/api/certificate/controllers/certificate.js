'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

module.exports = createCoreController('api::certificate.certificate', ({ strapi }) => ({
  async generateCertificate(ctx) {
    try {
      // Manual token parsing if ctx.state.user is not set
      if (!ctx.state.user) {
        const authHeader = ctx.request.header.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return ctx.unauthorized('You must be authenticated to generate certificate');
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

      const { courseId } = ctx.params;
      const userId = ctx.state.user.id;

      console.log(`Generating certificate for user ${userId}, course ${courseId}`);

      // Get course by documentId
      const courses = await strapi.entityService.findMany('api::course.course', {
        filters: { documentId: courseId },
        populate: { lessons: true }
      });

      if (courses.length === 0) {
        return ctx.notFound('Course not found');
      }

      const course = courses[0];

      // Check if course is 100% completed
      const progress = await strapi.entityService.findMany('api::user-progress.user-progress', {
        filters: {
          user: userId,
          course: course.id
        },
        populate: {
          lesson: true
        }
      });

      const completedLessons = progress.filter(p => p.completed).length;
      const totalLessons = course.lessons ? course.lessons.length : 0;

      console.log(`Progress: ${completedLessons}/${totalLessons} lessons completed`);

      if (completedLessons !== totalLessons || totalLessons === 0) {
        return ctx.badRequest('Course not completed. Cannot generate certificate.');
      }

      // Check if certificate already exists
      let certificates = await strapi.entityService.findMany('api::certificate.certificate', {
        filters: {
          user: userId,
          course: course.id
        }
      });

      let certificate;
      if (certificates.length === 0) {
        // Generate new certificate
        certificate = await strapi.entityService.create('api::certificate.certificate', {
          data: {
            user: userId,
            course: course.id,
            completedAt: new Date(),
            certificateNumber: `RELS-${Date.now()}-${userId}-${course.id}`,
            publishedAt: new Date()
          }
        });
        console.log('New certificate created:', certificate.certificateNumber);
      } else {
        certificate = certificates[0];
        console.log('Using existing certificate:', certificate.certificateNumber);
      }

      // Generate PDF certificate
      const pdfBuffer = await generatePDFCertificate({
        userName: ctx.state.user.username || ctx.state.user.email,
        courseName: course.title,
        completedAt: certificate.completedAt,
        certificateNumber: certificate.certificateNumber
      });

      // Set response headers for PDF download
      ctx.set('Content-Type', 'application/pdf');
      ctx.set('Content-Disposition', `attachment; filename="certyfikat-${course.slug || 'kurs'}.pdf"`);
      ctx.body = pdfBuffer;

    } catch (error) {
      console.error('Certificate generation error:', error);
      return ctx.internalServerError('Failed to generate certificate');
    }
  },

}));

// Define the path to the Roboto fonts - try multiple possible paths
const possibleFontDirs = [
  path.join(__dirname, '../../../fonts/Roboto/static'),
  path.join(process.cwd(), 'fonts/Roboto/static'),
  path.join(__dirname, '../../../../fonts/Roboto/static'),
  '/Users/jakub.kulesza/rels/rels-strapi/fonts/Roboto/static'
];

// Find the correct font directory
let robotoFontDir = null;
for (const dir of possibleFontDirs) {
  if (fs.existsSync(dir)) {
    robotoFontDir = dir;
    break;
  }
}

const robotoLightFontPath = robotoFontDir ? path.join(robotoFontDir, 'Roboto-Light.ttf') : null;
const robotoBoldFontPath = robotoFontDir ? path.join(robotoFontDir, 'Roboto-Bold.ttf') : null;
const robotoRegularFontPath = robotoFontDir ? path.join(robotoFontDir, 'Roboto-Regular.ttf') : null;

async function generatePDFCertificate({ userName, courseName, completedAt, certificateNumber }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4', 
        layout: 'landscape',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        bufferPages: true,
        lang: 'pl',
        tagged: true,
        info: {
          Title: 'Certyfikat RELS',
          Author: 'RELS - Real Estate Legal Solutions',
          Subject: 'Certyfikat ukończenia kursu',
          Creator: 'RELS Certificate Generator'
        },
        autoFirstPage: true,
        pdfVersion: '1.7ext3',
        compress: true, // Enable compression for smaller files
      });
      
      // Register and use Roboto fonts with Polish character support
      let useRoboto = false;
      
      if (robotoFontDir) {
        try {
          // Check if font files exist and register them
          if (robotoRegularFontPath && fs.existsSync(robotoRegularFontPath)) {
            doc.registerFont('Roboto-Regular', robotoRegularFontPath);
          }
          
          if (robotoBoldFontPath && fs.existsSync(robotoBoldFontPath)) {
            doc.registerFont('Roboto-Bold', robotoBoldFontPath);
          }
          
          if (robotoLightFontPath && fs.existsSync(robotoLightFontPath)) {
            doc.registerFont('Roboto-Light', robotoLightFontPath);
          }
          
          // Set default font to Roboto-Regular if available, otherwise Roboto-Light
          if (robotoRegularFontPath && fs.existsSync(robotoRegularFontPath)) {
            doc.font('Roboto-Regular');
            useRoboto = true;
          } else if (robotoLightFontPath && fs.existsSync(robotoLightFontPath)) {
            doc.font('Roboto-Light');
            useRoboto = true;
          } else {
            throw new Error('No Roboto fonts found');
          }
        } catch (error) {
          doc.font('Helvetica');
          useRoboto = false;
        }
      } else {
        doc.font('Helvetica');
        useRoboto = false;
      }

      // Helper function to get the right font
      const getFont = (bold = false) => {
        if (useRoboto) {
          if (bold && fs.existsSync(robotoBoldFontPath)) {
            return 'Roboto-Bold';
          } else if (fs.existsSync(robotoRegularFontPath)) {
            return 'Roboto-Regular';
          } else if (fs.existsSync(robotoLightFontPath)) {
            return 'Roboto-Light';
          }
        }
        return bold ? 'Helvetica-Bold' : 'Helvetica';
      };

      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', reject);

      // Premium Color Palette (same as website)
      const colors = {
        primary: '#606c38',      // Olive green
        primaryDark: '#283618',  // Dark green  
        cream: '#fefae0',        // Cream
        gold: '#dda15e',         // Gold
        accent: '#bc6c25'        // Bronze
      };

      // Page dimensions (A4 landscape)
      const pageWidth = 842;
      const pageHeight = 595;
      
      // Background gradient effect (simulated with rectangles)
      createGradientBackground(doc, pageWidth, pageHeight, colors);
      
      // Decorative border
      createDecorativeBorder(doc, pageWidth, pageHeight, colors);
      
      // Header with RELS branding
      createHeader(doc, pageWidth, colors, getFont);
      
      // Main content - pass data directly without conversion
      createMainContent(doc, pageWidth, pageHeight, {
        userName: userName,
        courseName: courseName,
        completedAt: new Date(completedAt).toLocaleDateString('pl-PL'),
        certificateNumber: certificateNumber
      }, colors, getFont);
      
      // Footer  
      createFooter(doc, pageWidth, pageHeight, {
        userName: userName,
        courseName: courseName,
        completedAt: new Date(completedAt).toLocaleDateString('pl-PL'),
        certificateNumber: certificateNumber
      }, colors, getFont);
      
      // Decorative elements
      createDecorativeElements(doc, pageWidth, pageHeight, colors, getFont);
      
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
}

function createGradientBackground(doc, pageWidth, pageHeight, colors) {
  // Create background gradient effect with multiple rectangles
  const steps = 20;
  const stepHeight = pageHeight / steps;
  
  for (let i = 0; i < steps; i++) {
    const opacity = 0.05 - (i * 0.002); // Fade from top to bottom
    if (opacity > 0) {
      doc.save()
         .fillColor(colors.primary)
         .fillOpacity(opacity)
         .rect(0, i * stepHeight, pageWidth, stepHeight)
         .fill()
         .restore();
    }
  }
}

function createDecorativeBorder(doc, pageWidth, pageHeight, colors) {
  // Premium border with gradient effect
  const borderWidth = 8;
  
  // Outer border - gold
  doc.save()
     .strokeColor(colors.gold)
     .lineWidth(borderWidth)
     .rect(borderWidth/2, borderWidth/2, pageWidth - borderWidth, pageHeight - borderWidth)
     .stroke()
     .restore();
  
  // Inner border - primary
  const innerBorder = borderWidth + 10;
  doc.save()
     .strokeColor(colors.primary)
     .lineWidth(3)
     .rect(innerBorder, innerBorder, pageWidth - (innerBorder * 2), pageHeight - (innerBorder * 2))
     .stroke()
     .restore();
     
  // Corner decorations
  const cornerSize = 40;
  [
    [innerBorder, innerBorder], // top-left
    [pageWidth - innerBorder - cornerSize, innerBorder], // top-right
    [innerBorder, pageHeight - innerBorder - cornerSize], // bottom-left
    [pageWidth - innerBorder - cornerSize, pageHeight - innerBorder - cornerSize] // bottom-right
  ].forEach(([x, y]) => {
    doc.save()
       .fillColor(colors.accent)
       .fillOpacity(0.3)
       .rect(x, y, cornerSize, cornerSize)
       .fill()
       .restore();
  });
}

function createHeader(doc, pageWidth, colors, getFont) {
  const centerX = pageWidth / 2;
  
  // RELS logo/brand
  doc.save()
     .fontSize(48)
     .fillColor(colors.primaryDark)
     .font(getFont(true))
     .text('RELS', centerX - 60, 80, { width: 120, align: 'center' })
     .restore();
     
  // Subtitle
  doc.save()
     .fontSize(14)
     .fillColor(colors.primary)
     .font(getFont())
     .text('Real Estate Legal Solutions', centerX - 100, 130, { width: 200, align: 'center' })
     .restore();
     
  // Decorative line under header
  doc.save()
     .strokeColor(colors.gold)
     .lineWidth(2)
     .moveTo(centerX - 150, 155)
     .lineTo(centerX + 150, 155)
     .stroke()
     .restore();
}

function createMainContent(doc, pageWidth, pageHeight, data, colors, getFont) {
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;
  
  // Main title
  doc.fontSize(42)
     .fillColor(colors.primaryDark)
     .font(getFont(true))
     .text('CERTYFIKAT UKOŃCZENIA', centerX - 250, centerY - 100, { 
       width: 500, 
       align: 'center'
     });
     
  // Decorative line under title
  doc.save()
     .strokeColor(colors.accent)
     .lineWidth(3)
     .moveTo(centerX - 200, centerY - 55)
     .lineTo(centerX + 200, centerY - 55)
     .stroke()
     .restore();
  
  // Certificate text
  doc.fontSize(18)
     .fillColor(colors.primaryDark)
     .font(getFont())
     .text('Niniejszym poświadczamy, że', centerX - 200, centerY - 20, { 
       width: 400, 
       align: 'center'
     });
  
  // User name (highlighted)
  doc.fontSize(32)
     .fillColor(colors.accent)
     .font(getFont(true))
     .text(data.userName, centerX - 250, centerY + 15, { 
       width: 500, 
       align: 'center'
     });
  
  // Course completion text
  doc.fontSize(18)
     .fillColor(colors.primaryDark)
     .font(getFont())
     .text('ukończył/a z powodzeniem kurs', centerX - 200, centerY + 60, { 
       width: 400, 
       align: 'center'
     });
  
  // Course name (highlighted)
  doc.fontSize(24)
     .fillColor(colors.primary)
     .font(getFont(true))
     .text(data.courseName, centerX - 300, centerY + 95, { 
       width: 600, 
       align: 'center'
     });
}

function createFooter(doc, pageWidth, pageHeight, data, colors, getFont) {
  const centerX = pageWidth / 2;
  const footerY = pageHeight - 120;
  
  // Date and certificate number in elegant boxes
  const boxWidth = 200;
  const boxHeight = 40;
  const boxY = footerY + 20;
  
  // Date box
  doc.save()
     .fillColor(colors.cream)
     .rect(centerX - boxWidth - 20, boxY, boxWidth, boxHeight)
     .fill()
     .strokeColor(colors.gold)
     .lineWidth(2)
     .rect(centerX - boxWidth - 20, boxY, boxWidth, boxHeight)
     .stroke()
     .restore();
     
  doc.fontSize(12)
     .fillColor(colors.primaryDark)
     .font(getFont(true))
     .text('DATA UKOŃCZENIA', centerX - boxWidth - 10, boxY + 8, { 
       width: boxWidth - 20, 
       align: 'center'
     })
     .fontSize(14)
     .font(getFont())
     .text(data.completedAt, centerX - boxWidth - 10, boxY + 22, { 
       width: boxWidth - 20, 
       align: 'center'
     });
  
  // Certificate number box
  doc.save()
     .fillColor(colors.cream)
     .rect(centerX + 20, boxY, boxWidth, boxHeight)
     .fill()
     .strokeColor(colors.gold)
     .lineWidth(2)
     .rect(centerX + 20, boxY, boxWidth, boxHeight)
     .stroke()
     .restore();
     
  doc.fontSize(12)
     .fillColor(colors.primaryDark)
     .font(getFont(true))
     .text('NUMER CERTYFIKATU', centerX + 30, boxY + 8, { 
       width: boxWidth - 20, 
       align: 'center'
     })
     .fontSize(10)
     .font(getFont())
     .text(data.certificateNumber, centerX + 30, boxY + 22, { 
       width: boxWidth - 20, 
       align: 'center'
     });
}

function createDecorativeElements(doc, pageWidth, pageHeight, colors, getFont) {
  // Premium decorative elements in corners
  const decorativeElements = [
    // Top corners - laurel-like decorations
    { x: 100, y: 100, rotation: 0 },
    { x: pageWidth - 100, y: 100, rotation: 90 },
    { x: 100, y: pageHeight - 100, rotation: -90 },
    { x: pageWidth - 100, y: pageHeight - 100, rotation: 180 }
  ];
  
  decorativeElements.forEach(({ x, y, rotation }) => {
    doc.save()
       .translate(x, y)
       .rotate(rotation)
       .fillColor(colors.gold)
       .fillOpacity(0.3)
       .circle(0, 0, 15)
       .fill()
       .fillColor(colors.accent)
       .fillOpacity(0.5)
       .circle(-10, -5, 8)
       .circle(10, -5, 8)
       .circle(-5, 10, 6)
       .circle(5, 10, 6)
       .fill()
       .restore();
  });
  
  // Central emblem/seal effect
  const sealX = pageWidth / 2;
  const sealY = pageHeight - 80;
  
  doc.save()
     .fillColor(colors.gold)
     .fillOpacity(0.2)
     .circle(sealX, sealY, 25)
     .fill()
     .strokeColor(colors.accent)
     .lineWidth(2)
     .circle(sealX, sealY, 25)
     .stroke()
     .fillColor(colors.accent)
     .fillOpacity(0.8)
     .fontSize(16)
     .font(getFont(true))
     .text('RELS', sealX - 15, sealY - 8, { width: 30, align: 'center' })
     .restore();
}

