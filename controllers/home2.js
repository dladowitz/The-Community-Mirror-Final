app.get('/', function(req, res){
  loadAccount(req,function(account){
    //
    var nods_per_page = 5;
   // nods = [];
    if(account){
      Questions.find({user:account._id},{},{sort: [['date','descending']], limit: nods_per_page},function(err,questions){
        if(err) throw err;
        else{
          if(questions==='undefined'){}
          else{
            //console.log('Questions: ',questions)
          /*for(var i = 0; i<questions.length;i++){
            Replies.findOne({question:questions[i]._id}, function(err,replies){
              nods[i]={text: 'Is this working?'//questions[i].text
                      ,yes:replies.yes
                      ,no:replies.no
                      ,date:replies.date}
            })
          }*/
           // getReplyPerQuestion(questions, function(nodes){
            //console.log('Nods: ', questions);
            res.local('nods', questions);
            res.local('account', account);
            res.local('title', 'Community Mirror');
            try{
              res.render('home');
            }
            catch(err){
            }
          }
        }
        });
      }
      else{
      //console.log('Nod: ', nods);
      res.local('nods', null);
      res.local('account', account);
      res.local('title', 'Community Mirror');
      try{
        res.render('home');
      }
      catch(err){
      }
    }
  });
  /*getReplyPerQuestion = function(questions,loadCallback){
    var nodes;
    var qText;
    for(var i = 0; i<questions.length;i++){
      qText = questions[i].text;

           loadReply= Replies.findOne({question:questions[i]._id}, function(err,replies, replyCallBack){
              if(nodes === 'undefined')
                node = {};
              node={text: qText
                      ,yes:replies.yes
                      ,no:replies.no
                      ,date:replies.date}
                      replyCallBack(node)
            })
          }
          console.log('Nodes: ',nodes)
;          loadCallback(nodes);
  }*/
});
