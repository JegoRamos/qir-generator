const pdfGen = require('./utils/pdfGen')
const repo = require('./repo')

repo.getAllQirs()
  .then(async qirs => {
    for (let qir of qirs) {
      try {
        const rawControlNo = repo.getQirNumber(qir)
        const controlNo = repo.getFormattedControlNo(rawControlNo)
        const imei = await repo.getImei(qir)
        const batchId = await repo.getMetaDataField(qir, 'batchId')
        const rawInspector = await repo.getMetaDataField(qir, 'inspector')
        const inspector = repo.getFormattedInspector(rawInspector)
        const date = repo.getFormattedDate()
        const model = await repo.getBatchField(batchId, 'model')
        const productCode = await repo.getBatchField(batchId, 'product_code')
        const hardwareVer = await repo.getBatchField(batchId, 'hw_version')
        const network = await repo.getBatchField(batchId, 'network')
        const ap = await repo.getBatchField(batchId, 'ap')
        const cp = await repo.getBatchField(batchId, 'cp')
        const csc = await repo.getBatchField(batchId, 'csc')
        // const plantOrigin = await repo.getBatchField(batchId, 'origin')
        const rawDate = await repo.getBatchField(batchId, 'shipment_date')
        const shipmentDate = repo.getFormattedDate(rawDate)
        const images = await repo.getImagePaths(qir)
        const defectDetails = await repo.getMetaDataField(qir, 'defectDetails')
        const serialNo = await repo.getMetaDataField(qir, 'serialNo')
        const plantOrigin = repo.getPlantOrigin(serialNo)

        const docDetails = {
          controlNo, imei, batchId, date, model, productCode,
          hardwareVer, plantOrigin, shipmentDate, images,
          inspector, defectDetails, serialNo, network,
          softwareVer: {
            ap, csc, cp
          }
        }
        const res = await pdfGen.createPdf(docDetails)
        console.log(res)
      } catch (error) {
        console.error(`${error} - ${qir}`)
      }
    }
  })
  .catch(err => console.error(err))
