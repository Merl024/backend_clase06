// Configuracion de socket del lado del cliente

const socket = io()

//Cuando se emite un mensaje recibe dos parametros
// Una key y el mensaje
socket.emit('mensaje', 'Hola soy el cliente')

socket.on('mensaje2', data =>{
    console.log(data)
})

socket.on('broadcasts', (data) =>{
    console.log(data);
    
})

socket.on('evento_para_todos', data =>{
    console.log(data);
})
