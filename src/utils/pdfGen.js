const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

module.exports.createPdf = () => {
  return new Promise((resolve, reject) => {
    try {
      const docDetails = {
        inspector: 'Jeg Ramos',
        network: 'SMA',
        date: 'November 1, 2019',
        controlNo: 'PETC-QIR/2019/07',
        model: 'SM-G970X',
        productCode: 'SM-G970XPROD',
        imei: '9405803009345',
        serialNo: '7684F99340F992',
        plantOrigin: 'PLANT',
        shipmentDate: 'June 4, 1997',
        softwareVer: {
          ap: 'APG970XLLAJJDOEJJFA',
          cp: 'CP9900JFHHGLLDSDFDD',
          csc: 'CSC9993485345080KO'
        },
        hardwareVer: 'REV 02',
        defectDetails: 'Scratch on back',
        images: [
          //'C:\\Users\\Blackpearl\\Desktop\\images.jpeg',
          'C:\\Users\\Blackpearl\\Desktop\\sample.jpg',
          'C:\\Users\\Blackpearl\\Desktop\\358244105520888_20190126_170639_92890358233407929.jpg',
          'C:\\Users\\Blackpearl\\Desktop\\358244105520888_20190126_170655_366305818061140044.jpg',
          'C:\\Users\\Blackpearl\\Desktop\\358244105520888_20190126_170717_6638663218806774812.jpg',
        ]
      }

      const FONT_BOLD = path.join(__dirname, '../../', 'resources', 'fonts', 'ArialCEBold.ttf')
      const FONT_NORMAL = path.join(__dirname, '../../', 'resources', 'fonts', 'ArialCE.ttf')
      const FONT_ITALICS = path.join(__dirname, '../../', 'resources', 'fonts', 'ArialCEItalic.ttf')
      const rawData = fs.readFileSync(path.join(__dirname, '../../', 'config/pre-def.json'))
      const PRE_DEF = JSON.parse(rawData)

      // Create a document
      const doc = new PDFDocument({
        autoFirstPage: false
      })

      // Pipe its output somewhere, like to a file or HTTP response
      doc.pipe(fs.createWriteStream('output.pdf'))

      // add page
      doc.addPage({
        margins: {
          top: 35,
          bottom: 20,
          right: 35,
          left: 35
        }
      })

      // ? Title
      doc
        .font(FONT_BOLD)
        .fontSize(14)
        .text('QUALITY INSPECTION REPORT / TECHNICAL REPORT', {
          align: 'center'
        })

      doc
        .font(FONT_NORMAL)
        .fontSize(12)
        .text('Product Engineering & Technical Compliance - HHP SEPCO', 35, 50, {
          align: 'center'
        })

      // ? QC Inspector
      doc.moveDown(2).font(FONT_BOLD).fontSize(10).text('QC INSPECTOR:  ', { continued: true })
        .font(FONT_NORMAL).text(docDetails.inspector)

      // ? DATE
      doc.moveUp().font(FONT_BOLD).text('DATE:  ', 370, undefined, { continued: true })
        .font(FONT_NORMAL).text(docDetails.date)

      // ? NETWORK
      doc.moveDown().font(FONT_BOLD).text('NETWORK:  ', 35, undefined, { continued: true })
        .font(FONT_NORMAL).text(docDetails.network)

      // ? CONTROL NO
      doc.moveUp().font(FONT_BOLD).text('CONTROL NO:  ', 370, undefined, { continued: true })
        .font(FONT_NORMAL).text(docDetails.controlNo)

      // ? PRODUCT INFORMATION
      doc.moveDown(3).font(FONT_BOLD).fontSize(12).text('PRODUCT INFORMATION', 35, undefined, { align: 'center' })

      // ? MODEL
      doc.moveDown(2).fontSize(10).text('MODEL:  ', 35, undefined, { continued: true })
        .font(FONT_NORMAL).text(docDetails.model)

      // ? SOFTWARE VERSION
      doc.moveUp().font(FONT_BOLD).text('SW VERSION: ', 370, undefined)

      // ? PRODUCT CODE
      doc.moveDown().font(FONT_BOLD).text('PRODUCT CODE:  ', 35, undefined, { continued: true })
        .font(FONT_NORMAL).text(docDetails.productCode)

      // ? AP
      doc.moveUp().font(FONT_BOLD).text('AP:  ', 390, undefined, { continued: true })
        .font(FONT_NORMAL).text(docDetails.softwareVer.ap)

      // ? IMEI
      doc.moveDown().font(FONT_BOLD).text('IMEI:  ', 35, undefined, { continued: true })
        .font(FONT_NORMAL).text(docDetails.imei)

      // ? CP
      doc.moveUp().font(FONT_BOLD).text('CP:  ', 390, undefined, { continued: true })
        .font(FONT_NORMAL).text(docDetails.softwareVer.cp)

      // ? SERIAL NO
      doc.moveDown().font(FONT_BOLD).text('SERIAL NO:  ', 35, undefined, { continued: true })
        .font(FONT_NORMAL).text(docDetails.serialNo)

      // ? CSC
      doc.moveUp().font(FONT_BOLD).text('CSC:  ', 390, undefined, { continued: true })
        .font(FONT_NORMAL).text(docDetails.softwareVer.csc)

      // ? PLANT/ORIGIN
      doc.moveDown().font(FONT_BOLD).text('PLANT/ORIGIN:  ', 35, undefined, { continued: true })
        .font(FONT_NORMAL).text(docDetails.plantOrigin)

      // ? SHIPMENT DATE
      doc.moveDown().font(FONT_BOLD).text('SHIPMENT DATE:  ', 35, undefined, { continued: true })
        .font(FONT_NORMAL).text(docDetails.shipmentDate)

      // ? INITIAL ASSESSMENT
      doc.moveDown(3).font(FONT_BOLD).fontSize(12).text('INITIAL ASSESSMENT', 35, undefined, { align: 'center' })

      // ? DEFECT DETAILS
      doc.moveDown().font(FONT_BOLD).fontSize(10).text('DEFECT DETAILS:  ', 35, undefined, { continued: true })
        .font(FONT_NORMAL).text(docDetails.defectDetails)

      // ? PHOTOS
      doc.moveDown(2).font(FONT_BOLD).fontSize(10).text('PHOTOS:  ', 35, undefined)

      // ? IMAGE 1
      doc.moveDown().image(docDetails.images[0], 35, undefined, { fit: [250, 250] })

      // ? IMAGE 2
      doc.moveUp(16.3).image(docDetails.images[1], 320, undefined, { fit: [250, 250] })

      doc.fontSize(7).font(FONT_ITALICS).text('--------------------  Page 1 of 2 -------------------- ', 35, 750, { align: 'center' })

      // ? PAGE 2
      doc.addPage({
        margins: {
          top: 35,
          bottom: 20,
          right: 35,
          left: 35
        }
      })

      // ? IMAGE 3
      doc.moveDown().image(docDetails.images[2], 35, undefined, { fit: [250, 250] })

      // ? IMAGE 4
      doc.moveUp(23.2).image(docDetails.images[3], 320, undefined, { fit: [250, 250] })

      // ? Prepared by
      doc.moveDown(13).font(FONT_BOLD).fontSize(10).text('PREPARED BY:', 35, undefined)
      doc.moveDown(5).font(FONT_NORMAL).text(docDetails.inspector, 35)

      // ? Noted by
      doc.moveUp(7.3).font(FONT_BOLD).fontSize(10).text('NOTED BY:', 370, undefined)
      doc.moveDown(5).font(FONT_NORMAL).text(PRE_DEF.notedBy.name, 370)
      doc.moveDown(0.3).fontSize(8).font(FONT_ITALICS).text(PRE_DEF.notedBy.title, 370)

      // ? Prepared by
      doc.moveDown(13).font(FONT_BOLD).fontSize(10).text('APPROVED BY:', 35, undefined)
      doc.moveDown(5).font(FONT_NORMAL).text(PRE_DEF.approvedBy.name, 35)
      doc.moveDown(0.3).fontSize(8).font(FONT_ITALICS).text(PRE_DEF.approvedBy.title, 35)

      doc.fontSize(7).font(FONT_ITALICS).text('--------------------  Page 2 of 2 -------------------- ', 35, 750, { align: 'center' })

      // Finalize PDF file
      doc.end()
      resolve('Generation completed')
    } catch (error) {
      reject(error)
    }
  })
}