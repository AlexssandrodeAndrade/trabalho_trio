let idExcluir = null;
let templateLinhaTabela = '';
let modalConfirmacao = null;
let modalConfirmacaoCarregada = false;
let btnConfirmarAcao = null;
let tempoMensagem = null;

const formBolao = document.getElementById('formBolao');
const tabelaBolao = document.getElementById('tabelaBolao');

const statusFormulario = document.getElementById('statusFormulario');
const tituloFormulario = document.getElementById('tituloFormulario');
const descricaoFormulario = document.getElementById('descricaoFormulario');
const badgeFormulario = document.getElementById('badgeFormulario');
const btnSalvarPalpite = document.getElementById('btnSalvarPalpite');
const btnCancelarEdicao = document.getElementById('btnCancelarEdicao');
const mensagemSistema = document.getElementById('mensagemSistema');

formBolao.addEventListener('submit', salvarPalpite);
btnCancelarEdicao.addEventListener('click', limparFormulario);

async function iniciarSistema() {
  definirModoCadastro();

  templateLinhaTabela = await carregarTemplate('linhaTabela.html');
  await listarPalpites();
}

async function listarPalpites() {
  const resposta = await fetch('/palpites');

  if (!resposta.ok) {
    exibirMensagem('danger', 'Erro ao carregar os palpites.');
    return;
  }

  const palpites = await resposta.json();

  tabelaBolao.innerHTML = '';

  palpites.forEach((item) => {
    const linha = criarLinhaPalpite(item);
    tabelaBolao.appendChild(linha);
  });
}

async function salvarPalpite(event) {
  event.preventDefault();

  const dadosFormulario = obterDadosFormulario(event.currentTarget);

  const dados = {
    jogo: dadosFormulario.jogo,
    participante: dadosFormulario.participante,
    palpite: dadosFormulario.palpite,
  };

  let resposta;

  if (dadosFormulario.id === null) {
    resposta = await fetch('/palpites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });
  } else {
    resposta = await fetch(`/palpites/${dadosFormulario.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });
  }

  if (!resposta.ok) {
    const erro = await resposta.json();

    exibirMensagem('danger', erro.erro || 'Erro ao salvar o palpite.');

    if (resposta.status === 404) {
      limparFormulario();
      await listarPalpites();
    }

    return;
  }

  const mensagemSucesso =
    dadosFormulario.id === null
      ? 'Palpite cadastrado com sucesso.'
      : 'Palpite atualizado com sucesso.';

  limparFormulario();
  await listarPalpites();

  exibirMensagem('success', mensagemSucesso);
}

async function editarPalpite(id) {
  const resposta = await fetch('/palpites');
  const palpites = await resposta.json();

  const palpiteEncontrado = palpites.find((item) => item.id === id);

  if (!palpiteEncontrado) {
    exibirMensagem('warning', 'Palpite não encontrado.');
    await listarPalpites();
    return;
  }

  formBolao.elements['id'].value = palpiteEncontrado.id;
  formBolao.elements['jogo'].value = palpiteEncontrado.jogo;
  formBolao.elements['participante'].value = palpiteEncontrado.participante;
  formBolao.elements['palpite'].value = palpiteEncontrado.palpite;

  definirModoEdicao(palpiteEncontrado.id);

  formBolao.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });

  formBolao.elements['jogo'].focus();
}

async function excluirPalpite(id) {
  idExcluir = id;

  await carregarModalConfirmacao();

  modalConfirmacao.show();
}

async function carregarModalConfirmacao() {
  if (modalConfirmacaoCarregada) {
    return;
  }

  const html = await carregarTemplate('modalConfirmacao.html');

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();

  document.body.appendChild(wrapper.firstElementChild);

  const modalElemento = document.getElementById('modalConfirmacao');

  btnConfirmarAcao = document.getElementById('btnConfirmarAcao');
  modalConfirmacao = new bootstrap.Modal(modalElemento);

  btnConfirmarAcao.addEventListener('click', confirmarExclusao);

  modalElemento.addEventListener('hide.bs.modal', () => {
    if (modalElemento.contains(document.activeElement)) {
      document.activeElement.blur();
    }
  });

  modalElemento.addEventListener('hidden.bs.modal', () => {
    idExcluir = null;

    const botaoSalvar = formBolao.querySelector('button[type="submit"]');

    if (botaoSalvar) {
      botaoSalvar.focus();
    }
  });

  modalConfirmacaoCarregada = true;
}

async function confirmarExclusao() {
  if (idExcluir === null) {
    return;
  }

  const idRemovido = idExcluir;

  const resposta = await fetch(`/palpites/${idRemovido}`, {
    method: 'DELETE',
  });

  if (!resposta.ok) {
    const erro = await resposta.json();

    modalConfirmacao.hide();

    exibirMensagem('danger', erro.erro || 'Erro ao excluir o palpite.');

    await listarPalpites();

    return;
  }

  modalConfirmacao.hide();

  if (Number(formBolao.elements['id'].value) === idRemovido) {
    limparFormulario();
  }

  await listarPalpites();

  exibirMensagem('success', 'Palpite excluído com sucesso.');
}

function obterDadosFormulario(formulario) {
  const formData = new FormData(formulario);

  return {
    id: formData.get('id') ? Number(formData.get('id')) : null,
    jogo: formData.get('jogo').trim(),
    participante: formData.get('participante').trim(),
    palpite: formData.get('palpite').trim(),
  };
}

function escaparHtml(valor) {
  return String(valor)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function criarLinhaPalpite(item) {
  const html = templateLinhaTabela
    .replace('{{id}}', escaparHtml(item.id))
    .replace('{{jogo}}', escaparHtml(item.jogo))
    .replace('{{participante}}', escaparHtml(item.participante))
    .replace('{{palpite}}', escaparHtml(item.palpite));

  const wrapper = document.createElement('tbody');
  wrapper.innerHTML = html;

  const linha = wrapper.firstElementChild;

  linha.querySelector('.btn-editar').addEventListener('click', () => editarPalpite(item.id));

  linha.querySelector('.btn-excluir').addEventListener('click', () => excluirPalpite(item.id));

  return linha;
}

function definirModoCadastro() {
  statusFormulario.className =
    'alert alert-success d-flex justify-content-between align-items-center';

  tituloFormulario.textContent = 'Modo cadastro';
  descricaoFormulario.textContent = 'Preencha os campos para cadastrar um novo palpite.';

  badgeFormulario.className = 'badge text-bg-success';
  badgeFormulario.textContent = 'Novo';

  btnSalvarPalpite.className = 'btn btn-success btn-lg flex-fill';
  btnSalvarPalpite.textContent = 'Salvar Palpite';

  btnCancelarEdicao.classList.add('d-none');
}

function definirModoEdicao(id) {
  statusFormulario.className =
    'alert alert-warning d-flex justify-content-between align-items-center';

  tituloFormulario.textContent = 'Modo edição';
  descricaoFormulario.textContent = `Você está editando o palpite ID ${id}. Salve para confirmar a alteração.`;

  badgeFormulario.className = 'badge text-bg-warning';
  badgeFormulario.textContent = `Editando #${id}`;

  btnSalvarPalpite.className = 'btn btn-warning btn-lg flex-fill';
  btnSalvarPalpite.textContent = 'Atualizar Palpite';

  btnCancelarEdicao.classList.remove('d-none');
}

function exibirMensagem(tipo, texto) {
  clearTimeout(tempoMensagem);

  mensagemSistema.className = `alert alert-${tipo}`;
  mensagemSistema.textContent = texto;
  mensagemSistema.classList.remove('d-none');

  tempoMensagem = setTimeout(() => {
    limparMensagem();
  }, 4000);
}

function limparMensagem() {
  mensagemSistema.className = 'alert d-none';
  mensagemSistema.textContent = '';
}

function limparFormulario() {
  formBolao.reset();
  formBolao.elements['id'].value = '';
  definirModoCadastro();
}

iniciarSistema();
