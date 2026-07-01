let lista = [];

function renderizarTabela() {
    const tbody = document.getElementById("tabelaBolao")

    if (!tbody) return

    tbody.innerHTML = ""

    lista.forEach((item) => {
        const tr = document.createElement("tr")

        const tdId = document.createElement("td")
        tdId.textContent = item.id

        const tdJogo = document.createElement("td")
        tdJogo.textContent = item.jogo

        const tdParticipante = document.createElement("td")
        tdParticipante.textContent = item.participante

        const tdPalpite = document.createElement("td")
        tdPalpite.textContent = item.palpite

        const tdAcoes = document.createElement("td")

        const button = document.createElement("button")
        button.textContent = "Editar"
        button.className = "btn btn-sm btn-warning"
        button.addEventListener("click", () => editarNumero(item.id))
        tdAcoes.appendChild(button)

        const button2 = document.createElement("button")
        button2.textContent = "Excluir"
        button2.className = "btn btn-sm btn-danger"
        button2.addEventListener("click", () => deletarNumero(item.id))
        tdAcoes.appendChild(button2)

        

        tr.appendChild(tdId)
        tr.appendChild(tdJogo)
        tr.appendChild(tdParticipante)
        tr.appendChild(tdPalpite)
        tr.appendChild(tdAcoes)

        tbody.appendChild(tr)
    })
}

let idEdicao = null

function editarNumero(id) {
    const item = lista.find((palpite) => palpite.id === id)
    if (!item) return
    
    document.getElementById("jogo").value = item.jogo
    document.getElementById("participante").value = item.participante
    document.getElementById("palpite").value = item.palpite

    idEdicao = id;
    document.querySelector("#formBolao button[type='submit']").textContent = "Salvar edição"
}

async function listarPalpites() {
    const resposta = await fetch("/palpites")

    if (!resposta.ok) {
        console.error("Erro ao carregar palpites", resposta.status)
        return
    }

    lista = await resposta.json()
    renderizarTabela()

    if (!resposta.ok) {
        console.error("Erro ao carregar palpites", resposta.status)
        return
    }

    lista = await resposta.json()
    renderizarTabela()
}

async function adicionarNumero() {
    const jogo = document.getElementById("jogo").value.trim()
    const participante = document.getElementById("participante").value.trim()
    const palpite = document.getElementById("palpite").value.trim()

    if (!jogo || !participante || !palpite) {
        alert("Preencha todos os campos antes de salvar.")
        return
    }

    const resposta = await fetch("/palpites", {
    const jogo = document.getElementById("jogo").value.trim()
    const participante = document.getElementById("participante").value.trim()
    const palpite = document.getElementById("palpite").value.trim()

    if (!jogo || !participante || !palpite) {
        alert("Preencha todos os campos antes de salvar.")
        return
    }

    const resposta = await fetch("/palpites", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jogo,
            participante,
            palpite
            jogo,
            participante,
            palpite
        })
    })

    if (!resposta.ok) {
        const erro = await resposta.json()
        alert(erro.erro)
        return
    }

    const novoPalpite = await resposta.json()
    lista.push(novoPalpite)
    renderizarTabela()
    document.getElementById("formBolao").reset()
}

async function modificarNumero(id) {
    const jogo = document.getElementById("jogo").value.trim()
    const participante = document.getElementById("participante").value.trim()
    const palpite = document.getElementById("palpite").value.trim()

    })

    if (!resposta.ok) {
        const erro = await resposta.json()
        alert(erro.erro)
        return
    }

    const novoPalpite = await resposta.json()
    lista.push(novoPalpite)
    renderizarTabela()
    document.getElementById("formBolao").reset()
}

async function modificarNumero(id) {
    const jogo = document.getElementById("jogo").value.trim()
    const participante = document.getElementById("participante").value.trim()
    const palpite = document.getElementById("palpite").value.trim()

    await fetch(`/palpites/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jogo,
            participante,
            palpite
        })
    })
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jogo,
            participante,
            palpite
        })
    })
}

async function deletarNumero(id) {
    if (!confirm("Deseja excluir?")) {
        return
    }
        return
    }

    await fetch(`/palpites/${id}`, {
        method: "DELETE"
    })

    lista = lista.filter((item) => item.id !== id)
    renderizarTabela()
    await fetch(`/palpites/${id}`, {
        method: "DELETE"
    })

    lista = lista.filter((item) => item.id !== id)
    renderizarTabela()
}

function limparFormulario() {
    document.getElementById("formBolao").reset()
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formBolao")

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault()
            await adicionarNumero()
        })
    }

    listarPalpites()
})
    document.getElementById("formBolao").reset()
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formBolao")

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault()
            await adicionarNumero()
        })
    }

    listarPalpites()
})