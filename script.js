let nomeUsuario;
let usuario;
let mensagens = [];

function entradaNaSala(){
    nomeUsuario = prompt("Qual nome de usuário você deseja?");

    if (nomeUsuario === undefined || nomeUsuario === null || nomeUsuario === ''){
        alert("Preencha um nome, por favor!");
        atualizaPagina();
    }

    let usuario = { 
        name: nomeUsuario
    };

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usuario);
    promessa.then(deuCerto);
    promessa.catch(deuErro);

}

entradaNaSala();

function deuErro(erro){
    console.log(erro);

    if (erro.response.status === 400 && nomeUsuario !== undefined){
        alert('Já existe um usuário com este nome. Insira outro, por favor!');
    } 

    atualizaPagina();
}

function deuCerto (resposta){
    console.log(resposta);
}

function manterConexao(){

    let usuario = { 
        name: nomeUsuario
    };

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuario);
    promessa.then(deuCerto);
    promessa.catch(desconectado);
    console.log("O usuário está conectado!");
}

function desconectado(erro){
    console.log(erro);
    atualizaPagina();
}

function atualizaPagina(){
    window.location.reload();
}

function pegarMsgens (){
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(dadosChegaram);
}

pegarMsgens();

function dadosChegaram(resposta){
    console.log("deu tudo ok");

    mensagens = resposta.data;
    renderizarMsgens();
}

function renderizarMsgens (){

    const divMsgens = document.querySelector('.mensagens');
    divMsgens.innerHTML = '';

    for (let i = 0; i < mensagens.length; i++) {
        if (mensagens[i].type === "status"){
            if (mensagens[i].text === "entra na sala..."){
            let avisoStatus =  `<div class="status-sala"><h3>(${mensagens[i].time})</h3> <h1>${mensagens[i].from}</h1> entra na sala...</div>`;
            divMsgens.innerHTML += avisoStatus;
            }

            if (mensagens[i].text === "sai da sala..."){
            let avisoStatus =  `<div class="status-sala"><h3>(${mensagens[i].time}) </h3>  <h1>${mensagens[i].from} </h1> sai da sala...</div>`;
            divMsgens.innerHTML += avisoStatus;
            }
        }

        if (mensagens[i].type === "message"){
            let msgem =  `<div class="mensagem-todos"><h3>(${mensagens[i].time})</h3> <h1>${mensagens[i].from}</h1> para <h1>${mensagens[i].to}</h1>: ${mensagens[i].text}</div>`;
            divMsgens.innerHTML += msgem;
        }

        if (mensagens[i].type === "private_message" && mensagens[i].to === nomeUsuario){
            let msgemReservada  = `<div class="mensagem-privada"><h3>(${mensagens[i].time})</h3> <h1>${mensagens[i].from}</h1> reservadamente para <h1>${mensagens[i].to}</h1>: ${mensagens[i].text}</div>`;
            divMsgens.innerHTML += msgemReservada;
        }

        document.querySelector('.mensagens').lastChild.scrollIntoView();
    }
}

renderizarMsgens();

function enviarMsgem(){
    let msgem = document.querySelector('.mensagem-enviada').value;

    const mensagemEnviada = {
        from: nomeUsuario,
        to: "Todos",
        text: msgem,
        type: "message"
    }

    console.log(mensagemEnviada);

    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", mensagemEnviada);
    promessa.then(pegarMsgens);
    promessa.catch(atualizaPagina);

    document.querySelector('.mensagem-enviada').value = '';

    renderizarMsgens();
}

function avaliarConexao(){
    setInterval(manterConexao, 5000);
    setInterval(pegarMsgens, 3000);
}

avaliarConexao();






