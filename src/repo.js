const glob = require('glob')
const exifReader = require('./utils/exifReader')
const moment = require('moment')
const axios = require('axios')
const readXlsxFile = require('read-excel-file/node')
const path = require('path')

module.exports.getAllQirs = () => {
  return new Promise((resolve, reject) => {
    glob('resources/images/**/QIR *', (err, qirPaths) => {
      if (err) { reject(err) }
      else {
        resolve(qirPaths)
      }
    })
  })
}

module.exports.getQirNumber = qirDir => {
  try {
    const splittedFilename = qirDir.split('/')
    const qirNum = splittedFilename[4].split(" ")[1]
    return qirNum
  } catch (err) {
    console.error(err)
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

module.exports.getImei = qirDir => {
  return new Promise((resolve, reject) => {
    glob(qirDir + '/*', async (err, imagePaths) => {
      if (err) { reject(err) }
      else {
        let count = 0
        const metaDataList = []
        for (const imagePath of imagePaths) {
          try {
            const metaData = await exifReader.getMetaData(imagePath)
            // metaDataList.push(metaData.SubExif.UserComment)
            metaDataList.push(metaData.tags.UserComment)
            count += 1
            if (count >= imagePaths.length) {
              const imeiList = []
              for (const userComment of metaDataList) {
                try {
                  imeiList.push((JSON.parse(userComment).imei))
                } catch (error) {
                  console.error('Unable to parse meta-data(imei): ' + imagePath)
                }
              }
              const imeiSet = new Set(imeiList)
              const imeiUniqList = Array.from(imeiSet)
              if (imeiUniqList.length === 1) {
                resolve(imeiUniqList)
              } else if (imeiUniqList.length === 2) {
                console.log('Possible IMEI mismatch issue: ' + qirDir)
                resolve(imeiUniqList)
              } else if (imeiUniqList.length === 0) {
                reject('No IMEI meta-data found on images')
              } else {
                reject('3 or more different IMEIs found in images')
              }
            }
          } catch (error) {
            reject(error + 'getMetaData')
          }
        }
      }
    })
  })
}

module.exports.getMetaDataField = (qirDir, fieldName) => {
  return new Promise((resolve, reject) => {
    glob(qirDir + '/*', async (err, imagePaths) => {
      if (err) { reject(err) }
      else {
        let count = 0
        const metaDataList = []
        for (const imagePath of imagePaths) {
          try {
            const metaData = await exifReader.getMetaData(imagePath)
            // metaDataList.push(metaData.SubExif.UserComment)
            metaDataList.push(metaData.tags.UserComment)
            count += 1
            if (count >= imagePaths.length) {
              let metaDataTags = []
              for (let userComment of metaDataList) {
                try {
                  metaDataTags.push(JSON.parse(userComment)[fieldName])
                } catch (error) {
                  console.error(`Unable to parse meta-data(${fieldName}): ` + imagePath)
                }
              }
              const metaDataTagsSet = new Set(metaDataTags)
              const metaDataTagsListUniq = Array.from(metaDataTagsSet)
              if (metaDataTagsListUniq.length === 1) {
                resolve(metaDataTags[0])
              } else if (metaDataTagsListUniq.length === 0) {
                reject(`No meta-data tag '${fieldName}' found in images`)
              } else {
                console.log(`Some images have different: ${fieldName} - ${qirDir}`)
                resolve(metaDataTags[0])
              }
            }
          } catch (error) {
            reject(error + ' getMetaData')
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
        try {
          const data = JSON.parse(res.data.replace(/&quot;/g, '"'))
          resolve(data[fieldName])
        } catch (error) {
          reject(error + ' getBatchId')
        }
      })
      .catch(err => reject(err))
  })
}

module.exports.getFormattedDate = (date = null) => {
  if (date != null) {
    return moment(date).format('MMMM DD, YYYY')
  }
  return moment().format('MMMM DD, YYYY')
}

module.exports.getFormattedInspector = rawInspector => {
  const lastname = rawInspector.split('-')[3]
  const firstname = rawInspector.split('-')[4]
  return `${firstname} ${lastname}`
}

module.exports.getFormattedControlNo = rawControlNo => {
  const year = moment().year()
  return `PETC-QIR/${year}/${rawControlNo}`
}

module.exports.getDefectDetailsAndSerialNum = (imei, qirDir) => {
  return new Promise((resolve, reject) => {
    readXlsxFile(path.join(__dirname, '..', 'resources', 'excel', 'excel.xlsx')).then(rows => {
      let index = 0
      for (let row of rows) {
        if (row[0] == imei) {
          resolve([row[1], row[2]])
          return
        }
        index += 1
        if (index >= rows.length) {
          console.log(imei + ' - Not found in excel -' + qirDir)
          reject([null, null])
        }
      }
    })
  })
}