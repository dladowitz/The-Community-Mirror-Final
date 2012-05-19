app.get('/question/all', function(req, res){
  loadAccount(req,function(account){
    //
    var nods_per_page = 5;
    var leader_limit = 5;
   // nods = [];
    if(account){
      Users.find({},{},{sort: [['totalResponses','descending']]}, function(err,userMax){
        var u = userMax.slice(0,5);
        getUserRank(userMax, account.facebook_id, function(index){ 
      Questions.find({user:account._id},{},{sort: [['last_update','descending']]},function(err,questions){
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
            res.local('leaders', u);
            res.local('nods', questions);
            res.local('account', account);
            res.local('rank',index+1)
               // res.local('title', 'Community Mirror');
            res.local('title', 'Community Mirror-All Questions');
            try{
              res.render('profile', { layout: false});
            }
            catch(err){
            }
          }
        }
        });
      });
      });
      }
      else{
      //console.log('Nod: ', nods);
      res.local('nods', null);
      res.local('account', account);
      res.local('title', 'Community Mirror');
      try{
        res.render('index', { layout: false});
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
  getUserRank = function(users,id,callback){
      var index = users.length;
      while(index-- && index != -1){
        //console.log('index: ', index, 'users[index].facebook_id: ', users[index],'id:',id)
        if(users[index].facebook_id === id){

          callback(index)
        }
      }
      if(index == -1){
        callback(-1)
      }
  }
});
