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
              readOnly: true,
            },
            creadoEn: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-01T12:00:00Z',
              readOnly: true,
            },
            actualizadoEn: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-01T12:00:00Z',
              readOnly: true,
            },
            desactivadoEn: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: null,
              readOnly: true,
            },
            usuarioCreacion: {
              type: 'string',
              example: 'admin_user',
              readOnly: true,
            },
            usuarioActualizacion: {
              type: 'string',
              nullable: true,
              example: null,
              readOnly: true,
            },
            estaActivo: {
              type: 'boolean',
              example: true,
              readOnly: true,
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
                  nullable: true,
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
                  nullable: true,
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
                  nullable: true,
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
                  nullable: true,
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
                  nullable: true,
                },
                subcategorias: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Subcategoria',
                  },
                  nullable: true,
                },
                frutas: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Fruta',
                  },
                  nullable: true,
                },
                codigo: {
                  type: 'string',
                  example: 'PROD12345',
                  nullable: true,
                },
                nombre: {
                  type: 'string',
                  example: 'Producto Ejemplo',
                },
                precioA: {
                  type: 'number',
                  format: 'decimal',
                  example: 100.0,
                  nullable: true,
                },
                precioB: {
                  type: 'number',
                  format: 'decimal',
                  example: 90.0,
                  nullable: true,
                },
                precioC: {
                  type: 'number',
                  format: 'decimal',
                  example: 80.0,
                  nullable: true,
                },
                precioEcommerce: {
                  type: 'number',
                  format: 'decimal',
                  example: 85.0,
                  nullable: true,
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
                  nullable: true,
                },
                contenidosEducativos: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/ContenidoEducativo',
                  },
                  nullable: true,
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
                  nullable: true,
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
                  nullable: true,
                },
                almacen: {
                  $ref: '#/components/schemas/Almacen',
                  nullable: true,
                },
              },
            },
          ],
        },
        Ubicacion: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                latitud: {
                  type: 'number',
                  format: 'decimal',
                  example: 40.712776,
                },
                longitud: {
                  type: 'number',
                  format: 'decimal',
                  example: -74.005974,
                },
                direcciones: {
                  type: 'array',
                  nullable: true,
                  items: {
                    $ref: '#/components/schemas/Direccion',
                  },
                },
              },
            },
          ],
        },
        Ciudad: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                nombre: {
                  type: 'string',
                  example: 'Moyobamba',
                },
                region: {
                  type: 'string',
                  example: 'San Martín',
                },
                direcciones: {
                  type: 'array',
                  nullable: true,
                  items: {
                    $ref: '#/components/schemas/Direccion',
                  },
                  nullable: true,
                },
              },
            },
          ],
        },
        Motorizado: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                placa: {
                  type: 'string',
                  example: 'ABC-1234',
                },
                urlImagen: {
                  type: 'string',
                  example: 'http://example.com/imagen.jpg',
                },
                almacen: {
                  $ref: '#/components/schemas/Almacen',
                },
                inventarios: {
                  type: 'array',
                  nullable: true,
                  items: {
                    $ref: '#/components/schemas/InventarioMotorizado',
                  },
                },
                pedidos: {
                  type: 'array',
                  nullable: true,
                  items: {
                    $ref: '#/components/schemas/Pedido',
                  },
                  nullable: true,
                },
              },
            },
          ],
        },
        Direccion: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                calle: {
                  type: 'string',
                  example: 'Calle Ejemplo',
                },
                numeroExterior: {
                  type: 'string',
                  example: '123',
                },
                numeroInterior: {
                  type: 'string',
                  nullable: true,
                  example: 'A',
                },
                distrito: {
                  type: 'string',
                  example: 'distrito Ejemplo',
                },
                codigoPostal: {
                  type: 'string',
                  example: '12345',
                },
                referencia: {
                  type: 'string',
                  nullable: true,
                  example: 'Cerca del parque',
                },
                ciudad: {
                  $ref: '#/components/schemas/Ciudad',
                },
                ubicacion: {
                  $ref: '#/components/schemas/Ubicacion',
                },
              },
            },
          ],
        },
        InventarioMotorizado: {
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
                stockMinimo: {
                  type: 'integer',
                  example: 10,
                },
                esMerma: {
                  type: 'boolean',
                  example: false,
                },
                motivoMerma: {
                  type: 'string',
                  nullable: true,
                  example: 'Producto dañado',
                },
                urlImagenMerma: {
                  type: 'string',
                  nullable: true,
                  example: 'http://example.com/imagen-merma.jpg',
                },
                motorizado: {
                  $ref: '#/components/schemas/Motorizado',
                },
                producto: {
                  $ref: '#/components/schemas/Producto',
                },
              },
            },
          ],
        },
        Banco: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                nombre: {
                  type: 'string',
                  example: 'Banco Ejemplo',
                },
              },
            },
          ],
        },
        Promocion: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                nombre: {
                  type: 'string',
                  example: 'Promoción Ejemplo',
                },
              },
            },
          ],
        },
        DetallePedido: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                cantidad: {
                  type: 'integer',
                  example: 5,
                },
                subtotal: {
                  type: 'number',
                  format: 'decimal',
                  example: 150.0,
                },
                producto: {
                  $ref: '#/components/schemas/Producto',
                },
                pedido: {
                  $ref: '#/components/schemas/Pedido',
                },
              },
            },
          ],
        },
        Igv: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                porcentaje: {
                  type: 'number',
                  format: 'decimal',
                  example: 18.00,
                },
              },
            },
          ],
        },
        LibroReclamaciones: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                fechaIncidente: {
                  type: 'string',
                  format: 'date-time',
                  example: '2023-10-01T12:00:00Z',
                },
                nombres: {
                  type: 'string',
                  example: 'Juan',
                },
                apellidos: {
                  type: 'string',
                  example: 'Pérez',
                },
                correo: {
                  type: 'string',
                  example: 'juan.perez@example.com',
                },
                telefono: {
                  type: 'string',
                  example: '123456789',
                  nullable: true,
                },
                tipoDoc: {
                  type: 'string',
                  example: 'DNI',
                },
                nrDocumento: {
                  type: 'string',
                  example: '12345678',
                },
                menor: {
                  type: 'boolean',
                  example: false,
                },
                departamento: {
                  type: 'string',
                  example: 'Lima',
                },
                provincia: {
                  type: 'string',
                  example: 'Lima',
                },
                distrito: {
                  type: 'string',
                  example: 'Miraflores',
                },
                direccion: {
                  type: 'string',
                  example: 'Av. Ejemplo 123',
                },
                tipo: {
                  type: 'string',
                  example: 'Reclamo',
                },
                montoReclamado: {
                  type: 'number',
                  format: 'decimal',
                  example: 150.00,
                },
                descripcion: {
                  type: 'string',
                  example: 'Descripción del reclamo',
                },
                reclamacion: {
                  type: 'string',
                  example: 'Reclamo',
                },
                nrPedido: {
                  type: 'string',
                  example: 'PED12345',
                  nullable: true,
                },
                fechaPedido: {
                  type: 'string',
                  format: 'date-time',
                  example: '2023-10-01T12:00:00Z',
                  nullable: true,
                },
                detalle: {
                  type: 'string',
                  example: 'Detalle del reclamo',
                  nullable: true,
                },
                pedidoConcreto: {
                  type: 'string',
                  example: 'Pedido concreto del reclamo',
                  nullable: true,
                },
                urlComprobante: {
                  type: 'string',
                  example: 'http://example.com/comprobante.jpg',
                  nullable: true,
                },
                accionesProveedor: {
                  type: 'string',
                  example: 'Acciones tomadas por el proveedor',
                  nullable: true,
                },
                estaActivo: {
                  type: 'boolean',
                  example: true,
                },
                usuarioCreacion: {
                  type: 'string',
                  example: 'admin_user',
                },
                usuarioActualizacion: {
                  type: 'string',
                  example: 'admin_user',
                  nullable: true,
                },
              },
            },
          ],
        },
        MetodoPago: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                nombre: {
                  type: 'string',
                  example: 'Tarjeta de Crédito',
                },
                pedidos: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Pedido',
                  },
                },
              },
            },
          ],
        },
        OrdenSerie: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                nombre: {
                  type: 'string',
                  example: 'Serie1',
                },
                descripcion: {
                  type: 'string',
                  example: 'Descripción de la serie de orden',
                  nullable: true,
                },
              },
            },
          ],
        },
        Pago: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                esTransferencia: {
                  type: 'boolean',
                  example: true,
                },
                montoCobrado: {
                  type: 'number',
                  format: 'decimal',
                  example: 150.00,
                },
                numeroOperacion: {
                  type: 'string',
                  example: 'OP123456',
                  nullable: true,
                },
                urlEvidencia: {
                  type: 'string',
                  example: 'http://example.com/evidencia.jpg',
                  nullable: true,
                },
                codigoTransaccion: {
                  type: 'string',
                  example: 'TX1234567890',
                  nullable: true,
                },
                venta: {
                  $ref: '#/components/schemas/Venta',
                },
                metodoPago: {
                  $ref: '#/components/schemas/MetodoPago',
                },
                banco: {
                  $ref: '#/components/schemas/Banco',
                },
                pedido: {
                  $ref: '#/components/schemas/Pedido',
                },
              },
            },
          ],
        },
        Pedido: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                estado: {
                  type: 'string',
                  enum: ['carrito', 'solicitado', 'verificado', 'enProgreso', 'entregado', 'cancelado'],
                  example: 'enProgreso',
                },
                prioridadEntrega: {
                  type: 'string',
                  example: 'Alta',
                  nullable: true,
                },
                total: {
                  type: 'number',
                  format: 'decimal',
                  example: 250.00,
                },
                puntosOtorgados: {
                  type: 'integer',
                  example: 10,
                },
                motivoCancelacion: {
                  type: 'string',
                  example: 'Cliente canceló el pedido',
                  nullable: true,
                },
                codigoSeguimiento: {
                  type: 'string',
                  example: 'TRACK123456',
                  nullable: true,
                },
                montoEfectivoPagar: {
                  type: 'number',
                  format: 'decimal',
                  example: 50.00,
                  nullable: true,
                },
                motorizado: {
                  $ref: '#/components/schemas/Motorizado',
                },
                direccion: {
                  $ref: '#/components/schemas/Direccion',
                },
                metodosPago: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/MetodoPago',
                  },
                },
                pagos: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Pago',
                  },
                },
                urlEvidencia: {
                  type: 'string',
                  example: 'http://example.com/evidencia.jpg',
                  nullable: true,
                },
              },
            },
          ],
        },
        Venta: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                tipoComprobante: {
                  type: 'string',
                  example: 'Factura',
                },
                fechaVenta: {
                  type: 'string',
                  format: 'date-time',
                  example: '2023-10-01T12:00:00Z',
                },
                numeroComprobante: {
                  type: 'string',
                  example: 'FAC123456',
                },
                montoTotal: {
                  type: 'number',
                  format: 'decimal',
                  example: 500.00,
                },
                totalPaletas: {
                  type: 'integer',
                  example: 10,
                },
                totalMafelitas: {
                  type: 'integer',
                  example: 5,
                },
                estado: {
                  type: 'string',
                  example: 'Completado',
                },
                totalIgv: {
                  type: 'number',
                  format: 'decimal',
                  example: 90.00,
                },
                pedido: {
                  $ref: '#/components/schemas/Pedido',
                },
                ordenSerie: {
                  $ref: '#/components/schemas/OrdenSerie',
                },
              },
            },
          ],
        },
        Persona: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                tipoDocumento: {
                  type: 'string',
                  example: 'DNI',
                },
                numeroDocumento: {
                  type: 'string',
                  example: '12345678',
                },
                razonEliminacion: {
                  type: 'string',
                  nullable: true,
                  example: 'Duplicated entry',
                },
                estado: {
                  type: 'string',
                  example: 'Active',
                },
              },
            },
          ],
        },
        Usuario: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                nombre: {
                  type: 'string',
                  example: 'John',
                },
                apellido: {
                  type: 'string',
                  example: 'Doe',
                },
                conCuenta: {
                  type: 'boolean',
                  example: true,
                },
                numeroTelefono: {
                  type: 'string',
                  nullable: true,
                  example: '123456789',
                },
                correo: {
                  type: 'string',
                  example: 'john.doe@example.com',
                },
                contrasena: {
                  type: 'string',
                  example: 'password123',
                },
                fechaUltimoLogin: {
                  type: 'string',
                  format: 'date-time',
                  nullable: true,
                  example: '2023-10-01T12:00:00Z',
                },
                persona: {
                  $ref: '#/components/schemas/Persona',
                },
              },
            },
          ],
        },
        HistorialRepartidor: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              properties: {
                estado: {
                  type: 'string',
                  example: 'Entregado',
                },
                razonDeRechazo: {
                  type: 'string',
                  nullable: true,
                  example: 'Cliente no disponible',
                },
                motorizado: {
                  $ref: '#/components/schemas/Motorizado',
                },
                usuario: {
                  $ref: '#/components/schemas/Usuario',
                },
                pedido: {
                  $ref: '#/components/schemas/Pedido',
                }
              },
            },
          ],
        },
        Notificacion: {
          type: 'object',
          allOf: [
            { $ref: '#/components/schemas/EntidadBase' },
            {
              type: 'object',
              asunto: {
                type: 'string',
                example: 'Nueva notificación',
              },
              descripcion: {
                type: 'string',
                example: 'Mensaje de la notificación',
              },
              leido: {
                type: 'boolean',
                example: false,
              },
              tipoNotificacion: {
                type: 'string',
                example: 'Información',
              },
              sistema: {
                type: 'string',
                example: 'Ecommerce',
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