const glob = require('glob')
const exifReader = require('./utils/exifReader')
const moment = require('moment')
const axios = require('axios')

module.exports.getqQrsInWeek = () => {
  return new Promise((resolve, reject) => {
    glob('resources/images/*', (err, weekDirs) => {
      let iter = 0
      let qirList = []
      if (err) { reject(err) }
      else {
        weekDirs.forEach(weekDir => {
          glob(weekDir + '/*', (err, plantOrigins) => {
            if (err) { reject(err) }
            else {
              plantOrigins.forEach(plantOrigin => {
                glob(plantOrigin + '/*', (err, models) => {
                  if (err) { reject(err) }
                  else {
                    models.forEach(model => {
                      glob(model + '/*', (err, qirs) => {
                        if (err) { reject(err) }
                        else {
                          qirList.push(...qirs)
                          iter += 1
                          if (iter >= plantOrigins.length) {
                            resolve(qirList)
                          }
                        }
                      })
                    })
                  }
                })
              })
            }
          })
        })
      }
    })
  })
}

module.exports.getQirNumber = qirDir => {
  try {
    const splittedFilename = qirDir.split('/')
    const qirNum = splittedFilename[5].split(" ")[1]
    return qirNum
  } catch (err) {
    console.err(err)
    return -1
  }
}

module.exports.getImagePaths = qirDir => {
  return new Promise((resolve, reject) => {
    glob(qirDir + '/*', (err, imagePaths) => {
      if (err) { reject(err) }
      else {
        resolve(imagePaths)
      }
    })
  })
}

module.exports.getPlantOrigin = qirDir => {
  try {
    return qirDir.split('/')[3]
  } catch (err) {
    console.err(err)
    return -1
  }
}

module.exports.getMetaDataField = (qirDir, fieldName) => {
  return new Promise((resolve, reject) => {
    glob(qirDir + '/*', async (err, imagePaths) => {
      if (err) { reject(err) }
      else {
        let count = 0
        const metaDataList = []
        for (const imagePath of imagePaths) {
          const metaData = await exifReader.getMetaData(imagePath)
          metaDataList.push(metaData.SubExif.UserComment)
          count += 1
          if (count >= imagePaths.length) {
            let imeiList = []
            for (let userComment of metaDataList) {
              imeiList.push(JSON.parse(userComment)[fieldName])
            }
            if (imeiList.every((val, i, arr) => val == arr[0])) {
              resolve(imeiList[0])
            } else {
              reject(`Some images have different IMEIs: ${qirDir}`)
            }
          }
        }
      }
    })
  })
}

module.exports.getBatchField = (batchId, fieldName) => {
  return new Promise((resolve, reject) => {
    const BASE_URL = 'http://13.229.230.121/batch?id='
    axios.get(BASE_URL + batchId)
      .then(res => {
        const data = JSON.parse(res.data.replace(/&quot;/g, '"'))
        resolve(data[fieldName])
      })
      .catch(err => reject(err))
  })
}

module.exports.getFormattedDate = () => {
  return moment().format('MMMM DD, YYYY')
}