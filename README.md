# CodeCam — Plataforma de Estudos com IA

Plataforma web para geração de **resumos estruturados** e **flashcards interativos** a partir de um tema de aula, usando a API do Google Gemini.

---

## Funcionalidades

- **Gerar resumo** — visão estruturada com introdução, subtópicos numerados e conclusão
- **Gerar flashcards** — cartões embaralhados com flip 3D, avaliação (Acertei / Parcial / Errei) e placar em anel SVG animado
- **Gerar ambos** — resumo + flashcards em abas separadas no mesmo resultado
- **Histórico** — lista de todas as gerações com visualização inline, remoção individual e limpeza total
- **Estatísticas** — contadores de resumos, flashcards e dias de uso persistidos em `localStorage`

---

## Tecnologias

| Camada      | Tecnologia                            |
|-------------|---------------------------------------|
| Framework   | React 19 + Vite 6                     |
| Estilização | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Roteamento  | React Router DOM v7                   |
| IA          | Google Gemini API `gemini-2.0-flash`  |
| Persistência| `localStorage` nativo                 |

---

## Configuração da chave de API

A chave do Gemini é lida via variável de ambiente — **não é solicitada ao usuário**.

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```

2. Abra `.env` e substitua o valor:
   ```env
   VITE_GEMINI_API_KEY=AIzaSy...sua_chave_aqui
   ```

3. Obtenha sua chave gratuitamente em [Google AI Studio](https://aistudio.google.com/app/apikey).

> O arquivo `.env` está no `.gitignore` e nunca deve ser commitado.

---

## Instalação e execução

```bash
# 1. Instale as dependências
npm install

# 2. Configure a chave de API (ver seção acima)
cp .env.example .env

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no navegador.

---

## Build de produção

```bash
npm run build
```

Os arquivos gerados ficam em `dist/` e podem ser servidos por qualquer servidor estático (Vercel, Netlify, etc.).

> Em produção, defina `VITE_GEMINI_API_KEY` como variável de ambiente na plataforma de deploy — nunca inclua `.env` no repositório.

---

## Estrutura do projeto

```
src/
  components/
    FlashcardDeck.jsx   # Deck com flip 3D, avaliação e placar em anel SVG
    Header.jsx          # Barra glassmorphism com navegação
    Layout.jsx          # Wrapper com header e footer
    SummaryView.jsx     # Exibição estruturada do resumo
  pages/
    GeneratePage.jsx    # Formulário + resultado (hero, seletor de tipo, tabs)
    HistoryPage.jsx     # Histórico + estatísticas + barra de distribuição
  services/
    gemini.js           # Integração com a API Gemini (lê chave do .env)
  utils/
    math.js             # Utilitários: clamp, shuffle, scorePercent, generateId...
    storage.js          # localStorage: histórico, estatísticas
  App.jsx
  main.jsx
  index.css             # Paleta, tema global, utilitários Tailwind v4
```

---

## Utilitários matemáticos (`utils/math.js`)

| Função          | Operação principal          | Uso na aplicação                          |
|-----------------|-----------------------------|-------------------------------------------|
| `clamp`         | `Math.min` / `Math.max`     | Clampear progresso entre 0 e 1            |
| `randomInt`     | `Math.floor` + `Math.random`| Variar quantidade de flashcards (±1)      |
| `shuffle`       | Fisher-Yates + `Math.random`| Embaralhar deck de flashcards             |
| `scorePercent`  | `Math.round`                | Calcular percentual de acertos            |
| `progressRatio` | `clamp`                     | Barra de progresso do deck                |
| `formatPercent` | `Math.round`                | Exibir percentual na barra de distribuição|
| `daysSince`     | `Math.floor`                | Dias de uso na tela de estatísticas       |
| `generateId`    | `Date.now` + `Math.random`  | IDs únicos para entradas do histórico     |
| `scoreLabel`    | Comparações numéricas       | Rótulo de desempenho no resultado final   |

---

## Variáveis de ambiente

| Variável               | Obrigatória | Descrição                        |
|------------------------|-------------|----------------------------------|
| `VITE_GEMINI_API_KEY`  | Sim         | Chave da API do Google Gemini    |

---

## Observações

- Histórico e estatísticas ficam no `localStorage` do navegador — limpar o storage apaga tudo.
- A quantidade de flashcards pode variar ±1 em relação ao valor selecionado, por design.
- Nenhum backend próprio — toda comunicação ocorre diretamente entre o browser e a API do Google.
