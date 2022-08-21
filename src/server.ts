import '@/socket'
import { App } from '@/app'
import validateEnv from '@utils/validateEnv'
import { loadFiles } from '@/utils/util'

// BigInt.prototype.toJSON = function () {
//   return Number.parseInt(this.toString()) ?? this.toString()
// }

async function runApp () {
  const controllers = await loadFiles('./src/controllers', ['!(message).controller.ts'])

  validateEnv()

  const app = new App(controllers)

  app.listen()
}

runApp()
