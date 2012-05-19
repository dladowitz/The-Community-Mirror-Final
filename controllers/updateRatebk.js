app.post('/:id/rate', function(req, res){//show the question page to friends for rating
  //loadAccount(req,function(account){
    console.log('Inside post');
    Questions.findOne({_id:req.params.id},{},function(err,question){
      //var search_regex = new RegExp('@'+req.params.username,'i');
      if(err) throw err;
      else{
        console.log('Reply: ',req.body);
        if(req.body.yes === 'Absolutely!')
          question.yes++;
        else if (req.body.no === 'Not so much!')
          question.no++;
        question.last_update = new Date();
        question.save(function(err){
        if (err) throw err;
        else{
          console.log('Updated Question: ',question);
          //res.redirect('/');
          res.local('title', 'Community Mirror: Thank you!');
          res.render('thankyou', { layout: false });
          
        }
      });
    }
   });
 });
