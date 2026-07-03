# Portal SUAPE & Agiliza SUAPE - Documentação Técnica

Protótipo funcional de uma SPA (Single Page Application) para o Complexo Industrial Portuário de Suape, cobrindo o fluxo completo do programa **Agiliza SUAPE** para empresas prestadoras de serviços ambientais:

*   Cadastro da empresa
*   Painel próprio da empresa
*   **Solicitação de Anuência para Retirada de Resíduos de Embarcação** (Portaria nº 99/2025)
*   **APR — Análise Preliminar de Riscos**, digital, com cálculo automático de risco e criticidade

100% estático — HTML/CSS/JS puro, sem build step e sem backend. Roda direto no navegador ou hospedado no GitHub Pages.

## 🚀 Estrutura do Projeto

```
index.html              Estrutura de todas as telas (SPA)
style.css                Estilização visual e layout responsivo
assets/                 Logos oficiais (SUAPE e Agiliza SUAPE)
js/
  apr-data.js             Tabelas de referência da APR + cálculo de risco (sem DOM)
  storage.js               Persistência em localStorage (empresas, solicitações, APRs, sessão)
  masks.js                  Máscaras de CNPJ e CEP
  nav.js                     Navegação entre telas (mostra/esconde .view)
  page-home.js               Lógica da página inicial (portal SUAPE)
  page-login.js               Login (mock) e login de empresa já cadastrada
  page-cadastro.js             Seleção de categoria + formulário de cadastro de empresa
  page-dashboard.js             Painel da empresa: lista Solicitações e APRs salvas
  page-solicitacao.js            Formulário de Solicitação de Anuência (Portaria 99/2025)
  page-apr.js                     Formulário digital da APR (frente + verso)
  app.js                            Ponto de entrada único (DOMContentLoaded)
docs/referencia/          Documentos oficiais usados como base para os formulários digitais
  APR FRENTE NOVA LOGO (1)(1).xls
  FOLHA VERSO ATUALIZADA (1)-1.pdf
  Solicitação - PORTARIA Nº 99_2025 (1)(1).docx
docs/architecture/        Diagramas C4 (Mermaid) da arquitetura do sistema
  c4-context.md
  c4-containers.md
  c4-components-agiliza.md
  c4-deployment.md
  c4-dynamic-nova-apr.md
```

Os arquivos em `docs/referencia/` são só material de consulta (os documentos originais que inspiraram os campos e regras dos formulários digitais) — não são carregados pela aplicação em tempo de execução.

---

## 1. Fluxo de telas (index.html)

Todas as telas vivem no mesmo `index.html`, marcadas com a classe `.view`, e são alternadas via JavaScript (`Agiliza.Nav.navigateTo(pageId)`):

*   **Home (`#home-page`)**: simula o portal oficial de SUAPE. O card **Agiliza SUAPE** é a porta de entrada.
*   **Login (`#login-page`)**: autenticação por CNPJ e senha.
*   **Seleção de categoria (`#cadastro-categoria-page`)**: só "Resíduos Sólidos e/ou Oleosos" está ativo; as demais mostram "Módulo em desenvolvimento".
*   **Cadastro de empresa (`#agiliza-page`)**: dados da empresa, classificação de serviço/operação e upload da documentação obrigatória.
*   **Painel da empresa (`#dashboard-page`)**: tela pós-login, lista as Solicitações de Anuência e APRs já enviadas pela empresa, com atalhos para criar novas.
*   **Solicitação de Anuência (`#solicitacao-page`)**: formulário de retirada de resíduos de embarcação, com validação de antecedência mínima de 36h.
*   **APR digital (`#apr-page`)**: formulário de Análise Preliminar de Riscos com etapas dinâmicas e cálculo de risco ao vivo.

### Login de demonstração
CNPJ **`0000`** / Senha **`0000`** entra com uma empresa de demonstração pré-criada. Também é possível "logar" com o CNPJ de qualquer empresa já cadastrada no navegador atual (qualquer senha não vazia é aceita, já que não existe backend/senha real).

---

## 2. Painel da empresa e persistência (localStorage)

Como o protótipo não tem backend, tudo é persistido em `localStorage`, sob chaves prefixadas com `agilizaSuape:`:

| Registro | Conteúdo |
|---|---|
| `empresas` | Dados de cadastro por `empresaId` (CNPJ só dígitos) |
| `solicitacoes` | Lista de Solicitações de Anuência (Portaria 99/2025) |
| `aprs` | Lista de APRs preenchidas, cada etapa já com T1, T2, T3 e criticidade calculados |
| `session` | `empresaId` da empresa logada no momento |

Uploads de arquivo só guardam o **nome do arquivo** e a data de validade informada — o conteúdo binário não é persistido (limitação assumida de um protótipo sem servidor).

---

## 3. APR — Análise Preliminar de Riscos (`js/apr-data.js`, `js/page-apr.js`)

Digitaliza a frente e o verso do formulário oficial de APR:

*   **Etapas dinâmicas**: cada etapa da atividade pode ser adicionada/removida livremente (mínimo de 1). Para cada etapa: ferramentas/materiais, tipo de controle (SST/MA), perigo/aspecto, dano/impacto, EPC, EPI/CA, e recomendações.
*   **Cálculo de risco ao vivo**: ao selecionar a **Exposição (T1)** e o **Efeito à Saúde (T2)** de cada etapa (Tabelas 1 e 2 do verso), o sistema calcula `T3 = T1 + T2` e resolve automaticamente a faixa de criticidade da Tabela 3 (Irrelevante → Relevante → Atenção → Crítico → Emergencial), exibida como um selo colorido.
*   **Painel de referência**: um acordeão retrátil reproduz as Tabelas 1, 2 e 3 e as 15 Observações Importantes do verso do formulário, com uma declaração de ciência obrigatória antes do envio.
*   No painel da empresa, cada APR salva mostra a pior criticidade entre suas etapas.

---

## 4. Solicitação de Anuência (`js/page-solicitacao.js`)

Reproduz o formulário da Portaria nº 99/2025 ("Solicitação de Anuência para Retirada de Resíduos de Embarcação"), com os campos:

*   Requerente e responsável
*   Embarcação / IMO
*   Tipo de navegação, tipologia e quantidade de resíduos
*   Berço de atracação
*   Início e término do serviço
*   Empresa prestadora

**Regra de antecedência mínima de 36 horas**: o campo "Início do serviço" é validado ao vivo e no envio — se faltar menos de 36h a partir do momento atual, o formulário mostra quanto tempo falta e bloqueia o envio, refletindo a exigência do documento oficial de enviar a solicitação com essa antecedência.

---

## 5. Estilização (style.css)

Segue o padrão institucional de SUAPE via variáveis CSS (`--suape-blue`, `--suape-yellow` etc.). Os componentes originais (`.form-section`, `.options-group`, `.doc-row`) são reaproveitados nas telas novas:

*   Painel: `.record-card`, `.status-badge`
*   Etapas da APR: `.etapa-row`, `.criticidade-badge`
*   Painel de referência: `.reference-panel`, `.tabela-referencia`

---

## 🛠️ Tecnologias Utilizadas
*   HTML5 (Semântico)
*   CSS3 (Variables, Flexbox, Grid)
*   JavaScript (ES6+, sem frameworks/bundler)
*   `localStorage` (persistência client-side)
*   FontAwesome (ícones)

---

## 📋 Como executar

Basta abrir `index.html` em qualquer navegador moderno — não é necessário servidor backend nem build step.

## 🌐 Publicação (GitHub Pages)

O repositório já está pronto para o GitHub Pages (site 100% estático, caminhos relativos, `.nojekyll` incluído): basta habilitar o Pages apontando para a branch `main` / raiz do repositório.
