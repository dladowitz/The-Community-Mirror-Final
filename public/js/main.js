script
  
  var fQid;
  function initialize(){
    FB.init({appId: '172451406173427', xfbml: true, cookie: true});
  }
  
  function postToFeed(qid, qText){
        var fQid = qid;
        //alert(fQid+" ,"+qText);
        //FB.init({appId: '172451406173427', xfbml: true, cookie: true});
        FB.ui({
          method: "stream.publish",          
          user_message_prompt: "Publish This!",
          message: qText,
          attachment: {
             name: qText,
             caption: "Help your friend by answering this question",
             description: "Here are your choices: ",
             href: 'http://apps.facebook.com/communitymirror/'+fQid,
             media:[
                {"type":"image",
                 "src":'https://www.thecommunitymirror.com/images/Logo.png',
                 "href":'http://apps.facebook.com/communitymirror/'
                 }],
             properties:{               
               "1.":{"text":"Not so much!","href":'http://apps.facebook.com/communitymirror/'+fQid+'/no'},
               "2.":{"text":"Absolutely","href":'http://apps.facebook.com/communitymirror/'+fQid+'/yes'}
             }
            },
          action_links: [{ text: 'Test yourself', href: 'http://apps.facebook.com/communitymirror/'}]
          },function(response) {
             if (response && response.post_id) {
               window.location.replace('/');
             } else {
               console.log(response);
               window.location.reload(true);
             }
         });
       }
