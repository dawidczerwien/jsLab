const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const session = require('express-session');
app.use(session({secret: "session",resave: true,saveUninitialized: true, cookie : {
    maxAge:(1000 * 60 * 15)
}}));
const bcrypt = require('bcrypt');
const salt = 10;
const mongodb = require('mongodb');
const url = "mongodb://localhost:27017/db1";
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false}));

app.get('/', function(req, res){
   mongodb.connect(url, function(err, db) {
       if (err) throw err;
         const dbo = db.db("db1");
         dbo.collection("blog").find({title: { $exists: true }}).toArray(function(err, result) {
           if (err) throw err;
            //console.log(result);
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
          const dbo = db.db("db1");
          dbo.collection("blog").find({login: req.body.login}).toArray(async function(err, result) {
            console.log(result[0])
            if (err) throw err;
            //console.log(result);
            async function UnHashPassword(password, hashPassword) {
              const res = await bcrypt.compare(password, hashPassword);
              return res;
            };
            try {
              if(result[0]) {
                const match = await UnHashPassword(req.body.password, result[0]['passwd']);
                console.log(match);
                if (match) {
                  console.log('zalogowano: ' + result[0]['_id']);
                  req.session.userId = result[0]['_id'];
                  req.session.login = result[0]['login'];
                } else {
                  console.log('zły login lub hasło');
                }
              } else {
                console.log('zły login lub hasło');
              }
              
            }catch(error) {
              console.log(error);
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
app.post('/api/register', async function(req, res){
    async function hashPassword(password, salt) {
      let hashedPassword = await bcrypt.hash(password, salt);
      console.log(hashedPassword);
      return hashedPassword;
    }
    try {
      const hashedpasswd = await hashPassword(req.body.password, salt);
      myobj = {'login': req.body.login, 'passwd': hashedpasswd};
      mongodb.connect(url, function(err, db) {
        if (err) throw err;
          const dbo = db.db("db1");
          dbo.collection("blog").findOne({'login': req.body.login}, function(err, result) {
            db.close();
            register(result);
          });        
      });
      function register(resultFind){
        mongodb.connect(url, function(err, db) {
          if (resultFind) {
            console.log('Użytkownik już istnieje');
            res.send('Not registerd! User already exists');
          } else {
            const dbo = db.db("db1");
            dbo.collection("blog").insertOne(myobj, function(err, result) {
              
              if (err) {
                res.send('Not registered');
                throw err;
              }
              console.log('zarejestrowano');
              res.redirect('/api/login');
            });
            db.close();
          };
        })
      }
    }catch(err){
      console.log(err);
    }
});
app.post('/api/addPost', function(req, res){
  if (req.session.userId) {
    
    const myobj = {'userId': req.session.userId, 'userLogin': req.session.login, 'title': req.body.title, 'description': req.body.description, date: new Date};
    console.log(myobj);
    mongodb.connect(url, function(err, db) {
      if (err) throw err;
        const dbo = db.db("db1");
        dbo.collection("blog").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log('New post Added');
                db.close();
              });
              
  });
    res.redirect("/");
  } else {
    res.render('loginPage.ejs');
  }
  
});
app.post('/api/deletePost', function(req, res){
  if (req.session.userId) {
    const myobj = {'_id': new mongodb.ObjectID(req.body.id)};
    if (req.session.login == req.body.userLogin) {
      mongodb.connect(url, function(err, db) {
        if (err) throw err;
          const dbo = db.db("db1");
          
                dbo.collection("blog").deleteOne(myobj, function(err, res) {
                  if (err) throw err;
                
          
                  db.close();
                });
    });
    } else {
      console.log('Cannot delete post');
    };
    
    res.redirect('/');
  } else {
    res.render('loginPage.ejs');
  }
  
});
app.get('/api/post/:id', function(req, res){
  console.log(req.params.id);
  mongodb.connect(url, function(err, db) {
    if (err) throw err;
      const dbo = db.db("db1");
      dbo.collection("blog").find({'_id': new mongodb.ObjectID(req.params.id)}).toArray(function(err, result) {
        if (err) throw err;
         console.log(result);
         res.render('postPage.ejs', {result: result});
      });
      
      db.close();
    });
});
app.post('/api/addComment', function(req, res){
  if (req.session.userId) {
    
    const myobj = {'userId': req.session.userId, 'userLogin': req.session.login, 'title': req.body.title, 'description': req.body.description, date: new Date};
    console.log(myobj);
    mongodb.connect(url, function(err, db) {
      if (err) throw err;
        const dbo = db.db("db1");
        dbo.collection("blog").updateOne({'_id': new mongodb.ObjectID(req.body.id)}, {$push: {comments: {'userId': req.session.userId, 'userLogin': req.session.login, 'comment': req.body.comment, date: new Date}}}, function(err, res) {
                if (err) throw err;
                console.log('New comment Added');
                db.close();
              });
              
  });
    res.redirect('post/'+req.body.id);
  } else {
    res.render('loginPage.ejs');
  }
  
});

app.listen(3000);