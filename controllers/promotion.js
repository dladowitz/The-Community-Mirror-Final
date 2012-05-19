app.all('/show/promotion', function(req, res){
	console.log('promotion')
	res.local('title', 'Community Mirror: Win a Playbook!');
	res.render('contest', { layout: false });
});