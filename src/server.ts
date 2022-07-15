import App from '@/app'
import { AuthController } from '@controllers/auth.controller'
import { IndexController } from '@controllers/index.controller'
import { UsersController } from '@controllers/users.controller'
import { FoodsController } from '@controllers/foods.controller'
import { SpecsController } from '@controllers/specs.controller'
import { BucketsController } from '@/controllers/buckets.controller'
import { FilesController } from '@/controllers/files.controller'
import { ServicesController } from '@/controllers/services.controller'
import { BannersController } from '@/controllers/banners.controller'
import validateEnv from '@utils/validateEnv'

validateEnv()

const app = new App([
  AuthController,
  IndexController,
  UsersController,
  FoodsController,
  SpecsController,
  BucketsController,
  FilesController,
  ServicesController,
  BannersController
])
app.listen()
