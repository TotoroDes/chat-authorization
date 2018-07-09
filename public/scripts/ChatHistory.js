class ChatHistory {
  constructor(rootElement = null) {
    this.rootElement = rootElement;

    this.listenChat = this.listenChat.bind(this);
  }

  addMessage(message = {}) {
    const messageNode = document.createElement('li');

    messageNode.setAttribute('data-message-id', message.id);
    messageNode.innerHTML += `<strong>${message.author}</strong>`;
    messageNode.innerHTML += `<p>${message.text}</p>`;

    this.rootElement.appendChild(messageNode);
  }

  listenChat() {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', () => {
      this.addMessage(JSON.parse(xhr.responseText));
      this.listenChat();
    });

    xhr.addEventListener('error', () => {
      this.listenChat();
    });

    xhr.open('GET', '/chat/new_message');
    xhr.send();
  }

  render() {
    return this;
  }
}