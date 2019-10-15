// const exif = require('jpeg-exif')
const exif = require('exif-parser')
const fs = require('fs')

// module.exports.getMetaData = imgDir => {
//   return new Promise((resolve, reject) => {
//     try {
//       // ? Image may be broken
//       const data = exif.parseSync(imgDir)
//       resolve(data)
//     } catch (error) {
//       reject(error, 'parser')
//     }
//   })
// }

module.exports.getMetaData = imgDir => {
  return new Promise((resolve, reject) => {
    try {
      // ? Image may be broken
      const buffer = fs.readFileSync(imgDir)
      const parser = exif.create(buffer)
      const result = parser.parse()
      // const data = exif.parseSync(imgDir)
      resolve(result)
    } catch (error) {
      reject(error, 'parser')
    }
  })
}


