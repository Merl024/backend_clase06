
const socket = io()

let user
const chatBox = document.getElementById('chatBox')

//Implementacion de SweetAlert2

Swal.fire({
    icon: "info",
    title: "Ingresa tu nombre de usuario",
    input: "text",
    text: "Ingrese su nombre de usuario para identificarse en el chat",
    color: "purple", 
    inputValidator: (value) =>{
        if(!value){
            return 'Debes ingresar un nombre de usuario'
        } else{
            socket.emit('userConnected', { user: value })
        }
    },
    //Esto es para evitar que el usuario pueda continuar en el pop up aunque presiones afuera de la box
    allowOutsideClick: false

}).then((result) => {
    user = result.value

    //Capturamos el user y lo mostramos en las pagina web.
    const name = document.getElementById('name')
    name.innerHTML = user
})

chatBox.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', { user: user, message: chatBox.value })
            chatBox.value = ''
        } else{
            Swal.fire({
                icon: 'warning', 
                title: "Cuidado",
                text: "Escribe un mensaje"
            })
        }
    }
})

//Escuchamos a todos los usuarios que esten conectados 
// recibimos un array de objetos ---> [{ user: 'Juan , message: 'Hola'}]
socket.on('messagesLogs', data => {
    const messagesLogs = document.getElementById('messageLogs')
    let logs = ''

    data.forEach(log => {
        logs += `<div><span>${log.user}: </span>${log.message}</div>`
    });

    messagesLogs.innerHTML = logs
})

socket.on('userConnected', data => {
    let message = `Nuevo usuario conectado ${data}`
    Swal.fire({
        icon: 'info',
        title: "Nuevo usuario conectado",
        text: message,
        toast: true
    })
})

const closeChat = document.getElementById('closeChat')
closeChat.addEventListener('click', (evento)=> {
    socket.emit('closeChat', { close: 'close' })
    messageLogs.innerHTML = ''
})