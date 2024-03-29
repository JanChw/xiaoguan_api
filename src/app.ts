import 'reflect-metadata'
import { Server } from 'http'
import { defaultMetadataStorage } from 'class-transformer'
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import { useExpressServer, getMetadataArgsStorage } from 'routing-controllers'
import { routingControllersToSpec } from 'routing-controllers-openapi'
import swaggerUi from 'swagger-ui-express'
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config'
import errorMiddleware from '@middlewares/error.middleware'
import { logger, stream } from '@utils/logger'
import authorizationChecker from '@/middlewares/authorization.middleware'
import currentUserChecker from './middlewares/currentUser.middleware'

const app = express()

export const server = new Server(app)

export class App {
  public server: Server;
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor (controllers: Function[]) {
    this.server = server
    this.app = app
    this.env = NODE_ENV || 'development'
    this.port = PORT || 3000

    this.initializeMiddlewares()
    this.initializeRoutes(controllers)
    this.initializeSwagger(controllers)
    this.initializeErrorHandling()
  }

  public listen () {
    this.server.listen(this.port, () => {
      logger.info('=================================')
      logger.info(`======= ENV: ${this.env} =======`)
      logger.info(`🚀 App listening on the port ${this.port}`)
      logger.info('=================================')
    })
  }

  public getServer () {
    return this.server
  }

  private initializeMiddlewares () {
    this.app.use(morgan(LOG_FORMAT, { stream }))
    this.app.use(hpp())
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(cookieParser())
  }

  private initializeRoutes (controllers: Function[]) {
    useExpressServer(this.app, {
      cors: {
        origin: ORIGIN,
        credentials: CREDENTIALS
      },
      controllers,
      defaultErrorHandler: false,
      authorizationChecker,
      currentUserChecker
    })
  }

  private initializeSwagger (controllers: Function[]) {
    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/'
    })

    const routingControllersOptions = {
      controllers
    }

    const storage = getMetadataArgsStorage()
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        schemas,
        securitySchemes: {
          basicAuth: {
            scheme: 'basic',
            type: 'http'
          }
        }
      },
      info: {
        description: 'Generated with `routing-controllers-openapi`',
        title: 'A sample API',
        version: '1.0.0'
      }
    })

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec))
  }

  private initializeErrorHandling () {
    this.app.use(errorMiddleware)
  }
}
