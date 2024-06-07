import { read, utils, writeFileXLSX } from 'xlsx';
self.onmessage = async(event)=>{
  // console.log(event,'event');
  const fileContent = event.data.content;
  const sheetsName = event.data.sheetsName;
  const export_Visualization_wb = utils.book_new();
  for(let i = 0 ; fileContent.length > i ; i++){
    const ws = await utils.aoa_to_sheet(fileContent[i]);
    await utils.book_append_sheet(export_Visualization_wb, ws, sheetsName[i])
  }
  // console.log(export_Visualization_wb, 'export_Visualization_wb');
  // const wbout  = await writeFileXLSX(export_Visualization_wb, { type: "array", bookType: "xlsx" });
  // const blob = new Blob([wbout], { type: 'application/octet-stream' });
  // const wb = read(event.data, { type: "binary",dense: true });
  // if(wb.SheetNames.length === 0 )return 
  // const wbData = [];
  // for(let i = 0 ; wb.SheetNames.length > i;i++){
  //   const sheetName = wb.SheetNames[i];
  //   const ws = wb.Sheets[sheetName];
  //   const sheetData = await utils.sheet_to_json(ws);
  //   wbData.push({
  //     sheetName,
  //     sheetData
  //   })
  // }
  // postMessage(wbData);
  postMessage(export_Visualization_wb)
  // postMessage(blob)
}