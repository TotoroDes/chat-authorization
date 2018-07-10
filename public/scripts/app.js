const chatForm = new ChatForm(document.querySelector('.Form-chat')).render();
const chatHistory = new ChatHistory(document.querySelector('#chatHistory')).render();

function delete_cookie(name) {
    document.cookie = name +'; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

document.querySelector('button.submit-exit').click(function () {
       delete_cookie('isLoggedIn=true');
});


chatHistory.listenChat();

