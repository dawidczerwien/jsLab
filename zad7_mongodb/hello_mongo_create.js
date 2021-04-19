const MongoClient = require('mongodb').MongoClient;
const http = require('http');
var url = "mongodb://localhost:27017/db1";
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' });
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
          var dbo = db.db("db1");
          dbo.collection("studenci").find({}).toArray(function(err, result) {
                  if (err) throw err;
                  console.log(result[0].myobj['imie']);
                  res.write(`
    <h2>Upload file to server</h2>
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>Haslo: <input type="text" name="haslo" /></div>
      <div>File: <input type="file" name="multipleFiles" multiple="multiple" /></div>
      <input type="submit" value="Upload" />

      <h2>Download file from server</h2>
  `);
  for (var i=0; i<result.length;i++){
    res.write(`<p>${result[0].myobj['imie']}</p>`);
  }
  
                  db.close();
                  res.end();
                });
    });
    
  
});
 
server.listen(8080, () => {
  console.log('Server listening on http://localhost:8080/ ...');
});

