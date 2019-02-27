const socket = io('http://localhost:3000/?token=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzMyMjcyOGY1YWM5YzI3MjRkZDc4NTUiLCJkZWxldGVBdCI6Ik1vbiBKYW4gMDcgMjAxOSAwMTo1ODo0MCBHTVQrMDcwMCAoSW5kb2NoaW5hIFRpbWUpIiwiZnVsbE5hbWUiOnsiZmlyc3ROYW1lIjoiTmd1eWVuIiwibGFzdE5hbWUiOiJQYXNzd29yZCJ9LCJlbWFpbCI6ImhvbmdwaG9uZ0BnbWFpbC5jb20iLCJnZW5kZXIiOnRydWUsIl9fdiI6MCwiaWF0IjoxNTUwNzUyNzUwfQ.2Tq20MY0uKfTGmYdqpQsBjdoMRjPVXb3L-vvxs3J_Tk');
function sendMessage() {
  let message = document.getElementById('m').value;
  message = message.trim();
  if (message) {
    socket.emit('sendingMessage', {
      message: message,
    });
    document.getElementById('m').value = '';
  }
}

socket.on('sendingMessage', function(data) {
  let eleLi =  document.getElementById('messages');
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(data.message));
  eleLi.appendChild(li);
});

socket.on('nice game', function(data) {
  alert(data);
});

socket.on('error', function(error) {
  console.log(error);
});

function typingMessage() {
  socket.emit('sendingTyping', {
    message: 'A is typing message',
  });
}

function createGroup() {
  socket.emit(
      'creatingMessage',
      {
        message: 'Hello',
        author: '5c70ba241154623e68718241',
        group:'5c70ba241154623e68718241',
      },
      function(error, data) {
        if (error) {
          console.log(error);
        }
        console.log(data);
      }
  );
}

function createMessage() {
  socket.emit(
      'creatingGroup',
      {
        name: 'Chem gio',
        members: [1, 2],
        lastMessage: '5c70ba241154623e68718241',
        author: '5c70ba241154623e68718241',
        members: ['5c70ba241154623e68718241', '5c70ba241154623e68718241'],
        type: 'private'
      },
      function(error, data) {
        if (error) {
          console.log(error);
        }
        console.log(data);
      }
  );
}

// function login() {
//   const token = document.getElementById('token').innerHTML;

//   socket.emit('login', { token: token },
//   function(error, data) {
//     if (error) {
//       console.log(error);
//     }
//     console.log(data);
//   });
// }

function groupHtmlElement(group) {
  const HtmlElement = `
    <div class="chat_list" onclick="">
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

function appendGroup(group) {
  if (group.type === 'private') {
    const _group = group;   
    group.members.map(partner =>  {
      if (partner._id !== '5c749ea4c1b15ab38801f889') {
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
  console.log(user);
  $.ajax({
    type: "GET",
    url: 'http://localhost:3000/groups/'+ user.user._id +'/active',
    success: function(data){
      if (data.data.length !== 0) {
        data.data.map(group => appendGroup(group));
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