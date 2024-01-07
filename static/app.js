class Chatbox {
    constructor() {
      this.args = {
        openButton: document.querySelector('.chatbox__button'),
        chatBox: document.querySelector('.chatbox__support'),
        sendButton: document.querySelector('.send__button'),
        audioButton: document.querySelector('.audio__button'),
        languageSelect: document.querySelector('#language-select'), // assuming you have an id for the select element
    };
    
    this.state = false;
    this.messages = [];
    this.language = "fr";
    }

    display() {
      const { openButton, chatBox, sendButton, audioButton, languageSelect } = this.args;
    
      openButton.addEventListener('click', () => this.toggleState(chatBox));
    
      sendButton.addEventListener('click', () => this.onSendButton(chatBox));
    
      audioButton.addEventListener('click', () => this.onAudioButton(chatBox));
    
      languageSelect.addEventListener('change', () => this.changeLanguage()); // Add this line
    
      const node = chatBox.querySelector('input');
      node.addEventListener("keyup", ({ key }) => {
        if (key === "Enter") {
          this.onSendButton(chatBox);
        }
      });
    }
    

    toggleState(chatbox) {
        this.state = !this.state;
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }
   changeLanguage() {
  var language = this.args.languageSelect.value;
  this.language=language;
  console.log("Selected Language:", language);
   }

playAudio(message){
  fetch('http://127.0.0.1:5000/play', {
    method: 'POST',
    body: JSON.stringify({'language':this.language, message:  decode_utf8(message)}),
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
  }).catch((error) => {
    console.error('Error:', error);
    this.updateChatText(chatbox)
    textField.value = ''
  });

}

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({'language':this.language, 'message': text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "dbachat", message: decode_utf8(r.answer) };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            fetch('http://127.0.0.1:5000/play', {
            method: 'POST',
            body: JSON.stringify({ 'language':this.language,'message': decode_utf8(r.answer) }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }

    // onAudioButton(chatbox) {
    //     fetch('http://127.0.0.1:5000/audio', {
    //         method: 'POST',
    //         body: JSON.stringify({ message: null }),
    //         mode: 'cors',
    //         headers: {
    //           'Content-Type': 'application/json'
    //         },
    //       })
    //       .then(r => r.json())
    //       .then(r => {
    //         let question = { name: "User", message: decode_utf8(r.question) };
    //         let response = { name: "dbachat", message: decode_utf8(r.answer) };
    //         this.messages.push(question);
    //         this.messages.push(response);
    //         this.updateChatText(chatbox);
    //         textField.value = ''

    //     }).catch((error) => {
    //         console.error('Error:', error);
    //         this.updateChatText(chatbox)
    //         textField.value = ''
    //       });
    // }
    onAudioButton(chatbox) {
        // Affichage de la question avant d'envoyer la requête audio
        fetch('http://127.0.0.1:5000/audio', {
            method: 'POST',
            body: JSON.stringify({ message: null }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(r => r.json())
        .then(r => {
            let text1=decode_utf8(r.question);
            let question = { name: "User", message: decode_utf8(r.question) };
            this.messages.push(question);
            // this.updateChatText(chatbox); // Mettre à jour l'affichage avec la question
            fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({'language':this.language, 'message': text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "dbachat", message: decode_utf8(r.answer) };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            fetch('http://127.0.0.1:5000/play', {
            method: 'POST',
            body: JSON.stringify({'language':this.language,' message': decode_utf8(r.answer) }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
        })
        .then(response => response.json())
        .then(response => {
            let responseMessage = { name: "dbachat", message: decode_utf8(response.answer) };
            this.messages.push(responseMessage);
            this.updateChatText(chatbox); // Mettre à jour l'affichage avec la réponse
        })
        .catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox);
        });
    }
    

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "dbachat")
            {
              html += '<div class="messages__item messages__item--visitor"> <button class="chatbox__send--footer audio__button" data-message-index="'+index+'" onclick="toggleRecording2(this)"><div id="playIcon" class="icon-chat fas fa-volume-up"></div></button> </br>' + item.message + '</div>'
          }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

function decode_utf8( s )
{
  return decodeURIComponent( escape( s ) );
}
const chatbox = new Chatbox();
chatbox.display();
function toggleRecording2(button) {
  const messageIndex = button.getAttribute('data-message-index');
  const messageDiv = button.parentNode;
  const message = messageDiv.innerText.trim(); 
  const recordingIcon = document.getElementById('playIcon');
  const isRecording = recordingIcon.classList.contains('fa-volume-up');

    
    chatbox.playAudio(message); // Appel de la méthode de lecture audio via l'instance de Chatbox

} 