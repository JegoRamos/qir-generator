const exif = require('exif-parser')
const fs = require('fs')

module.exports.getMetaData = imgDir => {
  return new Promise((resolve, reject) => {
    try {
      // ? Image may be broken
      const buffer = fs.readFileSync(imgDir)
      const parser = exif.create(buffer)
      const result = parser.parse()
      resolve(result)
    } catch (error) {
      reject(error, 'parser')
    }
  })
}


