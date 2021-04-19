const MongoClient = require('mongodb').MongoClient;
const http = require('http');
const formidable = require('formidable');

var url = "mongodb://localhost:27017/db1";
const server = http.createServer((req, res) => {
  if (req.url === '/api/upload' && req.method.toLowerCase() === 'post') {
    const form = formidable({ multiples: true });
    
    form.parse(req, (err, fields, files) => {
      
      let title = fields.title;
      let content = fields.content;
      let myobj = {};
      myobj = {'title': title, 'content':content};
      
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
          var dbo = db.db("db1");
          dbo.collection("studenci3").insertOne(myobj, function(err, res) {
                  if (err) throw err;
                  db.close();
                });
                
    });
      
    })
    
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('Post has been added ');
        res.write('<p><a href="http://localhost:8080/">Go back</a></p>');
        res.end();
      
    return;
  }

  if (req.url === '/api/deletePost' && req.method.toLowerCase() === 'post') {
    const form = formidable({ multiples: true });
    
    form.parse(req, (err, fields, files) => {
      let deleteobj = {};
      deleteObj = {'_id': fields.id};
   
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
          var dbo = db.db("db1");
          
                dbo.collection("studenci3").deleteOne(deleteobj, function(err, res) {
                  if (err) throw err;
                
          
                  db.close();
                });
    });
      
    })
    
    
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('Post has been deleted ');
        res.write('<p><a href="http://localhost:8080/">Go back</a></p>');
        res.end();
  
 
    return;
  }
  
    res.writeHead(200, { 'content-type': 'text/html' });
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
          var dbo = db.db("db1");
          dbo.collection("studenci3").find({}).toArray(function(err, result) {
                  if (err) throw err;
                  console.log(result);
                  res.write(`
                  <body style="max-width: 500px;
                  margin: auto;">
    <h2>Add new Post</h2>
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>Title: <input type="text" name="title" /></div>
      <div>Content: <input type="text" name="content" /></div>
      <input type="submit" value="Upload" />
    </form>
    

      <h2>All posts:</h2>
      </br>
  `);
  for (var i=0; i<result.length;i++){
    res.write(`
    <div style="border:1px solid black; padding: 20px; border-radius: 25px;">
    <h2>${result[i]['title']}</h2>
    <p>${result[i]['content']}</p>
    
      <form action="/api/deletePost" enctype="multipart/form-data" method="post">
      <input type="hidden" name="id" value=${result[i]['_id']}>
      <input type="submit" value="Delete Post" />
      
      </form>
      <form action="/api/comment" enctype="multipart/form-data" method="post">
      <input type="hidden" name="id" value=${result[i]['_id']}>
      
      <div>comment: <input type="text" name="comment" id=${result[i]['_id']} /></div>
      <input type="submit" value="Add comment" />
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

