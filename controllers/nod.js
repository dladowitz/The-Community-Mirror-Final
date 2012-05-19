app.post('/nod', function(req, res){
  var facebook = require("facebook-graph");
    loadAccount(req,function(account){
    if(account) {
      console.log('Inside Node')
      var n = new Questions();
      n.user=account._id;
      if(req.body.reqIds != ''){
        n.request_ids.push(req.body.reqIds);
        //console.log('Inside Node: ',req.body.reqIds)
      }      
      n.text = req.body.nod;
      n.date = new Date();
      n.yes =0;
      n.no = 0;
      n.last_update = new Date();
      console.log('New Question: ', n)
      n.save(function(err){
        if (err) throw err;
        account.questions.push(n._id, function(err){
            if (err) throw err;
            res.redirect('/');
        });

      });
     /* if(req.body.reqIds === 'feed'){
        console.log('Inside feed');
        var message = account.fname +' has asked you a question: '+req.body.nod;
        var link = 'http://www.communitymirrortest.com/'+n._id;
        //PostCode(message,link, function(data, error){
          //if(callback){
          var user = facebook.getUserFromCookie(req.cookies, fbId, fbSecret);
          console.log('***Cookies',req.session.auth);
          console.log('***User',user);
         // if (user) {
            console.log('****POST****',user);
            var accessToken = req.session["access_token"];
            //console.log(accessToken);
            var graph = new facebook.GraphAPI(accessToken);
            //graph.getObject('me', print);
            //graph.getConnections('me', 'friends', print);
            //putWallPost = function (message, attachment, link, picture, profileId, callback)
            var message = req.body.nod;
            var link = 'http://www.communitymirrortest.com/'+n._id;
            var picture = 'http://www.communitymirrortest.com/images/green_grey/evenDarkerLogo.jpg';
            var profileId = req.getAuthDetails().user.id;
            console.log("**sent: ",message,link,picture,profileId);
            graph.putWallPost(message,link,picture,profileId, print);
            /*graph.putObject(req.getAuthDetails().user.id, 'feed', {
                message: req.body.nod, link:'http://www.communitymirrortest.com/'+n._id, caption: 'Community Mirror',picture:'http://www.communitymirrortest.com/images/green_grey/evenDarkerLogo.jpg'
            }, print);
            function print(error, data) {
            console.log(error || data);
            res.local('nods', n);
            res.local('account', account);
            res.local('title', 'Commnity Mirror - Ask your friends ');
            res.render('home', { layout: 'layout' });
            }
          //}
          /*res.local('nods', n);
          res.local('account', account);
          res.local('title', 'Commnity Mirror - Ask your friends ');
          res.render('home', { layout: 'layout' }); 
       }*/
        //});
      //}
      /*if(req.body.reqIds != 'feed'){
      //res.local('question', n);
      res.local('nods', n);
      res.local('account', account);
      res.local('title', 'Commnity Mirror - Ask your friends ');
      res.render('profile', { layout: false }); */
      
    }
    else{
      res.redirect('/');
    }
  });
});
  

