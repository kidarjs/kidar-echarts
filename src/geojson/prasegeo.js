import fs from 'fs'

fs.readFile('geo_china.csv', function (err, data) {
  if (err) {
    return console.error(err);
  }
  console.log("异步读取: " + data.toString());
});