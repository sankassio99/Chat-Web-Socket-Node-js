const express = require("express")
const app = express();

const http = require("http").Server(app)
const serverSocket = require("socket.io")(http);//O io usa protocolo http/ é uma biblioteca assincrona 

app.use(express.static("public"))

const porta = 8000 ;

http.listen(8000, function(){
    console.log("Servidor iniciado em http://localhost:"+porta)
});

//abrir o navegador em http://localhost:8000

app.get("/", function (requisicao, resposta){
    resposta.sendFile(__dirname + "/index.html");
});

//"Ao ocorrer uma conecção essa função será execuada "
serverSocket.on('connection', function(socket){
    // console.log("Cliente conectado: " + socket.id);//id da conexão 
    
    //esse aqui é pra pegar o login
    socket.on('usuario', (nickName)=>{
        console.log(nickName+" conectado!")
        serverSocket.emit("usuario", nickName); //vamos emitir a mensagem(msg) para o cliente 
        socket.nickName = nickName ;
    })

    //esse metodo será exectado uma vez, apenas quando o susuario se conectar
    socket.on('chat msg', (msg)=>{
        console.log(`Msg recebida do cliente ${socket.nickName}: ${msg}`);
        serverSocket.emit("chat msg", `${socket.nickName}: ${msg}`); //vamos emitir a mensagem(msg) para o cliente 
    })//essa função será o ouvinte 

    socket.on('saiu', (nickName)=>{
        serverSocket.emit("saiu", `${socket.nickName}`); //vamos emitir a mensagem(msg) para o cliente
        console.log("Usuario "+ nickName+" saiu!"); 
    })//essa função será o ouvinte 
})


// serverSocket.on("connection", function(socket){
//     console.log("Cliente "+socket.id + " conectado");
//     socket.login = "";

//     socket.on("chat msg", function(msg){
//         if(socket.login == ""){
//             socket.login = msg;
//             msg = ("Cliente "+ socket.login +" entrou");
//             console.log(msg);
//             serverSocket.emit("chat msg", msg);
//             return;
//         }
//         console.log("Msg recebida do cliente "+ socket.login +": "+msg);
//         serverSocket.emit("chat msg", msg);
//     });

//     socket.on("status", function(msg){
//         serverSocket.emit("status", msg);
//     });
// });



