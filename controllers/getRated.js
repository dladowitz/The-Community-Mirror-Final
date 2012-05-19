app.all('/:id', function(req, res){
  //console.log("Inside GetRated: ", req)
  loadAccount(req,function(account){
   // console.log(req);
    Questions.findOne({_id:req.params.id},function(err,question){
      console.log('QUESTION***',question)
      if(err) {
        res.local('title', 'Commnity Mirror - 404 Error!');
        res.local('nods', null);
        res.local('account', account);
        res.render('404', { layout: false });
      }
      else if (question != null){
      var nods_per_page =  5;

      Users.findOne({_id:question.user},function(err,user){
        if (err) throw err;
        else
        {
          res.local('user', user);
          res.local('question', question.text);
          res.local('id',question._id);
          res.local('nods', question);
          res.local('account', user);

         /* res.local('userfName', user.fname);
          res.local('userlName', user.lname);
          res.local('question', text);
          res.local('id',questionId);
          //res.local('nods', question[0]);
          res.local('account', user.fname);
          res.local('requestId', request_id);
          res.local('userFacebookId', userFacebookId);*/
      
          if(account)
          {
            console.log('**Account!!',account._id, user._id);

            if(String(account._id) == String(user._id)){
              console.log('**same user');
              res.local('title', 'Community Mirror - Ask your friends ');
              res.render('askAgainNew', { layout: false });  
            }
            else{
              res.local('title', 'Commnity Mirror - Answer a question from '+user.fname);
              res.render('answerfromfeed', { layout: false });
            }
          }
          else{
            res.local('title', 'Commnity Mirror - Answer a question from '+user.fname);
            res.render('answerfromfeed', { layout: false });
          }              
        } 
      });
    }
    else{
      res.local('title', 'Commnity Mirror - 404 Error!');
      res.local('nods', null);
      res.local('account', account);
      res.render('404', { layout: false }); //render page not found
    }
   });
 });
});
