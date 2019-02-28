let groupChattingId = '';

const socket = io('http://localhost:3000/?token=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzMyMjcyOGY1YWM5YzI3MjRkZDc4NTUiLCJkZWxldGVBdCI6Ik1vbiBKYW4gMDcgMjAxOSAwMTo1ODo0MCBHTVQrMDcwMCAoSW5kb2NoaW5hIFRpbWUpIiwiZnVsbE5hbWUiOnsiZmlyc3ROYW1lIjoiTmd1eWVuIiwibGFzdE5hbWUiOiJQYXNzd29yZCJ9LCJlbWFpbCI6ImhvbmdwaG9uZ0BnbWFpbC5jb20iLCJnZW5kZXIiOnRydWUsIl9fdiI6MCwiaWF0IjoxNTUwNzUyNzUwfQ.2Tq20MY0uKfTGmYdqpQsBjdoMRjPVXb3L-vvxs3J_Tk');
function sendMessage() {
  const user = JSON.parse(window.localStorage.getItem('user'));
  let message = document.getElementById('messageConent').value;
  message = message.trim();
  if (message) {
    socket.emit('creatingMessage', {
      message: message,
      author: user.user._id,
      group: groupChattingId,
    },
    function(error, data) {
      if (error) {
        console.log(error);
      }
    });
    document.getElementById('messageConent').value = '';
  }
}

socket.on('sendingMessage', function(data) {
  const user = JSON.parse(window.localStorage.getItem('user'));
  if (data.author !== user.user._id) {
    messageComing(data)
  } else {
    messageSent(data);
  }
});

socket.on('error', function(error) {
  console.log(error);
});

function typingMessage() {
  socket.emit('sendingTyping', {
    message: 'A is typing message',
  });
}

function groupHtmlElement(group) {
  const HtmlElement = `
    <div class="chat_list" onclick="getConversation()" groupId=`+ group._id +`>  
      <div class="chat_people" id=`+ group._id +`>
        <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
        <div class="chat_ib">
          <h5>`+ group.name +` <span class="chat_date">Dec 25</span></h5>
          <p>`+ group.lastMessage +`</p>
        </div>
      </div>
    </div>
  `;

  const listChatBlock = $('.inbox_chat');
  listChatBlock.append(HtmlElement);
}

function appendGroup(group, userId) {
  if (group.type === 'private') {
    const _group = group;   
    group.members.map(partner =>  {
      if (partner._id !== userId) {
          _group.name = partner.fullName.firstName + ' ' + partner.fullName.lastName;
          groupHtmlElement(group);
      }
    })
  } else {
    groupHtmlElement(group);
  }
  return false;
}


function getActiveGroup() {
  const user = JSON.parse(window.localStorage.getItem('user'));
  if (user === null) {
    location.replace("http://localhost:3000/login");
  }

  socket.emit(
    'joinGroup',
    {
      id: user.user._id,
    },
    function(error, data) {
      if (error) {
        console.log(error);
      }
    })

  $.ajax({
    type: "GET",
    url: 'http://localhost:3000/groups/'+ user.user._id +'/active',
    success: function(data){
      if (data.data.length !== 0) {
        data.data.map(group => appendGroup(group, user.user._id));
      }
    }
 });
}

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  $.ajax({
    type: "POST",
    dataType: "json",
    data: {
      "email": email,
      "password": password
    },
    headers: {
      "accept": "application/json",
      "Access-Control-Allow-Origin":"*"
    },
    url: "http://localhost:3000/login",
    success: function (result) {
      if (result.isSuccess === true) {
        window.localStorage.setItem('user', JSON.stringify(result.data));
        location.replace("http://localhost:3000");          
      }
    },
    // error: function (e) {
    // 		console.log(e);
    // }
  });
}

function messageComing(msg) {
  const inComing = `
    <div class="incoming_msg">
      <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
      <div class="received_msg">
        <div class="received_withd_msg">
          <p>`+ msg.message +`
          </p>
          <span class="time_date"> 11:01 AM    |    June 9</span>
        </div>
      </div>
    </div>
  `;
  const message = $('.msg_history');
  message.append(inComing);
}

function messageSent(msg) {
  const outGoing = `
    <div class="outgoing_msg">
      <div class="sent_msg">
        <p>`+ msg.message +`
        </p>
        <span class="time_date"> 11:01 AM    |    June 9</span> 
      </div>
    </div>
  `;
  const message = $('.msg_history');
  message.append(outGoing);
}

function getConversation() {
  const groupId = this.event.path[2].attributes.id.value;
  groupChattingId = groupId;
  const user = JSON.parse(window.localStorage.getItem('user'));
  if (user === null) {
    location.replace("http://localhost:3000/login");
  }
  $.ajax({
    type: "GET",
    dataType: "json",
    headers: {
      "accept": "application/json",
      "Access-Control-Allow-Origin":"*"
    },
    url: 'http://localhost:3000/messages/'+ groupId +'/group',
    success: function (result) {
      if (result.isSuccess === true) {
        if (result.data.length !== 0) {
          result.data.map(message => {
            if (message.author !== user.user._id) {
              messageComing(message)
            } else {
              messageSent(message);
            }
          })
        }
      }
    },
    // error: function (e) {
    // 		console.log(e);
    // }
  });
}