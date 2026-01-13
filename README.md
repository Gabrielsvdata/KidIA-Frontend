# 🤖 KIDIA Frontend

> **Chatbot infantil interativo** com interface amigável e colorida, desenvolvido em React.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![SASS](https://img.shields.io/badge/SASS-1.69.5-CC6699?logo=sass)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-10.16.4-0055FF?logo=framer)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Componentes](#-componentes)
- [Serviços](#-serviços)
- [Estilos](#-estilos)
- [Fluxo de Navegação](#-fluxo-de-navegação)
- [Instalação](#-instalação)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)

---

## 🎯 Sobre o Projeto

O **KIDIA** é um chatbot educativo desenvolvido especialmente para crianças. A interface foi projetada com cores vibrantes, animações suaves e um personagem pixel art amigável chamado **Kiko** 🤖.

### Principais Funcionalidades:
- 💬 Chat interativo com IA
- 👨‍👩‍👧 Sistema de perfis para múltiplas crianças
- 🔐 Autenticação de responsáveis
- 🎨 Interface colorida e responsiva
- ✨ Animações fluidas com Framer Motion
- 🎭 Modo convidado (sem login)

---

## 🛠 Tecnologias

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 18.2.0 | Biblioteca principal para construção da UI |
| **React DOM** | 18.2.0 | Renderização para navegadores |
| **Framer Motion** | 10.16.4 | Animações e transições |
| **SASS** | 1.69.5 | Pré-processador CSS |
| **React Icons** | 4.12.0 | Biblioteca de ícones |
| **React Scripts** | 5.0.1 | Scripts de build do Create React App |

---

## 📁 Estrutura do Projeto

```
kidia-frontend/
├── 📂 public/                    # Arquivos públicos estáticos
│   ├── index.html                # HTML principal
│   └── manifest.json             # Configuração PWA
│
├── 📂 src/                       # Código fonte
│   ├── 📂 componentes/           # Componentes React
│   │   ├── 📂 BalaoMensagem/     # Balões de chat
│   │   ├── 📂 ElementosFlutuantes/ # Decorações animadas
│   │   ├── 📂 PersonagemPixel/   # Robô Kiko (pixel art)
│   │   ├── 📂 RespostasRapidas/  # Sugestões de mensagens
│   │   ├── 📂 TelaAutenticacao/  # Login/Registro
│   │   ├── 📂 TelaChat/          # Tela principal do chat
│   │   ├── 📂 TelaInicial/       # Tela de boas-vindas
│   │   └── 📂 TelaSelecionarPerfil/ # Seleção de crianças
│   │
│   ├── 📂 contextos/             # Context API (estado global)
│   │   └── AutenticacaoContexto.jsx
│   │
│   ├── 📂 servicos/              # Serviços de API
│   │   ├── api.js                # Configuração base HTTP
│   │   ├── autenticacao.js       # Login/Registro/Logout
│   │   ├── chat.js               # Envio de mensagens
│   │   ├── criancas.js           # Gerenciamento de perfis
│   │   └── index.js              # Exportações centralizadas
│   │
│   ├── 📂 styles/                # Estilos globais SASS
│   │   ├── _variables.scss       # Variáveis (cores, fontes, etc)
│   │   ├── App.scss              # Estilos do App
│   │   └── index.scss            # Estilos globais
│   │
│   ├── App.jsx                   # Componente raiz
│   └── index.jsx                 # Ponto de entrada
│
├── 📂 build/                     # Build de produção (gerado)
├── package.json                  # Dependências e scripts
└── README.md                     # Este arquivo
```

---

## Componentes

### Estrutura de Componentes

Cada componente segue o padrão:
```
NomeComponente/
├── NomeComponente.jsx    # Lógica e JSX
└── NomeComponente.scss   # Estilos específicos
```

### Descrição dos Componentes

| Componente | Descrição |
|------------|-----------|
| **PersonagemPixel** | Robô Kiko em pixel art com animações (antenas, olhos, braços) |
| **TelaInicial** | Tela de boas-vindas com logo, entrada de nome e opções de login |
| **TelaAutenticacao** | Formulário de login/registro para responsáveis |
| **TelaSelecionarPerfil** | Grid de perfis de crianças + botão de adicionar |
| **TelaChat** | Interface principal do chat com mensagens e input |
| **BalaoMensagem** | Balão estilizado para mensagens (bot/usuário) |
| **RespostasRapidas** | Botões de sugestões clicáveis |
| **ElementosFlutuantes** | Emojis decorativos animados no background |

### Hierarquia de Telas

```
App
├── ElementosFlutuantes (sempre visível)
└── AnimatePresence
    ├── TelaInicial
    ├── TelaAutenticacao
    ├── TelaSelecionarPerfil
    └── TelaChat
        ├── PersonagemPixel
        ├── BalaoMensagem[]
        └── RespostasRapidas
```

---

## Serviços

### `api.js` - Configuração Base
```javascript
// Funções principais:
- apiRequest()       // Requisições HTTP com auto-refresh de token
- getAccessToken()   // Obtém token do localStorage
- saveTokens()       // Salva tokens JWT
- clearTokens()      // Limpa dados de autenticação
- estaAutenticado()  // Verifica se há token válido
```

### `autenticacao.js` - Autenticação
```javascript
- login(email, senha)              // Autenticar usuário
- registrar(nome, email, senha)    // Criar nova conta
- logout()                         // Encerrar sessão
- obterUsuarioAtual()              // Dados do usuário logado
- validarSenha(senha)              // Validação de força
```

### `chat.js` - Chat
```javascript
- verificarConexao()               // Health check da API
- obterSugestoes()                 // Sugestões de perguntas
- enviarMensagemRapida(msg)        // Chat sem autenticação
- enviarMensagem(msg, historico)   // Chat autenticado
- enviar(msg, historico, auth)     // Escolhe automaticamente
```

### `criancas.js` - Perfis de Crianças
```javascript
- listarCriancas()                 // Lista perfis do responsável
- adicionarCrianca(nome, idade, avatar) // Criar perfil
- selecionarCrianca(crianca)       // Define criança ativa
- obterCriancaSelecionada()        // Retorna criança atual
- obterAvatares()                  // Lista de avatares disponíveis
```

---

## 🎨 Estilos

### Sistema de Cores

```scss
// Cores Principais
$color-primary: #FF6B9D;      // Rosa (botões principais)
$color-secondary: #7C4DFF;    // Roxo (destaques)
$color-accent: #00E5FF;       // Ciano (acentos)

// Cores de Fundo
$bg-primary: #FFF5F8;         // Rosa claro
$bg-secondary: #F0E6FF;       // Lilás claro
$bg-gradient: linear-gradient(135deg, #FFF5F8, #F0E6FF, #E6F9FF);

// Cores do Robô Kiko
$robot-body: #7C4DFF;         // Corpo roxo
$robot-cheeks: #FF8FB3;       // Bochechas rosa
$robot-antenna: #FFD700;      // Antena dourada
```

### Convenção BEM

Todos os estilos seguem a metodologia **BEM** (Block Element Modifier):

```scss
.tela-chat {                    // Block
  &__cabecalho { }              // Element
  &__botao-enviar { }           // Element
  &__botao-enviar--desabilitado { } // Modifier
}
```

### Mixins Disponíveis

```scss
@include flex-center;           // Flexbox centralizado
@include flex-column;           // Flexbox coluna
@include button-bounce;         // Animação de hover
@include responsive(sm/md/lg);  // Media queries
@include pixel-border($color);  // Borda estilo pixel
```

---

## Fluxo de Navegação

```
┌─────────────────┐
│  TelaInicial    │
│  (Boas-vindas)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐  ┌─────────────────┐
│ Modo   │  │ TelaAutenticacao│
│Convidado│ │ (Login/Registro)│
└────┬───┘  └────────┬────────┘
     │               │
     │               ▼
     │      ┌─────────────────────┐
     │      │TelaSelecionarPerfil │
     │      │ (Escolher criança)  │
     │      └──────────┬──────────┘
     │                 │
     └────────┬────────┘
              │
              ▼
       ┌────────────┐
       │  TelaChat  │
       │ (Conversa) │
       └────────────┘
```

### Estados de Autenticação

| Estado | Descrição | Tela de Destino |
|--------|-----------|-----------------|
| Não autenticado | Usuário anônimo | TelaInicial → Chat (modo convidado) |
| Autenticado | Responsável logado | TelaInicial → Login → SelecionarPerfil → Chat |
| Criança selecionada | Perfil ativo | Chat com contexto personalizado |

---

## Instalação

### Pré-requisitos

- Node.js 16+ 
- npm ou yarn

### Passos

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>

# 2. Acesse a pasta
cd kidia-frontend

# 3. Instale as dependências
npm install

# 4. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 5. Inicie o servidor de desenvolvimento
npm start
```

---

## Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| **start** | `npm start` | Inicia servidor de desenvolvimento (porta 3000) |
| **build** | `npm run build` | Gera build otimizado para produção |
| **test** | `npm test` | Executa testes unitários |
| **eject** | `npm run eject` | Ejeta configurações do CRA (irreversível) |

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# URL da API Backend
REACT_APP_API_URL=http://localhost:5000/api

# Ambiente
NODE_ENV=development
```

### Variáveis Disponíveis

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `REACT_APP_API_URL` | `http://localhost:5000/api` | URL base da API backend |

---

## Autenticação

O sistema utiliza **JWT (JSON Web Tokens)** com refresh automático:

1. **Access Token**: Token de curta duração para requisições
2. **Refresh Token**: Token de longa duração para renovação

### Armazenamento (localStorage)

```javascript
kidia_access_token   // Token de acesso
kidia_refresh_token  // Token de renovação  
kidia_user           // Dados do usuário (JSON)
kidia_selected_child // Criança selecionada (JSON)
```

---

## 📱 Responsividade

Breakpoints definidos:

| Nome | Largura | Uso |
|------|---------|-----|
| `sm` | 576px | Mobile |
| `md` | 768px | Tablet |
| `lg` | 992px | Desktop pequeno |
| `xl` | 1200px | Desktop grande |

---

## 🤖 Personagem Kiko

O Kiko é o mascote do KIDIA, um robô amigável em **pixel art** com:

- 📡 Antenas com bolinhas douradas pulsantes
- 👀 Olhos que olham para os lados
- 😊 Bochechas rosa
- ❤️ Tela no peito com coração batendo
- 🤖 Braços que acenam
- 🎨 Cores em tons de roxo

---

## Licença

Este projeto é privado e de uso interno.

---

## Contato

Desenvolvido para crianças aprenderem de forma divertida!
# KidIA-Frontend
