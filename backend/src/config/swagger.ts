import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Assalio API',
      version: '1.0.0',
      description: 'API complète pour gérer les factures, clients et utilisateurs avec Assalio',
      contact: {
        name: 'Support',
        email: 'support@assalio.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur local',
      },
      {
        url: 'https://api.assalio.com',
        description: 'Serveur production',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Bearer Token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            companyName: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Invoice: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            invoiceNumber: { type: 'string' },
            customerId: { type: 'string' },
            total: { type: 'number' },
            status: { type: 'string', enum: ['DRAFT', 'SENT', 'PAID', 'OVERDUE'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
