# Trabalho em Trio - CRUD Bolão da Copa

## Integrantes

- Alexssandro
- Alexsandro Koch
- Ian

## Responsabilidades

| Integrante | Responsabilidade |
|------------|------------------|
| Alexssandro | Backend (Node.js + Express + CRUD) |
| Alexsandro Koch | HTML, CSS e Bootstrap |
| Ian | JavaScript, Fetch API e integração com o backend |

## Objetivo do Projeto

Desenvolver um sistema de CRUD para um Bolão da Copa.

O sistema deverá permitir cadastrar, listar, editar e excluir palpites dos participantes.

As informações principais do sistema serão:

- ID
- Jogo
- Participante
- Palpite

## Organização das Branches

Cada integrante deverá trabalhar em uma branch própria.

```text
main
│
├── Alexssandro
│   └── Backend (Node.js + Express + CRUD)
│
├── Alexsandro-Koch
│   └── HTML + CSS + Bootstrap
│
└── Ian
    └── JavaScript + Fetch + Integração com a API
```

## Funcionalidades Implementadas

Atualmente o projeto possui um backend desenvolvido em Node.js com Express contendo um CRUD em memória para gerenciamento dos palpites.

### API

- Listar palpites
- Cadastrar novo palpite
- Alterar um palpite existente
- Excluir um palpite
- Validação dos dados recebidos
- Validação do ID informado
- Funções auxiliares para organização do código

### Endpoints

| Método | Rota | Descrição |
|---------|------|-----------|
| GET | /palpites | Lista todos os palpites |
| POST | /palpites | Cadastra um novo palpite |
| PUT | /palpites/:id | Atualiza um palpite |
| DELETE | /palpites/:id | Remove um palpite |

---

## Como executar o projeto

### Pré-requisitos

- Node.js instalado
- Git instalado

### Clonar o repositório

```bash
git clone https://github.com/AlexssandrodeAndrade/trabalho_trio.git
```

### Entrar na pasta

```bash
cd trabalho_trio
```

### Instalar as dependências

```bash
npm install
```

### Executar o servidor

```bash
npm start
```

Caso o projeto ainda não possua o script `start`, utilize:

```bash
node app.js
```

### Abrir no navegador

Frontend:

```text
http://localhost:3000
```

API:

```text
http://localhost:3000/palpites
```