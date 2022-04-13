var express = require('express');
var router = express.Router();
var authentication_mdl = require('../middlewares/authentication');
var session_store;
/* GET gym page. */

router.get('/',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM gym',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('gym/listuser',{title:"gym",data:rows,session_store:req.session});
		});
     });
});

router.post('/adduser',authentication_mdl.is_login, function(req, res, next) {
	req.assert('nama', 'Please fill the nama').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_nama = req.sanitize( 'nama' ).escape().trim(); 
		v_alamat = req.sanitize( 'alamat' ).escape().trim();
		v_no_hp = req.sanitize( 'no_hp' ).escape().trim();
		v_masa_aktif = req.sanitize( 'masa_aktif' ).escape();

		var gym = {
			nama: v_nama,
			alamat: v_alamat,
			no_hp: v_no_hp,
			masa_aktif : v_masa_aktif
		}

		var insert_sql = 'INSERT INTO gym SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, gym, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('gym/adduser', 
					{ 
						nama: req.param('nama'), 
						alamat: req.param('alamat'),
						no_hp: req.param('no_hp'),
						masa_aktif: req.param('masa_aktif'),
						session_store:req.session,
					});
				}else{
					req.flash('msg_info', 'Create gym success'); 
					res.redirect('/gym');
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "<p>Sory there are error</p><ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('gym/adduser', 
		{ 
			name: req.param('nama'), 
			address: req.param('alamat'),
			session_store:req.session
		});
	}

});

router.get('/adduser',authentication_mdl.is_login, function(req, res, next) {
	res.render(	'gym/adduser', 
	{ 
		title: 'Add New nama',
		nama: '',
		alamat: '',
		no_hp:'',
		masa_aktif:'',
		session_store:req.session
	});
});

module.exports = router;
