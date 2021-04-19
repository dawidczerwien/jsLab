const MongoClient = require('mongodb').MongoClient;
const http = require('http');
const formidable = require('formidable');

var url = "mongodb://localhost:27017/db1";
const server = http.createServer((req, res) => {
  if (req.url === '/api/upload' && req.method.toLowerCase() === 'post') {
    const form = formidable({ multiples: true });
    
    form.parse(req, (err, fields, files) => {
      console.log("req: ");
      console.log(fields);
      let title = fields.title;
      let content = fields.content;
      let myobj = {};
      myobj = {'title': title, 'content':content};
      let deleteobj = {};
      deleteObj = {'_id': fields.id};
      console.log("deleteObj: ");
      console.log(fields.id);
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
          var dbo = db.db("db1");
          dbo.collection("studenci2").insertOne(myobj, function(err, res) {
                  if (err) throw err;
                  //console.log(result[0].myobj['imie']);
          
                  db.close();
                });
                dbo.collection("studenci2").deleteOne(deleteobj, function(err, res) {
                  if (err) throw err;
                
          
                  db.close();
                });
    });
      
    })
    
    
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('Plik zostal wyslany ');
        res.write('<p><a href="http://localhost:8080/">Powrót</a></p>');
        res.end();
      

      

    
 
    return;
  }
  
    res.writeHead(200, { 'content-type': 'text/html' });
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
          var dbo = db.db("db1");
          dbo.collection("studenci2").find({}).toArray(function(err, result) {
                  if (err) throw err;
                  console.log(result);
                  res.write(`
    <h2>Upload file to server</h2>
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>title: <input type="text" name="title" /></div>
      <div>content: <input type="text" name="content" /></div>
      <input type="submit" value="Upload" />
    </form>
    

      <h2>All posts:</h2>
      </br>
  `);
  for (var i=0; i<result.length;i++){
    res.write(`
    <h2>${result[i]['title']}</h2>
    <p>${result[i]['content']}</p>
    <div>
      <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>comment: <input type="text" name="comment" id=${result[i]['_id']} /></div>
      <input type="hidden" name="id" value=${result[i]['_id']}>
      <input type="submit" value="comment" />
      </form>
    </div>
    </br>
    
  `);
    //console.log("res");
  }
  
                  db.close();
                  res.end();
                  
                });
    });
    
  
});
 
server.listen(8080, () => {
  console.log('Server listening on http://localhost:8080/ ...');
});

