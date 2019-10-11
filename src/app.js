const pdfGen = require('./utils/pdfGen')
const repo = require('./repo')

repo.getqQrsInWeek()
  .then(async qirs => {
    for (let qir of qirs) {
      const controlNum = repo.getQirNumber(qir)
      const imei = await repo.getMetaDataField(qir, 'imei')
      const batchId = await repo.getMetaDataField(qir, 'batchId')
      const date = repo.getFormattedDate()
      const model = await repo.getBatchField(batchId, 'model')
      const productCode = await repo.getBatchField(batchId, 'product_code')
      const hardwareVer = await repo.getBatchField(batchId, 'hw_version')
      const plantOrigin = repo.getPlantOrigin(qir)
      const shipmentDate = await repo.getBatchField(batchId, 'shipment_date')
      const images = await repo.getImagePaths(qir)
      // console.log(imei, controlNum, date, plantOrigin, productCode, model, hardwareVer, shipmentDate)
      console.log({ imei, images })
    }
  })
  .catch(err => console.error(err))


pdfGen.createPdf()
  .then(res => {
    console.log(res)
  })
  .catch(error => {
    console.error(error)
  })