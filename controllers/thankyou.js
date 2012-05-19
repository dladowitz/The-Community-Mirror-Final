app.all('/show/thankyou', function(req, res){
	console.log('Thank you page')
	//res.local('reqObj',req.session);
	res.local('title', 'Community Mirror: Thank you!');
	res.render('thankyou', { layout: false });
});