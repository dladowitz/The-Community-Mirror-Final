app.post('/:id', function(req, res){
//show the question page to friends for rating
  loadAccount(req,function(account){
   // console.log(req);
    Questions.findOne({_id:req.params.id},function(err,question){
      //var search_regex = new RegExp('@'+req.params.username,'i');
      if(err) throw err;
      else if (question != null){
      var nods_per_page =  5;

      Users.findOne({_id:question.user},function(err,user){
        if (err) throw err;
        else
        {
          res.local('user', user);
          res.local('question', question);
          res.local('nods', question);
          res.local('account', user);
          if(account)
          {
            console.log('**Account!!',account._id, user._id);

            if(String(account._id) == String(user._id)){
              console.log('**same user');
              res.local('title', 'Commnity Mirror - Ask your friends ');
              res.render('askAgainNew');  
            }
            else{
              res.local('title', 'Commnity Mirror - Answer a question from '+user.fname);
              res.render('answer');
            }
          }
          else{
            res.local('title', 'Commnity Mirror - Answer a question from '+user.fname);
            res.render('answer');
          }              
        } 
      });
    }
    else{
      res.render('404'); //render page not found
    }
   });
 });
});
