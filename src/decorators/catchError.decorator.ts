export default function CatchError () {
  return function (target: any) {
    const pro = target.prototype
    const keys = Object.keys(pro)
    // const metadata = Reflect.getMetadataKeys(target)
    // console.log(metadata)
    console.log('===================')
    keys.forEach(key => {
      const fun = pro[key]
      if (fun instanceof Function) {
        pro[key] = function () {
          const result = fun.apply(this, arguments)
          console.log(arguments)
          return result.catch((err: Error) => {
            console.log('-----------------')
            console.log(err.message)
            console.log('-----------------')
            // return { status: err.httpCode || 500, data: null, message: err.message }
          })
        }
      }
    })
  }
}
