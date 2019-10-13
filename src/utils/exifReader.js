const exif = require('jpeg-exif')

module.exports.getMetaData = imgDir => {
  return new Promise((resolve, reject) => {
    try {
      // ? Image may be broken
      const data = exif.parseSync(imgDir)
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
}