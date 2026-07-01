async function carregarTemplate(nomeArquivo) {
  const resposta = await fetch(`/templates/${nomeArquivo}`);

  if (!resposta.ok) {
    throw new Error(`Erro ao carregar template: ${nomeArquivo}`);
  }

  return await resposta.text();
}
