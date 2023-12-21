const socket = io();

var chats = document.querySelector('.chats');
var user_list = document.querySelector('.user-list');
var user_count = document.querySelector('.user-count');
var user_msg = document.querySelector('#user-msg');
var msg_send = document.querySelector('#msg-send');


var username;

do{
   var username = prompt('enter user name: ')
}while(!username)

socket.emit('new-user-joined', username);

socket.on('user-joined',(socket_name)=>{
   // console.log(socket_name);
    userJoinLeft(socket_name,'joined');
    
});


function userJoinLeft(name , status){
    let div = document.createElement('div')  
    div.classList.add('user-join');
    let content = `<p><b>${name}</b> is ${status} chats</p>`;
    div.innerHTML= content;
    chats.appendChild(div);
   // scrollToBottom();
}

socket.on('user-disconnected',(user)=>{
    userJoinLeft(user,'left');
});

socket.on('user-list',(users)=>{
    console.log(users);
    user_list.innerHTML="";
    users_arr = Object.values(users);
    for(i=0;i<users_arr.length; i++){
        let p =document.createElement('p');
        p.innerText= users_arr[i];
        user_list.appendChild(p);
    }
    user_count.innerHTML= users_arr.length;
});

msg_send.addEventListener('click',()=>{
    let data ={
        user:username,
        msg:user_msg.value
    }
    if(user_msg.value!=''){  
    appendMessage(data,'outgoing');
    socket.emit('message',data);
    user_msg.value=''; 
 }
});

function appendMessage(data,status){
    let div = document.createElement('div');
    div.classList.add('message',status);
    let content= `  
    <h5>${data.user}</h5>
    <p>${data.msg}</p>`
    div.innerHTML= content;
    chats.appendChild(div);
    scrollToBottom()
};

socket.on('message',(data)=>{
    appendMessage(data,'incoming');  
});

function scrollToBottom() {
    chats.scrollTop = chats.scrollHeight
}


