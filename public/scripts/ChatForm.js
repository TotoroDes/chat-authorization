class ChatForm {
  constructor(rootElement = null) {
    this.rootElement = rootElement;

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', () => {
      console.log(xhr.responseText);
    });

    xhr.open('POST', '/chat');
    xhr.send(new FormData(event.target));
  }

  delegateEvents() {
    this.rootElement.addEventListener('submit', this.handleSubmit);
    return this;
  }

  render() {
    return this.delegateEvents();
  }
}