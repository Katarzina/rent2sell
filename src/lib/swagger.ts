export const getApiDocs = () => {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Rent2Earn API',
      version: '1.0.0',
      description: 'API documentation for Rent2Earn platform'
    },
    servers: [
      {
        url: typeof window !== 'undefined'
          ? window.location.origin
          : 'http://localhost:3000',
        description: 'Local server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        RentalItem: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            category: { 
              type: 'string',
              enum: ['BOATS', 'EQUIPMENT', 'FASHION', 'ELECTRONICS', 'SPORTS', 'PARTY', 'TRAVEL', 'OTHER']
            },
            price: { type: 'number' },
            image: { 
              type: 'array',
              items: { type: 'string' }
            },
            condition: { 
              type: 'string',
              enum: ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR']
            },
            location: { type: 'string' },
            features: { 
              type: 'array',
              items: { type: 'string' }
            },
            description: { type: 'string' },
            minRentDays: { type: 'integer' },
            maxRentDays: { type: 'integer' },
            deposit: { type: 'number' }
          },
          required: ['title', 'category', 'price', 'condition', 'location']
        }
      }
    },
    paths: {
      '/api/auth/token': {
        post: {
          tags: ['Authentication'],
          summary: 'Get JWT token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'JWT token obtained successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                      user: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          email: { type: 'string' },
                          name: { type: 'string' },
                          role: { type: 'string', enum: ['USER', 'ADMIN'] }
                        }
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Invalid credentials'
            }
          }
        }
      },
      '/api/rental-items': {
        get: {
          tags: ['RentalItems'],
          summary: 'Get all rental items',
          responses: {
            '200': {
              description: 'List of rental items',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/RentalItem'
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['RentalItems'],
          summary: 'Create a new rental item',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RentalItem'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Rental item created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/RentalItem'
                  }
                }
              }
            },
            '401': {
              description: 'Unauthorized'
            }
          }
        }
      }
    }
  }
}