const express = require('express')
const cors = require('cors')
const CfdiToJson = require('cfdi-to-json');
const fs = require('fs');
const path = require('path');
let cfdi=[];
let cfdiJson=[];
let findId;
const app = express();


app.use(cors())

fs.readdir('./',  function (err, archivos) {
  if (err) {
    onError(err);
    return;
  }

  archivos.forEach(file => {
    if (path.extname(file) == '.xml')
      cfdi.push(file);
  })

  cfdi.forEach(element => {
    cfdiJson.push(jsonCfdi = CfdiToJson.parse({ path: element }));
  })
  findId = cfdiJson.filter(valor => valor.impuestos!==undefined )
  findId = findId.filter(valor =>valor.timbreFiscal!==undefined )
});

app.get('/',  (request, response)=>{
  response.setHeader("Content-disposition", "attachment; filename=CFDINovalan.txt");
  response.setHeader("Content-type", "text/plain");
  response.charset = "ANSI";
  findId.map((cfdi, index)=>{
    response.write(`${cfdi.version}|${cfdi.serie}|${cfdi.folio}|${cfdi.fecha}|${cfdi.formaPago}|${cfdi.subTotal}|${cfdi.descuento}|${cfdi.tipoCambio}|${cfdi.moneda}|${cfdi.total}|${cfdi.tipoDeComprobante}|${cfdi.metodoPago}|${cfdi.emisor.rfc}|${cfdi.emisor.nombre}|${cfdi.emisor.regimenFiscal}|${cfdi.receptor.rfc}|${cfdi.receptor.nombre}||||||||||||Ident Folio|${cfdi.timbreFiscal.uuid}|${cfdi.timbreFiscal.uuid}.xml|S - Comprobante obtenido satisfactoriamente. |Vigente|
${cfdi.conceptos.map((element, index) => {
  return `${cfdi.version}|${cfdi.serie}|${cfdi.folio}|${cfdi.fecha}|${cfdi.formaPago}|${cfdi.subTotal}|${cfdi.descuento}|${cfdi.tipoCambio}|${cfdi.moneda}|${cfdi.total}|${cfdi.tipoDeComprobante}|${cfdi.metodoPago}|${cfdi.emisor.rfc}|${cfdi.emisor.nombre}|${cfdi.emisor.regimenFiscal}|${cfdi.receptor.rfc}|${cfdi.receptor.nombre}|${cfdi.conceptos[index].cantidad}|${cfdi.conceptos[index].claveUnidad}|${cfdi.conceptos[index].claveProdServ}|${cfdi.conceptos[index].descripcion.replace(/\s+/g, ' ')}|${cfdi.conceptos[index].valorUnitario}|${cfdi.conceptos[index].importe}|||||||||||`}).join('\n')}
${cfdi.version}|${cfdi.serie}|${cfdi.folio}|${cfdi.fecha}|${cfdi.formaPago}|${cfdi.subTotal}|${cfdi.descuento}|${cfdi.tipoCambio}|${cfdi.moneda}|${cfdi.total}|${cfdi.tipoDeComprobante}|${cfdi.metodoPago}||||${cfdi.receptor.rfc}|${cfdi.receptor.nombre}|||||||IVA|16|${cfdi.impuestos.totalImpuestosTrasladados}||||||||
`)
   })
  response.end();
})


app.get('/api/v1', (request, response)=>{
  response.send(findId)
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
    if(err) throw err;
    console.log('server corriendo en el puerto',PORT);
});

