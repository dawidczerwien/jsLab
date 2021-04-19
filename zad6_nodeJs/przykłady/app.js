const http = require('http');
const formidable = require('formidable');
var fs = require('fs');
const server = http.createServer((req, res) => {
  if (req.url === '/api/upload' && req.method.toLowerCase() === 'post') {
    const form = formidable({ multiples: true });
    // przypadek gdzy chcemy wysłać jeden plik
    form.parse(req, (err, fields, files) => {
      let passwd = fields.haslo
      if (files.multipleFiles.length == null) {
        let save = passwd;
        var oldpath = files.multipleFiles.path;
        var newpath = 'storage/new/' + files.multipleFiles.name;
        fs.rename(oldpath, newpath, function (err) {
          if (err) throw err;
          
        });
        save+=' ' + newpath + '\n';
          fs.appendFileSync('plikdozapisu.txt', save, function (err) {
          if (err) throw err;
          console.log('Zapisano!');
      });
      } else { // przypadek gdzy chcemy wysłać wiele plików
        for (var i = 0; i<files.multipleFiles.length; i++) {
          let save = passwd;
          var oldpath = files.multipleFiles[i].path;
          var newpath = 'storage/new/' + files.multipleFiles[i].name;
          fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
          });
          save+=' ' + newpath + '\n';
          fs.appendFileSync('plikdozapisu.txt', save, function (err) {
          if (err) throw err;
          console.log('Zapisano!');
      });
        }
      }
      fs.readFile('plikdozapisu.txt', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('Plik zostal wyslany ');
        res.write('Twoje wszystkie pliki:');
        if(err) throw err;
        var array = data.toString().split("\n");
        for(i in array) {
        //console.log(array[i].split(' ')[0] + ' ' + passwd);
        if (array[i].split(' ')[0] == passwd) {
          var filePath = array[i].split(' ')[1];
          res.write('<p><a href="'+filePath+'" download>'+ filePath + '</a></p>');
        }
        
        }
        
        res.end();
      });

      

    });
 
    return;
  } else if (req.url === '/api/download' && req.method.toLowerCase() === 'post') {
      fs.readFile('plikdozapisu.txt', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        
        res.write('Twoje wszystkie pliki:');
        if(err) throw err;
        var array = data.toString().split("\n");
        for(i in array) {
        //console.log(array[i].split(' ')[0] + ' ' + passwd);
        if (array[i].split(' ')[0] == passwd) {
          var filePath = array[i].split(' ')[1];
          console.log(filePath);
          res.write('<p><a href="'+filePath+'" download>'+ filePath + '</a></p>');
        }
        
        }
        
        res.end();
      });

      

    
 
    return;
  } 
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(`
    <h2>Upload file to server</h2>
    <form action="/api/upload" enctype="multipart/form-data" method="post">
      <div>Haslo: <input type="text" name="haslo" /></div>
      <div>File: <input type="file" name="multipleFiles" multiple="multiple" /></div>
      <input type="submit" value="Upload" />

      <h2>Download file from server</h2>
    <form action="/api/download" enctype="multipart/form-data" method="post">
      <div>Haslo: <input type="text" name="haslo" /></div>
      <input type="submit" value="Upload" />
    </form>
  `);
});
 
server.listen(8080, () => {
  console.log('Server listening on http://localhost:8080/ ...');
});