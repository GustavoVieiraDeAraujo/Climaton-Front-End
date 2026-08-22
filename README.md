# ClimatonBrasil

Front-end do **ClimatonBrasil 2026**, hackathon do TCU sobre transparência climática. Site em Next.js (App Router) que conta, numa Home de rolagem com um Hero e 12 seções numeradas, a distância entre o que já foi medido sobre o clima brasileiro e o que ainda é feito a respeito - cruzando Painel ClimaBrasil, AdaptaBrasil, Painel de Gastos Climáticos e ClimateScanner Global num banco único e auditado. Todo número vem do [Climaton-Back-End](https://github.com/GustavoVieiraDeAraujo/Climaton-Back-End), exceto as duas seções explicitamente marcadas como protótipo com dado fictício.

> **Back-End:** [Climaton-Back-End](https://github.com/GustavoVieiraDeAraujo/Climaton-Back-End)

---

## Sumario

- [Colaboradores](#colaboradores)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Rotas](#rotas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Requisitos](#requisitos)
- [Configuracao](#configuracao)
- [Como Executar](#como-executar)
- [Arquitetura](#arquitetura)

---

## Colaboradores

| Nome |
| --- |
| Gustavo Vieira de Araújo |
| Iverson Cintra de Andrade Ferreira |
| Thayna Gonçalves Dutra |
| Dryeli da Silva Bandeira |

---

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| Next.js 16 (App Router) | Framework React, roteamento por arquivo, Turbopack |
| React 19 | Biblioteca de componentes |
| TypeScript | Tipagem de todo o código do site |
| Tailwind CSS 4 | Estilização utilitária (config CSS-first via `@theme`, sem `tailwind.config.js`), combinada com CSS customizado em `app/globals.css` pro design system próprio do site (paleta verde/lima, seções, cards) |
| react-globe.gl | Globo 3D interativo da seção Território (27 capitais coloridas por prioridade) |
| react-simple-maps | Mapa 2D do Brasil da seção Mapa |
| @rive-app/react-canvas | Animação do mascote narrador (StoryCloud), 6 expressões num único arquivo `.riv` |
| recharts | Biblioteca de gráficos (usada nos painéis das páginas de Eixo) |
| lucide-react | Ícones |
| shadcn + class-variance-authority + tailwind-merge | Convenções de componente de UI usadas nas páginas de Eixo |
| playwright-core | Automação de navegador (Edge do sistema) usada só em scripts de verificação visual durante o desenvolvimento, não faz parte do build |

---

## Funcionalidades

| Funcionalidade | Implementacao |
| --- | --- |
| Narrativa em 12 seções de rolagem | `app/page.tsx` + `components/sections/*.tsx`, dado buscado via `hooks/use-home-data.ts` |
| Globo 3D interativo | `components/risk-globe.tsx` - as 27 capitais coloridas por prioridade real (risco físico x capacidade institucional), com anel de destaque na capital selecionada |
| Mapa 2D do Brasil | `components/brazil-map.tsx` - mesma lógica de prioridade, projeção geográfica real com `react-simple-maps` |
| Matriz de prioridade (scatter) | `components/territorios-scatter.tsx` - os 51 territórios num gráfico de dispersão risco x capacidade, com painel de detalhe ao passar o mouse/clicar |
| Comparação Brasil x Mundo | `components/comparacao-brasil-mundo.tsx` - gráfico "dumbbell" ligando a média subnacional real, a nota do Brasil-país e a média mundial, por componente |
| Ranking de gastos por órgão | `components/gasto-por-orgao.tsx` - alterna entre as 3 dimensões paralelas do Painel de Gastos Climáticos |
| Relatos da Comunidade (protótipo) | `components/sections/relatos-section.tsx` - feed de sinais de alerta cidadãos (rachadura, erosão, nível de água subindo); **dado fictício**, rotulado como tal na própria seção |
| Rede de Apoio (protótipo) | `components/sections/rede-apoio-section.tsx` - grafo interativo (SVG, sem lib externa) do relato até o TCU, com busca em largura (BFS) mostrando todos os caminhos possíveis a partir da cidade clicada, incluindo uma rede regional fictícia entre cidades vizinhas de região |
| Assistente Ekina (assistente de IA) | `components/data-chatbot.tsx` - conversa com o back-end (`POST /chat`), executa ações no site (ex.: rolar até uma seção) quando o back-end devolve uma `action` |
| Narrador animado (StoryCloud) | `components/story-cloud.tsx` - mascote com 11 capítulos (um por seção), avança sozinho ao rolar a página ou em modo "tour" automático, expressão facial escolhida pelo tom de cada achado |
| Painéis de Eixo (Governança / Políticas Públicas / Financiamento) | `app/eixo/[slug]/page.tsx` - KPIs, gráfico de componentes, distribuição por estágio, quebra por macrorregião IBGE, ranking completo dos 51 territórios, e (só em Financiamento) o painel de gastos recuperação-vs-prevenção |
| Painel de acessibilidade | `components/accessibility-panel.tsx` - tamanho de texto, contraste e tema, sempre com padrão "Padrão/Padrão/Claro" (não segue preferência do sistema operacional) |
| VLibras | `components/vlibras-widget.tsx` - widget oficial do governo para tradução em Libras |

---

## Rotas

| Rota | Página | Descrição |
| --- | --- | --- |
| `/` | Home | Hero + 12 seções numeradas: História (01), Eixos (02), Território (03, globo), Prioridades (04), Mapa (05), Relatos (06, fictício), Rede de Apoio (07, fictício), Cobertura (08), Insights (09), Comparação Brasil x Mundo (10), Ação (11), Fontes e Créditos (12) |
| `/eixo/[slug]` | Painel de Eixo | `slug` = `governanca`, `politicas-publicas` ou `financiamento` - painel dedicado com gráficos, ranking completo dos 51 territórios e leitura editorial de cada eixo |

---

## Estrutura do Projeto

| Diretorio / Arquivo | Descricao |
| --- | --- |
| `app/page.tsx` | Monta a Home: header fixo, as 12 seções em ordem, footer, narrador e chatbot |
| `app/globals.css` | Design system do site inteiro: paleta (`--green`, `--lime`, `--paper`...), temas claro/escuro/alto-contraste via atributos `data-*` no `html`, e o mapeamento das classes utilitárias do shadcn (`bg-primary`, `bg-card`, `border-border`...) usadas nas páginas de Eixo |
| `app/eixo/[slug]/page.tsx` | Painel dedicado de cada um dos 3 eixos |
| `hooks/use-home-data.ts` | Busca tudo que é reaproveitado por várias seções da Home de uma vez (territórios críticos, gastos, cobertura, panorama de capitais, série de recuperação/prevenção), com fallback de dados reais já confirmados enquanto a API não responde |
| `lib/api.ts` | Cliente único da API (`get`/`post` sobre `NEXT_PUBLIC_API_URL`) - todo tipo TypeScript espelha o formato de resposta do back-end |
| `components/sections/*.tsx` | Um componente por seção da Home, na mesma ordem em que aparecem em `app/page.tsx` |
| `components/risk-globe.tsx` / `brazil-map.tsx` | Globo 3D e mapa 2D, ambos consomem `GET /capitais` de forma independente |
| `components/territorios-scatter.tsx` / `comparacao-brasil-mundo.tsx` / `gasto-por-orgao.tsx` | Gráficos que se auto-buscam (não passam pelo `use-home-data.ts`, só usados por uma seção/página cada) |
| `components/story-cloud.tsx` | Narrador animado - `chapters`/`CHAPTER_ARTBOARD` e os `ids` de seção usados pra rolagem/rastreamento têm que ficar em sincronia com a ordem real de `app/page.tsx` |
| `components/mascot-rive.tsx` | Wrapper do arquivo `.riv` do mascote (6 expressões, um artboard por expressão) |
| `components/data-chatbot.tsx` | Janela de chat do Assistente Ekina |
| `components/header.tsx` / `footer.tsx` | Navegação fixa (duas linhas, sempre centralizadas) e rodapé |
| `components/accessibility-panel.tsx` | Painel de acessibilidade (tamanho de fonte, contraste, tema) |
| `components/vlibras-widget.tsx` | Widget oficial do VLibras |
| `public/mascot.riv` | Arquivo de animação do mascote |

---

## Requisitos

| Dependencia | Versao | Instalacao |
| --- | --- | --- |
| Node.js | 20 ou superior (testado com Node 24) | [nodejs.org](https://nodejs.org) ou um gerenciador de versões (`nvm`, `mise`) |
| pnpm | conforme `packageManager`/mais recente | `npm install -g pnpm` |
| Dependências do projeto | conforme `package.json` | `pnpm install` |
| [Climaton-Back-End](https://github.com/GustavoVieiraDeAraujo/Climaton-Back-End) | rodando localmente | ver README daquele repositório |

```bash
pnpm install
```

---

## Configuracao

A URL base da API é configurável pela variável de ambiente `NEXT_PUBLIC_API_URL` (lida em `lib/api.ts`). Se não for definida, o projeto cai de volta para `http://localhost:8000`, endereço padrão do [Climaton-Back-End](https://github.com/GustavoVieiraDeAraujo/Climaton-Back-End) rodando localmente.

```bash
# .env.local (não versionado)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Como Executar

```bash
# instala as dependências
pnpm install

# sobe o servidor de desenvolvimento em http://localhost:3000
pnpm dev

# gera o build de produção
pnpm build

# serve o build de produção localmente
pnpm start
```

O back-end (`Climaton-Back-End`) precisa estar rodando em paralelo (`http://localhost:8000` por padrão) pra qualquer dado real aparecer - sem ele, as seções caem nos valores de fallback já embutidos no código (os mesmos números reais, não um placeholder).

---

## Arquitetura

| Camada | Responsabilidade |
| --- | --- |
| `app/page.tsx` | Orquestra a Home: ordem das seções, dados compartilhados via `use-home-data.ts` |
| Seções (`components/sections`) | Uma por bloco da narrativa; a maioria só recebe dados prontos via props |
| Componentes de visualização (`risk-globe`, `brazil-map`, `territorios-scatter`, `comparacao-brasil-mundo`, `gasto-por-orgao`, `rede-apoio-section`) | Peças reutilizáveis de gráfico/mapa/grafo, cada uma falando com um endpoint específico da API ou (Rede de Apoio, Relatos) usando dado fictício declarado |
| Serviço HTTP (`lib/api.ts`) | Único ponto de acesso à API, com um tipo TypeScript por formato de resposta do back-end |
| Narrador (`story-cloud.tsx` + `mascot-rive.tsx`) | Camada de apresentação paralela à Home, sincronizada por `id` de seção |
| Back-End (Climaton-Back-End) | API REST externa, fonte de todo dado real e do assistente de IA |

---

> Documentacao gerada com auxilio de IA. Ferramentas de IA usadas no desenvolvimento deste projeto: [Claude Code](https://claude.com/claude-code) (Anthropic) e [v0](https://v0.app/) (Vercel).
