app.get('/:facebook_id/', function(req, res){
  loadAccount(req,function(account){
    Users.findOne({username:req.params.username},function(err,user){
      var search_regex = new RegExp('@'+req.params.username,'i');
      var nods_per_page =  5;
      Users.find({ $or : [{username:req.params.username},{text:search_regex}] },{}, {sort: [['date','descending']], limit: nods_per_page},function(err,nods){
        res.local('user', user);
        res.local('nods', nods);
        res.local('account', account);
        res.local('title', 'Commnity Mirror - '+req.params.username);
        res.render('user', { layout: 'layout' });      
      });
    });
  });
});
