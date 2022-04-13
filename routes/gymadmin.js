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
			res.render('gym/list',{title:"gym",data:rows,session_store:req.session});
		});
     });
});

router.delete('/delete/(:id)',authentication_mdl.is_login, function(req, res, next) {
	req.getConnection(function(err,connection){
		var gym = {
			id: req.params.id,
		}
		
		var delete_sql = 'delete from gym where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, gym, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/gymadmin');
				}
				else{
					req.flash('msg_info', 'Delete gym Success'); 
					res.redirect('/gymadmin');
				}
			});
		});
	});
});
router.get('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM gym where id='+req.params.id,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/gymadmin'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "gym can't be find!"); 
					res.redirect('/gymadmin');
				}
				else
				{	
					console.log(rows);
					res.render('gym/edit',{title:"Edit ",data:rows[0],session_store:req.session});

				}
			}

		});
	});
});
router.put('/edit/(:id)',authentication_mdl.is_login, function(req,res,next){
	req.assert('nama', 'Please fill the nama').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
		v_nama = req.sanitize( 'nama' ).escape().trim(); 
		v_alamat = req.sanitize( 'alamat' ).escape().trim();
		v_no_hp = req.sanitize( 'no_hp' ).escape().trim();
		v_masa_aktif = req.sanitize( 'masa_aktif' ).escape().trim();

		var gym = {
			nama: v_nama,
			alamat: v_alamat,
			no_hp: v_no_hp,
			masa_aktif: v_masa_aktif
		}

		var update_sql = 'update gym SET ? where id = '+req.params.id;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, gym, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('gym/edit', 
					{ 
						nama: req.param('nama'), 
						alamat: req.param('alamat'),
						no_hp: req.param('no_hp'),
						masa_aktif: req.param('masa_aktif'),
					});
				}else{
					req.flash('msg_info', 'Update gym success'); 
					res.redirect('/gymadmin');
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
		res.redirect('/gymadmin');
	}
});

router.post('/add',authentication_mdl.is_login, function(req, res, next) {
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
					res.render('gym/add', 
					{ 
						nama: req.param('nama'), 
						alamat: req.param('alamat'),
						no_hp: req.param('no_hp'),
						masa_aktif: req.param('masa_aktif'),
						session_store:req.session,
					});
				}else{
					req.flash('msg_info', 'Create gym success'); 
					res.redirect('/gymadmin');
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
		res.render('gym/add', 
		{ 
			name: req.param('nama'), 
			address: req.param('alamat'),
			session_store:req.session
		});
	}

});

router.get('/add',authentication_mdl.is_login, function(req, res, next) {
	res.render(	'gym/add', 
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
