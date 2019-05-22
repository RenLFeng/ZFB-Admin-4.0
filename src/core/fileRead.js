export function readFile(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader()
    reader.onload = function(e) {
      resolve(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}
