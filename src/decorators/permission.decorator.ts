import { ResourceService } from '@/services/resource.service'
export function AddPermssion (title, permission) {
  let once = false
  return function (target, key, descriptor) {
    if (!once) {
      const service = new ResourceService()
      service.createWithUnique({ title, permission }, 'permission').then(() => {
        once = true
      }).catch(err => { console.log(err.message) })
    }
  }
}
