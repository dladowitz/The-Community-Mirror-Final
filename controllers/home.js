app.all('/home', function(req, res){
  loadAccount(req,function(account){
    var nods_per_page = 5;
    var leader_limit = 5;
    var total = [];
    var userfName = [];
    var userlName = [];
    //Questions.find({},{},{sort: [['yes','descending'],['no','descending']]}, function(err,questionMax){
      
    if(account){
      console.log("Inside Home");
      /*Questions.find({},{},{sort: [['total','descending']], limit: leader_limit}, function(err,questionMax){
        console.log('Max yes responses', questionMax);
        /*for(i =0; i<questionMax.length; i++){
             (function(i) {
                setTimeout(function(){
                 questionMax[i].total = questionMax[i].yes+questionMax[i].no;
                 questionMax[i].save(function(err){
                  if (err) throw err;
                  });  
                }, 1000 * (i) );
             })(i);
          }*
          
          getQuestionUserInfo(questionMax, function(total1, userfName1, userlName1){
                  console.log('****Leaders found', total1, userfName1, userlName1)
                    total = total1;
                    userfName = userfName1;
                    userlName=userlName1;
                  console.log('****Leaders found', total1, userfName1, userlName1)*/
         
      Users.find({},{},{sort: [['totalResponses','descending']]}, function(err,userMax){
       // Users.find({},{'facebook_id':1},{sort: [['totalResponses','descending']]}, function(err,userAll) {             
        var u = userMax.slice(0,5);
        //console.log('Slice: ', u) 
        getUserRank(userMax, account.facebook_id, function(index){                       
          Questions.find({user:account._id},{},{sort: [['last_update','descending']], limit: nods_per_page},function(err,questions){
            if(err) throw err;
            else{
              if(questions==='undefined'){}
              else{
                /*res.local('total', total);
                res.local('userfName', userfName);
                res.local('userlName', userlName);*/
                //console.log('Users with max responses: ', userMax);
                res.local('leaders', u);
                res.local('nods', questions);
                res.local('account', account);
                res.local('rank',index+1)
                res.local('title', 'Community Mirror');
                try{
                  //console.log('**Showing profile page', res);
                  //Milind - Start
                  //res.setHeader('P3P',["policyref=/p3p.xml", "CP=''"]);
                  //console.log('P3p: ',res.getHeader('P3P'));
                  //Milind - End
                  res.render('profile', {layout: false});
                }
                catch(err){
                  res.render('404',{layout: false});
                }
              }
            }
          });
        });
      }); 
     // });
       // });
       //res.render('index', { layout: false});
      }
      else{
      //console.log('Nod: ', nods);
      res.local('nods', null);
      res.local('account', account);
      res.local('title', 'Community Mirror');
      try{
        //Milind - Start
        //res.setHeader('P3P',["policyref=/p3p.xml", "CP=''"]);
        //console.log('P3p: ',res.getHeader('P3P'));
        //Milind - End
        res.render('index', { layout: false });
        //res.render('contest', { layout: false });
      }
      catch(err){
      }
    }
    
  });
  getQuestionUserInfo= function(questionMax, callback){
    var userfName=[];
    var userlName=[];
    var total=[];
    var userFacebookId = [];
    for(i =0; i<questionMax.length; i++){
           (function(i) {
              setTimeout(function(){
               Users.findOne({_id:questionMax[i].user},function(err,user){
                if (err) throw err;
                else
                {
                         console.log("***USER found",user);
                         console.log('======='+i+': ',questionMax[i]);
                         total[i] = questionMax[i].total;
                         userfName[i] = user.fname;
                         userlName[i] = user.lname;
                         userFacebookId[i] = user.facebook_id;
                } 
                 if(i== questionMax.length-1){                  
                  callback(total, userfName, userlName);
                }
                });  
              }, 1000 * (i) );
           })(i);
        }

  }
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

