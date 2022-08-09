export default function CatchErr () {
  return function (target, key, description) {
    const fn = description.value
    const result = fn.apply(this, arguments)
    result.catch(err => {
      console.error(err.message)
      return { data: null, message: err.message }
    })
  }
}
