# CodeCam – IA para Estudantes

> Inteligência que transforma a imagem em compreensão.

Plataforma web que demonstra como o aplicativo mobile **CodeCam** funcionaria integrado a uma API de IA: o usuário captura uma imagem de anotações, slides ou quadro-negro e recebe automaticamente um **resumo**, lista de **tópicos** e **flashcards** gerados por inteligência artificial.

---

## Tecnologias utilizadas

| Tecnologia           | Versão         | Uso                                                 |
| -------------------- | -------------- | --------------------------------------------------- |
| React                | 18             | Biblioteca de UI com componentes funcionais         |
| Vite                 | 6              | Bundler e servidor de desenvolvimento               |
| React Router DOM     | 6              | Navegação entre páginas (SPA)                       |
| JavaScript (ES2022+) | —              | Lógica da aplicação                                 |
| Tailwind CSS         | 4.3.3          | Estilização por classes utilitárias                 |
| localStorage         | Web API nativa | Persistência local de dados                         |
| Math (built-in JS)   | —              | Operações matemáticas, randomização, arredondamento |

---

## Pré-requisitos

- **Node.js** ≥ 18
- **npm** ≥ 9

---

## Como instalar as dependências

```bash
cd codecam
npm install
```

---

## Como executar o projeto

### Modo desenvolvimento

```bash
npm run dev
```

Acesse **http://localhost:5173** no navegador.

### Configurando a API Gemini (opcional, mas recomendado)

A aplicação funciona sem chave (usando exemplos locais), mas para ver a IA real em ação:

1. Acesse [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) e gere uma chave gratuita.
   **(`.env`):**
   ```bash
   cp .env.example .env
   # edite .env e preencha VITE_GEMINI_API_KEY=AIza...
   ```
   Depois reinicie o servidor de desenvolvimento.

> O modelo usado é **gemini-3.6-flash**, que está no nível gratuito do Google AI Studio.

### Build de produção

```bash
npm run build
npm run preview   # visualizar o build localmente
```

## Armazenamento de dados

Todos os dados são salvos no **localStorage** do navegador sob a chave `codecam_capturas`. Nenhum dado é enviado para servidor externo.

---

## Uso de Math (operações matemáticas)

O projeto utiliza diversas operações do objeto `Math` nativo do JavaScript:

- `Math.random()` – geração de IDs únicos, escolha aleatória de respostas do banco de IA, randomização de latência simulada
- `Math.floor()` – arredondamento para baixo (índices, percentuais)
- `Math.round()` – arredondamento de médias e percentuais de confiança
- `Math.max()` / `Math.min()` – cálculo de valores extremos para escala dos gráficos de barra
- Algoritmo **Fisher-Yates** (com `Math.random`) – embaralhamento dos flashcards

Arquivo principal: `src/utils/stats.js` e `src/utils/aiMock.js`.

---

## Uso de Inteligência Artificial no projeto

> **Como a IA foi utilizada:**  
> Durante o desenvolvimento, utilizamos o Kiro como uma ferramenta de apoio, principalmente para tirar dúvidas, sugerir soluções de código e auxiliar em alguns ajustes pontuais. O desenvolvimento foi realizado pelo grupo, incluindo a estrutura dos componentes, estilização, implementação das funcionalidades e aplicação das regras de negócio.

> A IA também ajudou bastante nas fórmulas matemáticas, conceitos mais difíceis e na revisão de determinados trechos. As decisões sobre a organização e o funcionamento da aplicação foram definidas pelo grupo e ajustadas conforme os testes realizados durante o desenvolvimento.

---

## Projeto acadêmico

- **Instituição:** FIAP
- **Turma:** 1ESPW-26
- **Sprint:** 3
- **Ano:** 2025
- **Integrantes:**
  - Lívia Laur – RM: 569017
  - Lara Beatriz – RM: 572589
  - Rafael Dias – RM: 570504
  - Gustavo Pereira – RM: 570549
  - Luca Baccari – RM: 569807
