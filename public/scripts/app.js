const chatForm = new ChatForm(document.querySelector('.Form-chat')).render();
const chatHistory = new ChatHistory(document.querySelector('#chatHistory')).render();
//const Authorization = new Authorization(document.querySelector('.Form-login')).render();


chatHistory.listenChat();