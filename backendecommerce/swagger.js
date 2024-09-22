const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API',
      version: '1.0.0',
      description: 'Documentación de la API de Ecommerce Villaizan',
    },
    servers: [
      {
        url: 'http://localhost:9000',
      },
    ],
    components: {
      schemas:{
        EntidadBase: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'sub_01H8B4RD715N9ZYPE95KR76839',
            },
            creadoEn: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-01T12:00:00Z',
            },
            actualizadoEn: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-01T12:00:00Z',
            },
            desactivadoEn: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: null,
            },
            usuarioCreacion: {
              type: 'string',
              example: 'admin_user',
            },
            usuarioActualizacion: {
              type: 'string',
              nullable: true,
              example: null,
            },
            estaActivo: {
              type: 'boolean',
              example: true,
            },
          },
        },
        Subcategoria: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                nombre: {
                  type: 'string',
                  example: 'Subcategoria Ejemplo',
                },
                tipoProducto: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        example: 'tipo_01H8B4RD715N9ZYPE95KR76839',
                      },
                    },
                  },
                },
                productos: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        example: 'prod_01H8B4RD715N9ZYPE95KR76839',
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        TipoProducto: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                nombre: {
                  type: 'string',
                  example: 'TipoProducto Ejemplo',
                },
                subcategorias: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        example: 'sub_01H8B4RD715N9ZYPE95KR76839',
                      },
                    },
                  },
                },
                productos: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        example: 'prod_01H8B4RD715N9ZYPE95KR76839',
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        Producto: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                tipoProducto: {
                  $ref: '#/components/schemas/TipoProducto',
                },
                subcategorias: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Subcategoria',
                  },
                },
                frutas: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Fruta',
                  },
                },
                codigo: {
                  type: 'string',
                  example: 'PROD12345',
                },
                nombre: {
                  type: 'string',
                  example: 'Producto Ejemplo',
                },
                precioA: {
                  type: 'number',
                  format: 'decimal',
                  example: 100.0,
                },
                precioB: {
                  type: 'number',
                  format: 'decimal',
                  example: 90.0,
                },
                precioC: {
                  type: 'number',
                  format: 'decimal',
                  example: 80.0,
                },
              },
            },
          ],
        },
        Fruta: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                productos: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Producto',
                  },
                },
                contenidosEducativos: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/ContenidoEducativo',
                  },
                },
                nombre: {
                  type: 'string',
                  example: 'Fruta Ejemplo',
                },
                urlImagen: {
                  type: 'string',
                  example: 'http://example.com/imagen.jpg',
                },
                descripcion: {
                  type: 'string',
                  nullable: true,
                  example: 'Descripción de la fruta',
                },
                informacionEducativa: {
                  type: 'string',
                  nullable: true,
                  example: 'Información nutricional de la fruta',
                },
              },
            },
          ],
        },
        ContenidoEducativo: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                fruta: {
                  $ref: '#/components/schemas/Fruta',
                },
                titulo: {
                  type: 'string',
                  example: 'Contenido Educativo Ejemplo',
                },
                descripcion: {
                  type: 'string',
                  nullable: true,
                  example: 'Descripción del contenido educativo',
                },
                tipoContenido: {
                  type: 'string',
                  example: 'Video',
                },
                URLContenido: {
                  type: 'string',
                  example: 'http://example.com/contenido.mp4',
                },
                fechaPublicacion: {
                  type: 'string',
                  format: 'date-time',
                  example: '2023-10-01T12:00:00Z',
                },
              },
            },
          ],
        },
        Almacen: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                nombre: {
                  type: 'string',
                  example: 'Almacén Ejemplo',
                },
              },
            },
          ],
        },
        InventarioAlmacen: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                stock: {
                  type: 'integer',
                  example: 100,
                },
                producto: {
                  $ref: '#/components/schemas/Producto',
                },
                almacen: {
                  $ref: '#/components/schemas/Almacen',
                },
              },
            },
          ],
        },
      }
    }
  },
  apis: ['./src/api/**/**/*.ts', './src/models/*.ts'], // Adjust the paths as needed
};

const specs = swaggerJsdoc(options);


fs.writeFileSync('./swagger-output.json', JSON.stringify(specs, null, 2), 'utf-8');
console.log('Swagger JSON has been generated and saved to swagger-output.json');

// module.exports = (app) => {
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
//   app.get('/api-docs-json', (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(specs);
//   });
// };

// Optional: If you want to expose the Swagger UI and JSON endpoint
const express = require('express');
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/api-docs-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

const port = 9000;
app.listen(port, () => {
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
  console.log(`Swagger JSON available at http://localhost:${port}/api-docs-json`);
});