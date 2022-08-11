import '@/socket'
import { App } from '@/app'
import validateEnv from '@utils/validateEnv'
import { loadFiles } from '@/utils/util'

async function runApp () {
  const controllers = await loadFiles('./src/controllers', ['!(message|orders|carts).controller.ts'])

  validateEnv()

  const app = new App(controllers)

  app.listen()
}

runApp()
