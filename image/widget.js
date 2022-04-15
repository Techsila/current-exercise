/* COMMAND CODE BY BENNO */

//This widget saves data at the SE_API with the names 'CChidden' and 'code'

let userOptions = {};
let channels = [];
let cc = document.getElementById("code-wrapper");
let code = document.getElementById("code");

window.addEventListener('onWidgetLoad', function (obj) {
  userOptions = obj['detail']['fieldData'];
  userOptions['channelName'] = obj['detail']['channel']['username'];
  loadCChidden();
  loadCode();  
});

window.addEventListener('onEventReceived', function (obj) {
  if (obj.detail.listener !== 'message') return;
  let data = obj.detail.event.data;
  let message = html_encode(data["text"]);
  let messageadd = "";
  if (message.indexOf(userOptions['command3']) === 0) {
    messageadd = message.substr(userOptions['command3'].length);
  } else if (message !== userOptions['command1'] && message !== userOptions['command2']) return;
  console.log("Got it! " + message);
  let user = data['nick'].toLowerCase();

  //Preparing userState object containing all user flags
  let userState = {
    'mod': parseInt(data.tags.mod),
    'sub': parseInt(data.tags.subscriber),
    'vip': (data.tags.badges.indexOf("vip") !== -1),
    'broadcaster': (user === userOptions['channelName'])
  };

  if ((userState.mod && userOptions['managePermissions'] === 'mods') || userState.broadcaster) {
    if (message == userOptions['command1']) {    
      cc.classList.add("hidden");
      SE_API.store.set('CChidden', { CChidden: true });    
    } else if (message == userOptions['command2']) {
      cc.classList.remove("hidden");
      SE_API.store.set('CChidden', { CChidden: false });
    } else if (message.indexOf(userOptions['command3']) === 0) {
      code.innerHTML = messageadd;
      SE_API.store.set('code', { code: messageadd });
      cc.classList.remove("hidden");
      SE_API.store.set('CChidden', { CChidden: false });
    };
  };

  function html_encode(e) {
    return e.replace(/[\<\>\"\^]/g, function (e) {
      return "&#" + e.charCodeAt(0) + ";";
    });
  };
});

function loadCChidden() {
  SE_API.store.get('CChidden').then(obj => {
    if (obj == null) {
      cc.classList.add("hidden");
    } else if (obj.CChidden == false) {
      cc.classList.remove("hidden");
    } else {
      cc.classList.add("hidden");
    }
  });
}

function loadCode() {
  SE_API.store.get('code').then(obj => {
    if (obj == null) {
      code.innerHTML = "";
    } else if (obj.code == "") {
      code.innerHTML = obj.code;
    } else {
      code.innerHTML = obj.code;
    }
  });
}

/* Command fuction is based on: https://strms.net/custom-text_by_benno */

