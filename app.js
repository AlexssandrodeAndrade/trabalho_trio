const express = require('express');

const app = express();
app.use(express.json());
app.use(express.static('public'));
const PORT = 3000;

let proximoId = 1;

const palpites = [
  {
    id: proximoId++,
    jogo: 'Brasil x Argentina',
    participante: 'Alexssandro',
    palpite: '2x1',
  },
  {
    id: proximoId++,
    jogo: 'Brasil x Marrocos',
    participante: 'Alexssandro',
    palpite: '2x1',
  },
  {
    id: proximoId++,
    jogo: 'Brasil x Mexio',
    participante: 'Alexssandro',
    palpite: '2x1',
  },
];

//funções auxiliares
function validarCampoTexto(valor, nomeCampo) {
  if (valor === undefined || valor === null) {
    return `O campo ${nomeCampo} é obrigatório.`;
  }

  if (typeof valor !== 'string') {
    return `O campo ${nomeCampo} deve ser um texto.`;
  }

  if (valor.trim() === '') {
    return `O campo ${nomeCampo} não pode estar vazio.`;
  }

  return null;
}

function validarPalpite(dados) {
  const erroJogo = validarCampoTexto(dados.jogo, 'jogo');
  if (erroJogo) return erroJogo;

  const erroParticipante = validarCampoTexto(dados.participante, 'participante');
  if (erroParticipante) return erroParticipante;

  const erroPalpite = validarCampoTexto(dados.palpite, 'palpite');
  if (erroPalpite) return erroPalpite;

  return null;
}

function obterId(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      erro: 'ID inválido.',
    });
    return null;
  }

  return id;
}

function buscarPalpitePorId(id) {
  return palpites.find((palpite) => palpite.id === id);
}

function buscarIndicePalpite(id) {
  return palpites.findIndex((palpite) => palpite.id === id);
}

function criarPalpite(dados) {
  return {
    id: proximoId++,
    jogo: dados.jogo.trim(),
    participante: dados.participante.trim(),
    palpite: dados.palpite.trim(),
  };
}

function atualizarPalpite(palpite, dados) {
  palpite.jogo = dados.jogo.trim();
  palpite.participante = dados.participante.trim();
  palpite.palpite = dados.palpite.trim();
}

//rotas
app.get('/palpites', (req, res) => {
  res.json(palpites);
});

app.post('/palpites', (req, res) => {
  const erro = validarPalpite(req.body);

  if (erro) {
    return res.status(400).json({ erro });
  }

  const novoPalpite = criarPalpite(req.body);

  palpites.push(novoPalpite);

  res.status(201).json(novoPalpite);
});

app.put('/palpites/:id', (req, res) => {
  const id = obterId(req, res);

  if (id === null) {
    return;
  }

  const erro = validarPalpite(req.body);

  if (erro) {
    return res.status(400).json({ erro });
  }

  const palpiteEncontrado = buscarPalpitePorId(id);

  if (!palpiteEncontrado) {
    return res.status(404).json({
      erro: 'Palpite não encontrado.',
    });
  }

  atualizarPalpite(palpiteEncontrado, req.body);

  res.json(palpiteEncontrado);
});

app.delete('/palpites/:id', (req, res) => {
  const id = obterId(req, res);

  if (id === null) {
    return;
  }

  const indice = buscarIndicePalpite(id);

  if (indice === -1) {
    return res.status(404).json({
      erro: 'Palpite não encontrado.',
    });
  }

  palpites.splice(indice, 1);

  res.json({
    mensagem: 'Palpite removido com sucesso.',
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
