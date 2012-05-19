app.post('/nodPost', function(req, res){
    loadAccount(req,function(account){
    if(account) {
      //console.log('Head: ',req.headers)
      //console.log('Inside Node: ',req)
      var n = new Questions();
      n.user=account._id;
      n.text = req.body.nod;
      n.date = new Date();
      n.yes =0;
      n.no = 0;
      n.last_update = new Date();
      n.save(function(err){
        if (err) throw err;
        account.questions.push(n._id);
      });
      var message = account.fname +' has asked you a question: '+req.body.nod;
      var link = 'http://localhost/'+n._id;
      //console.log('REQ',req.body.wall)
        //PostCode(message,link);
      //res.local('user', user);
        console.log('Inside nodpost');
          res.local('question', n);
          res.local('nods', n);
          res.local('account', account);
          res.local('title', 'Commnity Mirror - Ask your friends ');
          res.render('facebookJoinPost'); 
   }
  });
  function PostCode(codestring,link) {
    // Build the post string from an object
    var post_data = queryString.stringify({
        'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
        'output_format': 'json',
        'output_info': 'compiled_code',
        'warning_level' : 'QUIET',
        'name' : codestring,
        'message' :'Community Mirror',
        'link' : link,
        //'picture':'https://dl-web.dropbox.com/get/Startup%20Monthly/communityMirror.png?w=2817dcc5',
        /*'media': [
          { 
          'type': 'image', 
          'src': 'http://icanhascheezburger.files.wordpress.com/2009/03/funny-pictures-kitten-finished-his-milk-and-wants-a-cookie.jpg', 
          'href': 'http://icanhascheezburger.com/2009/03/30/funny-pictures-awlll-gone-cookie-now/'
          }, 
          {
              'type': 'image', 
              'src': 'http://photos.icanhascheezburger.com/completestore/2009/1/18/128768048603560273.jpg', 
              'href': 'http://ihasahotdog.com/upcoming/?pid=20869'
          }],*/
          'caption':'Community Mirror'
          });
   
  var post_options = {
       host: 'graph.facebook.com',
       port: '443',
       path: '/'+req.getAuthDetails().user.id+'/feed?app_id='+fbId+'&access_token='+req.session["access_token"]+
                    '&redirect_uri=http://localhost/&picture=http://localhost/images/communityMirror.png&display=popup',
       method: 'POST',
       headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           'Content-Length': post_data.length
        }
    };
    var post_options1 = {
       host: 'facebook.com',
       port: '80',
       path: '/dialog/send?app_id='+fbId+'&access_token='+req.session["access_token"]+
       '&redirect_uri=http://localhost/&display=popup&picture=http://localhost/images/communityMirror.png',
       method: 'GET',
       headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           'Content-Length': post_data.length
        }
    };
    //var facebook = http.createClient()
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf-8');
        res.on('data', function (chunk) {
            //var json_data = JSON.parse(chunk);
            console.log('BODY: ' + chunk);
   
        });
    });
   
    post_req.write(post_data);
    post_req.end();

    

request.on('response', function (response){
        console.log('STATUS: ' + response.statusCode);
        console.log('HEADERS: ' + JSON.stringify(response.headers));
        response.setEncoding('utf8');
        response.on('data', function (chunk){
                console.log('BODY: ' + chunk);
        });

}); 
   }
});
