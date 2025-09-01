export const getApiDocs = () => {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Rent2Earn API',
      version: '1.0.0',
      description: 'API documentation for Rent2Earn platform.\n\nThis API uses NextAuth.js for authentication. Some endpoints require authentication with specific roles:\n- **USER**: Basic user role for rentals and favorites\n- **ADMIN**: Full access to all resources'
    },
    servers: [
      {
        url: typeof window !== 'undefined'
          ? window.location.origin
          : (process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    paths: {
      '/api/auth/signin': {
        post: {
          tags: ['Authentication'],
          summary: 'Sign in user',
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
            200: {
              description: 'User logged in successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      email: { type: 'string' },
                      role: { type: 'string', enum: ['USER', 'ADMIN'] },
                      accessToken: { type: 'string' }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Invalid credentials'
            },
            500: {
              description: 'Server error'
            }
          }
        }
      },
      '/api/auth/signup': {
        post: {
          tags: ['Authentication'],
          summary: 'Create new user account',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', minLength: 2 },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'User created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      email: { type: 'string' },
                      role: { type: 'string', enum: ['USER', 'ADMIN'] }
                    }
                  }
                }
              }
            },
            400: {
              description: 'User already exists or invalid input'
            },
            500: {
              description: 'Server error'
            }
          }
        }
      },
      '/api/rental-items': {
        get: {
          tags: ['RentalItems'],
          summary: 'Get all rental items',
          description: 'Retrieve a list of all rental items',
          responses: {
            200: {
              description: 'List of rental items',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/RentalItem' }
                  }
                }
              }
            },
            500: {
              description: 'Internal server error'
            }
          }
        },
        post: {
          tags: ['RentalItems'],
          summary: 'Create a new rental item',
          description: 'Create a new rental item (requires authentication)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RentalItem' }
              }
            }
          },
          responses: {
            201: {
              description: 'Rental item created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/RentalItem' }
                }
              }
            },
            401: {
              description: 'Unauthorized'
            },
            500: {
              description: 'Internal server error'
            }
          }
        }
      },
      '/api/rental-items/{id}': {
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID of the rental item',
            required: true,
            schema: {
              type: 'integer'
            }
          }
        ],
        get: {
          tags: ['RentalItems'],
          summary: 'Get rental item by ID',
          description: 'Retrieve a single rental item by its ID',
          responses: {
            200: {
              description: 'Rental item found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/RentalItem' }
                }
              }
            },
            404: {
              description: 'Rental item not found'
            },
            500: {
              description: 'Internal server error'
            }
          }
        },
        patch: {
          tags: ['RentalItems'],
          summary: 'Update rental item',
          description: 'Update an existing rental item (requires authentication)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RentalItem' }
              }
            }
          },
          responses: {
            200: {
              description: 'Rental item updated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/RentalItem' }
                }
              }
            },
            401: {
              description: 'Unauthorized'
            },
            404: {
              description: 'Rental item not found'
            },
            500: {
              description: 'Internal server error'
            }
          }
        },
        delete: {
          tags: ['RentalItems'],
          summary: 'Delete rental item',
          description: 'Delete an existing rental item (requires authentication)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Rental item deleted successfully'
            },
            401: {
              description: 'Unauthorized'
            },
            404: {
              description: 'Rental item not found'
            },
            500: {
              description: 'Internal server error'
            }
          }
        }
      }
    },
    components: {
      schemas: {
        RentalItem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
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
            available: { type: 'boolean' },
            rating: { type: 'number' },
            location: { type: 'string' },
            features: { 
              type: 'array',
              items: { type: 'string' }
            },
            description: { type: 'string' },
            minRentDays: { type: 'integer' },
            maxRentDays: { type: 'integer' },
            deposit: { type: 'number' },
            rules: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            userId: { type: 'string' }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'next-auth.session-token'
        }
      }
    }
  }
}