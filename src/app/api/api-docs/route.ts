import { createSwaggerSpec } from 'next-swagger-doc';
import { NextResponse } from 'next/server';

const spec = createSwaggerSpec({
  apiFolder: 'src/app/api',
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Rent2Earn API',
      version: '1.0.0',
    },
    security: [{
      bearerAuth: [],
    }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
});

export async function GET() {
  return NextResponse.json(spec);
}