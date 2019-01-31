var express = require('express');
var router = express.Router();
const { check, validationResult} = require('express-validator/check');
const fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello App' });
});
router.get('/about',function(req,res,next){
    res.render('about',{title:'About'});
});
router.get('/contact',function(req,res,next){
  res.render('contact',{title:'Contact'});
});
router.get('/register',function(req,res,next){
  res.render('register',{title:'Register New Customer'});
});
router.get('/add',function(req,res,next){
    res.render('Add',{
    title:'Add Customer',
    message:''
    
    });
});
router.post('/add',[
    check('first_name').isAlpha().withMessage('Must be only alphabetical chars').
    isLength({min:5}).withMessage('Must be only 5 characters or more')],
    function(req,res,next){
        const errors=validationResult(req);
        if(!errors.isEmpty()){
          res.render('register',{
          title:'Add customer',
          message:'errors found.....',
          errors:errors.array()
        });
        }
        if (!req.files) {
          return res.status(400).send("No files were uploaded.");
      }
      let message = '';
 let first_name = req.body.first_name;
 let last_name = req.body.last_name;
 let email=req.body.email;
 let position = req.body.position;
 let number = req.body.number;
 let username = req.body.username;
 let uploadedFile = req.files.image;
 let image_name = uploadedFile.name;
 let fileExtension = uploadedFile.mimetype.split('/')[1];
 image_name = username + '.' + fileExtension;

 let usernameQuery = "SELECT * FROM `customers` WHERE username = '" + username + "'";

 db.query(usernameQuery, (err, result) => {
     if (err) {
         return res.status(500).send(err);
     }
     if (result.length > 0) {
         message = 'Username already exists';
         res.render('register', {
             message,
             title: "Welcome to  | Add a new player"
         });
     } else {
         // check the filetype before uploading it
         if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
             // upload the file to the /public/assets/img directory
             uploadedFile.mv(`public/assets/img/${image_name}`, (err) => {
                 if (err) {
                     return res.status(500).send(err);
                 }
                 // send the player's details to the database
                 let customersquery = "INSERT INTO `customers` (first_name, last_name, email,position, number, image, username) VALUES ('" +first_name + "', '" + last_name + "','"+ email + "', '" + position + "', '" + number + "', '" + image_name + "', '" + username + "')";
                 db.query(customersquery, (err,result) => {
                  //console.log(customersquery);
                     if (err) {
                         return res.status(500).send(err);
                     }
                     
                 });
                 res.redirect('/');  

             });
         } else {
             message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
             res.render('register.ejs', {
                 message,
                 title: "Welcome to  | Add a new player"
             });
         }
     }
 });
    });
module.exports = router;
