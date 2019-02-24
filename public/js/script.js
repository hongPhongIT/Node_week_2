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

function getActiveGroup() {
    const token = document.getElementById('token').innerHTML;
    console.log(token);
    socket.on('ge')
}