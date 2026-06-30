let lista = [];


let campo = document.getElementById("campo").value;
let id = document.getElementById("id").value;


function listarPalpites() {
    
}

function salvarPapites() {
    
}




async function consultarNumero() {
    const resposta = await fetch("/palpites")
    const usuario = await resposta.json()
    console.log(usuario);
}

async function adicionarNumero() {
   const adicionar = await fetch("/palpites", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jogo: jogo,
            participante: participante,
            palpite: palpite
        })
    });
    if (!adicionar.ok) {
       const erro = await adicionar.json();
       alert(erro.erro);
       return;
    }
}
    

async function modificarNumero() {
    await fetch(`/palpites/${id}`, {
       method: "PUT",
       headers: {
           "Content-Type": "application/json"
       },
       body: JSON.stringify({
        jogo: jogo,
        participante: participante,
        palpite: palpite
    })
    
   });

}

async function deletarNumero(id) {
    if (!confirm("Deseja excluir?")) {
       return;
   }

   await fetch(`/palpites/${id}`, {
       method: "DELETE"
   });
}

function limparFormulario() {
    
}