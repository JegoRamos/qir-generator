const exif = require('jpeg-exif')

module.exports.getMetaData = imgDir => {
  return new Promise((resolve, reject) => {
    exif.parse(imgDir, (err, data) => {
      if (err) { reject(err) }
      else {
        resolve(data)
      }
    })
  })
}