var express = require('express');
var router = express.Router();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                const fs = require('fs');
router.get('/', function (req, res, next) {
    res.render('dashboard', { title: 'Hello App Dashboard' });
});
    router.get('/list',function(req,res,next){
        //res.render('dashboard/list',{title: 'View List'});
    let query = "SELECT * FROM `customers` ORDER BY id ASC"; // query database to get all the players
    //res.render('dashboard/list',{title: 'View List'});
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            res.redirect('/');
        }
        res.render('dashboard/list', {
            title: "Welcome to Hello | View Customers",
            customers: result
        });
    });
});
router.get('/edit/:id',function (req,res,next){
        let customer_id=req.params.id;
        let query="SELECT * FROM customers WHERE id='"+customer_id+"'";
        db.query(query, (err,result)=> {
            if(err){
                return res.status(500).send(err);
            }
            res.render('dashboard/edit',{
                title:"Edit Customer",
                customers:result[0],
                message:''
            });    
        });

});
router.post('/edit/:id',function(req,res,next){
    let customer_id=req.params.id;
    let first_name=req.body.first_name;
    let last_name = req.body.last_name;
    let position = req.body.position;
    let number = req.body.number;
    
    let query="UPDATE `customers` SET `first_name` = '" + first_name + "',`last_name` = '" + last_name + "',`position` = '" + position + "' ,`number` = '" + number + "' WHERE `customers`.`id` = '" + customer_id + "'";
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/dashboard/list');

    });
   //console.log(query); 
});
router.get('/delete/:id', function (req, res, next) {
    let customer_id = req.params.id;
    let getImageQuery = 'SELECT image from `customers` WHERE id = "' + customer_id + '"';
    let deleteUserQuery = 'DELETE FROM customers WHERE id = "' + customer_id + '"';
  
    db.query(getImageQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
  
        let image = result[0].image;
  
        fs.unlink(`public/assets/img/${image}`, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            db.query(deleteUserQuery, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/dashboard/list');
            });
        });
    });
  });
  
module.exports = router;