express = require('express');
//https = require('https');

force_domain = require('connect-force-domain');
fs = require('fs');
var options = {
        key: fs.readFileSync('privatekey.pem'),
        cert: fs.readFileSync('thecommunitymirror_combined.crt')
        };
app = module.exports = express.createServer(options);//
sys = require('util');

queryString = require('querystring')
//http = require('http');

mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/communityMirrorBeta_1_2');
var dbref = require("mongoose-dbref");
var loaded = dbref.install(mongoose);
var authenticated = false;
var acc;

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var DBRef = mongoose.SchemaTypes.DBRef;


require('./models/users.js');
require('./models/questions.js');
require('./models/replies.js');


Users = mongoose.model('Users');
Questions = mongoose.model('Questions');
//Replies = mongoose.model('Replies');


connect = require('connect');
auth = require('connect-auth');

require('./fb_creds.js');

//mongoStore = require('connect-mongodb');

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
//  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(connect.cookieParser('commMirror'));
  app.use(express.session({
    //store: mongoStore({
    //  dbname: 'sessions',
    //  username: '',
   //   password: ''
   // }),
    secret: 'commsecret'
  }));
  //app.use(cookieSessions('commMirror'))
  app.use(express.logger({ format: ':date :remote-addr :method :status :url' }));
  app.use(auth([auth.Facebook({appId : fbId, appSecret: fbSecret, scope : ["publish_stream","share_item","email","read_friendlists","publish_actions"], callback: fbCallbackAddress})
  ]));
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var loadFacebookAccount = function(user,facebook_details,loadCallback){
  //console.log('****FACEBOOK DETAILS***',facebook_details)
  Users.findOne({ facebook_id: user.id }, function(err,account){
    if(account){
      /*account.totalQuestions=0;
      account.totalResponses = 0;
      account.save(function(err){*/
       //acc=n;
      loadCallback(account);
      //});
     // loadCallback(account);

    }
    else{
      var n = new Users();
      n.email = user.email;
      n.username = user.username;
      n.type = 1;
      n.fname = user.first_name;
      n.lname = user.last_name;
      n.facebook_id = user.id;
      n.date = new Date();
      n.timezone = facebook_details.timezone;
      n.totalResponses = 0;
      n.totalQuestions=0;
      n.save(function(err){
       //acc=n;
      loadCallback(n);
      });
    }
  });
}

loadAccount = function(req,loadCallback){
  if(req.isAuthenticated()){
    //load account out of database
    if(req.getAuthDetails().user.id){
      console.log('Authenticated: ',req.getAuthDetails())
      var fbook_details = req.getAuthDetails();
      //authenticated = true;
      loadFacebookAccount(fbook_details.user,fbook_details,loadCallback);
    }
  }
  else{
    console.log('Not authenticated!');
    acc=null;
    loadCallback(null);
  }
}
require('./global_funcs.js');

// Routes ( Controllers )
require('./controllers/home.js');
require('./controllers/auth.js');
require('./controllers/edit.js');
require('./controllers/nod.js');
require('./controllers/user.js');
require('./controllers/getRated.js');
require('./controllers/updateRate.js');
require('./controllers/updateRatetoYes.js');
require('./controllers/updateRatetoNo.js');
require('./controllers/showAll.js');
require('./controllers/getRatedPost.js');
require('./controllers/nodPost.js');
require('./controllers/getRatedFromNotification.js');
require('./controllers/thankyou.js');
require('./controllers/promotion.js');

//Only listen on $ node app.js   

if (!module.parent) {              
  app.listen(443); //,'communitymirror_dev'
 console.log("Express server listening on port %d", app.address().port)
 var everyone = require("now").initialize(app,{port:443});
 everyone.now.distributeMessage = function(message, acc){
  //call function to update question and send the qid
    console.log('Inside Distribute Message')
    if(acc){
      var n = new Questions();
      n.user=acc._id;     
      n.text = message;
      n.date = new Date();
      n.yes =0;
      n.no = 0;
      n.total = 0;
      n.last_update = new Date();
      //console.log('New Question: ', n)
      n.save(function(err){
        if (err) throw err;
        acc.questions.push(n._id);
      });
    
    everyone.now.receiveMessage(n._id, message);
    }
  };
  everyone.now.saveRequest = function(message, acc, request){
  //call function to update question and send the qid
    console.log('Inside save request',message, acc, request)
    if(acc){
      var n = new Questions();
      n.user=acc._id;     
      n.text = message;
      n.date = new Date();
      n.yes =0;
      n.no = 0;
      n.total = 0;
      n.request_ids.push(request);
      n.last_update = new Date();
      console.log('New Question: ', n)
      n.save(function(err){
        if (err) throw err;
        //acc.questions.push(n._id);
        else{
          Users.findOne({_id:n.user},function(err,user){
          user.questions.push(n._id);
          user.totalQuestions++;
          user.save(function(err){
            if (err) throw err;
            else{
              console.log('In saveRequest app.js: ',user)
            }
          });
        });
        }
      });
    
    everyone.now.receiveMessage('', 'sent');
    }
  };
  everyone.now.updateQuestionInfo = function(qid,request){
    console.log('UPDATEQUESTIONINFO: ', request);
    Questions.findOne({_id:qid},function(err,question){
      if(question){
        question.request_ids.push(request);
        question.save(function(err){
          if (err) throw err;
          else{
            console.log('Question saved Success',question)
            return true;
          }
        });
      }
      else{
        return false;
      }

    });
    everyone.now.sendMessage(true);
  };

  everyone.now.updateRating = function(qid,request,acc){
    console.log('** inside update Rating : ', qid)
    Questions.findOne({_id:qid},function(err,question){
      if (err) throw err;
      else{
        if(request === 'yes')
          question.yes++;
        else if (request === 'no')
          question.no++;
          question.total = question.yes+question.no;
          question.last_update = new Date();
          question.save(function(err){
          if (err) throw err;
          else{
            Users.findOne({_id:question.user},function(err,user){
            user.totalResponses++;
            user.save(function(err){
            if (err) throw err;
              else{
                console.log('** inside update Rating acc: ', user)
              }
            });
          });
        }
        });
      }
    });
    everyone.now.sendUpdate(true);
  };
  everyone.now.saveUser = function(req, name,value){
    console.log('Inside authenticate', req)
    //var acc;
    loadFacebookAccount(req,req,function(account){
        //console.log(req.headers.referer);
        //if(req.header('Referrer').substring(0,23) == 'http://www.facebook.com'){
          if(account){           
            console.log('Save the question', name);
            /*if(value === '1'){
              
            }*/
            everyone.now.authenticated(account, value);
        }
      });
      
    
  };
}
var redir = express.createServer();

redir.all('*', function(req, res){
  res.redirect('https://www.thecommunitymirror.com/');
});
 
redir.listen(80) 



  
