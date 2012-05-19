app.all('/', function(req, res){
	loadAccount(req,function(account){
    /*
   	  https://graph.facebook.com/?
      ids=[request_id1],[request_id2],[request_id3]&
      access_token=USER_ACCESS_TOKEN
   	*/
    if((req.url).indexOf("/?request_ids") > -1){
    //console.log('REQUEST Ids are: ', req.query.request_ids)
    console.log('Inside getRatedFromNotification');
    var a = (req.query.request_ids).split(',');
    var request_id = a[(a.length-1)];
    a.reverse();
    
    console.log('****A',a);
    //Questions.findOne({request_ids:request_id},function(err,question){
    Questions.find({request_ids:{$in: a}},function(err,question){
      
        var text=[];
        var questionId=[];
        var request_id=[];
        var userfName=[];
        var userlName=[];
     
      if(err) throw err;
      else if (question!= null && question.length > 0){
        console.log('***Question Found',question)
       for(i =0; i<question.length; i++){
          var requests = question[i].request_ids
          console.log('=======================================================',requests)
        var nods_per_page =  5;
        Users.findOne({_id:question[i].user},function(err,user){
          if (err) throw err;
          else
          {
                   console.log("***USER found",user);
                   text[i] = question[i].text;
                   questionId[i] = question[i]._id;
                   //send all the requests.. it doesn't matter if we ty to delete the old ones..
                   request_id[i] = question[i].request_ids;
                   userfName[i] = question[i].fname;
                   userlName[i] = question[i].lname;
                                          
          } 
        });
      }
       console.log('** inside for loop: ',text, userfName, userlName, questionId, request_id)
       /*res.local('user', user);
       res.local('question', question[0].text);
      res.local('id',question[0]._id);
      res.local('nods', question[0]);
      res.local('account', user);
      res.local('requestId', a);*/
      
      res.local('userfName', userfName);
      res.local('userlName', userlName);
      res.local('question', text);
      res.local('id',questionId);
      //res.local('nods', question[0]);
      res.local('account', userfName);
      res.local('requestId', request_id);
      if(account)
      {
        console.log('**Account!!',account._id, user._id);

        if(String(account._id) == String(user._id)){
          console.log('**same user');
          res.local('title', 'Community Mirror - Ask your friends ');
          res.render('askAgainNew', { layout: false });  
        }
        else{
          console.log('SHOWQUESTION 1')
          res.local('title', 'Community Mirror - Answer a question from your friends');
          res.render('answer', { layout: false });
        }
      }
      else{
        console.log('SHOWQUESTION 2')
        res.local('title', 'Community Mirror - Answer a question from your friends');
        res.render('answer', { layout: false });
      } 
    }
    else{
      console.log('404')
      res.local('title', 'Community Mirror - 404 Error!');
      res.local('nods', null);
      res.local('account', account);
      res.render('404', { layout: false }); //render page not found
    }
   });
   //------------------render page here----------------------------
   
            /**/
            //---------------------------------------------
}
else{
  console.log('Redirecting to home from getRatedFromNotification');
	res.redirect('/home');
}
 });

 
});