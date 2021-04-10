const express = require('express')
const cors = require('cors')
const CfdiToJson = require('cfdi-to-json');
const fs = require('fs');
const path = require('path');
let cfdi=[];
let cfdiJson=[];
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
});

app.get('/',  (request, response)=>{
  response.send(cfdiJson.map(() => cfdiJson))
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
    if(err) throw err;
    console.log('server corriendo en el puerto',PORT);
});