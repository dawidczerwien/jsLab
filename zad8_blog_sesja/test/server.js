var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var session = require('express-session');
app.use(session({secret: "Shh, its a secret!",resave: true,saveUninitialized: true, cookie : {
    maxAge:(1000 * 60 * 15)
}}));
//const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');
var url = "mongodb://localhost:27017/db1";
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false}));

app.get('/', function(req, res){
   mongodb.connect(url, function(err, db) {
       if (err) throw err;
         var dbo = db.db("db1");
         dbo.collection("studenci3").find({title: { $exists: true }}).toArray(function(err, result) {
           if (err) throw err;
            console.log(result);
            res.render('home.ejs', {result: result});
         });
         
         db.close();
       });

   
});
app.get('/api/login', function(req, res){
    if (req.session.userId) {
      console.log("zalogowany");
      console.log("userId: "+req.session.userId);
      res.render('restrictedPage.ejs', {data: req.session.login});
    } else {
      res.render('loginPage.ejs');
    }
    
});
app.post('/api/logout', function(req, res){
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    })
});
app.post('/api/login', function(req, res) {
  mongodb.MongoClient.connect(url, function(err, db) {
        if (err) throw err;
          var dbo = db.db("db1");
          dbo.collection("studenci3").find({login: req.body.login, passwd: req.body.password}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            if (result[0]) {
              console.log('zalogowano: ' + result[0]['_id']);
              req.session.userId = result[0]['_id'];
              req.session.login = result[0]['login'];
            } else {
              console.log('zły login lub hasło');
            }
            
            res.redirect('/api/login');
          }),
          db.close();
          
        });
        
});
app.get('/api/register', function(req, res){
    if (req.session.userId) {
        res.redirect('login');
    } else {
      res.render('registerPage.ejs');
    }
    
});
app.post('/api/register', function(req, res){
    myobj = {'login': req.body.login, 'passwd': req.body.password};
      
    mongodb.connect(url, function(err, db) {
        if (err) throw err;
          var dbo = db.db("db1");
          dbo.collection("studenci3").insertOne(myobj, function(err, res) {
                  if (err) {
                    res.send('Not registerd');
                    throw err;
                  }
                  //console.log(res);
                  db.close();
                });
                
    });
    res.redirect('/api/login');
});
app.post('/api/addPost', function(req, res){
  if (req.session.userId) {
    
    var myobj = {'userId': req.session.userId, 'userLogin': req.session.login, 'title': req.body.title, 'description': req.body.description, date: new Date};
    console.log(myobj);
    mongodb.connect(url, function(err, db) {
      if (err) throw err;
        var dbo = db.db("db1");
        dbo.collection("studenci3").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log('New post Added');
                db.close();
              });
              
  });
    res.render('restrictedPage.ejs', {data: req.session.login});
  } else {
    res.render('loginPage.ejs');
  }
  
});
app.post('/api/deletePost', function(req, res){
  if (req.session.userId) {
    var myobj = {'_id': new mongodb.ObjectID(req.body.id)};
    console.log(myobj);
    mongodb.connect(url, function(err, db) {
      if (err) throw err;
        var dbo = db.db("db1");
        
              dbo.collection("studenci3").deleteOne(myobj, function(err, res) {
                if (err) throw err;
              
        
                db.close();
              });
  });
    res.render('restrictedPage.ejs', {data: req.session.login});
  } else {
    res.render('loginPage.ejs');
  }
  
});
app.get('/post/:id', function(req, res){
  console.log(req.params.id);
  mongodb.connect(url, function(err, db) {
    if (err) throw err;
      var dbo = db.db("db1");
      dbo.collection("studenci3").find({'_id': new mongodb.ObjectID(req.params.id)}).toArray(function(err, result) {
        if (err) throw err;
         console.log(result);
         res.render('postPage.ejs', {result: result});
      });
      
      db.close();
    });
});

app.listen(3000);