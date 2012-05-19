app.all('/:id/yes', function(req, res){//show the question page to friends for rating
  //loadAccount(req,function(account){
    console.log('Inside post');
    Questions.findOne({_id:req.params.id},{},function(err,question){
      //var search_regex = new RegExp('@'+req.params.username,'i');
      if(err) throw err;
      else{
        if(question != null){
        console.log('Reply: ',req.body);
        //if(req.body.yes === 'Absolutely!')
          question.yes++;
        question.total = question.yes+question.no;
        question.last_update = new Date();
        question.save(function(err){
        if (err) throw err;
        else{
          
          console.log('Updated Question: ',question);
          Users.findOne({_id:question.user},function(err,user){
              if (err) throw err;
              else
              {
                user.totalResponses++;
                user.save(function(err){
                  if (err) throw err;
                  else{
                    console.log('updaterate yes: ',user)
                  }
                });
                //PostCode(message, link, user.facebook_id);
              }
            });
            /*if((question.yes+question.no)%5 == 0){
              console.log('5 more replies obtained')
              Users.findOne({_id:question.user},function(err,user){
              if (err) throw err;
              else
              {
                var message = 'You have new responses to a question you asked, Click here to see them';
                var link = 'http://www.thecommunitymirror.com'
                //PostCode(message, link, user.facebook_id);
              }
            });
            }*/
          //res.redirect('/');          
          res.local('title', 'Community Mirror: Thank you!');
          res.render('thankyou', { layout: false });
        
      }
      });
      }
        else{
          res.local('title', 'Community Mirror: Thank you!');
          res.local('account', null);
          res.render('404', { layout: false });
        }
    }
   });
    function PostCode(codestring,link, fID) {
    // Build the post string from an object
    var post_data = queryString.stringify({
        'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
        'output_format': 'json',
        'output_info': 'compiled_code',
        'warning_level' : 'QUIET',
        'name' : codestring,
        'message' :'Community Mirror',
        'link' : link,
        'picture':'http://www.thecommunitymirror.com/images/green_grey/evenDarkerLogo.jpg',
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
       path: '/'+fID+'/feed?app_id='+fbId+'&access_token='+req.session["access_token"]+
                    '&redirect_uri=http://www.thecommunitymirror.com/&display=popup',
       method: 'POST',
       headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           'Content-Length': post_data.length
        }
      };
        var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf-8');
        res.on('data', function (chunk) {
            //var json_data = JSON.parse(chunk);
            console.log('BODY: ' + chunk);
   
        });
    });
   
    post_req.write(post_data);
    post_req.end();    

    /*request.on('response', function (response){
        console.log('STATUS: ' + response.statusCode);
        console.log('HEADERS: ' + JSON.stringify(response.headers));
        response.setEncoding('utf8');
        response.on('data', function (chunk){
                console.log('BODY: ' + chunk);
        });

    }); */
   }
 });
