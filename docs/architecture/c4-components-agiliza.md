# Component Diagram — SPA Agiliza SUAPE

Decomposição interna do container "SPA Agiliza SUAPE" nos módulos JS reais do repositório (`js/*.js`, carregados nessa ordem pelo `index.html`).

```mermaid
C4Component
  title Component Diagram - SPA Agiliza SUAPE

  Container_Boundary(spa, "SPA Agiliza SUAPE") {
    Component(aprData, "apr-data.js", "Agiliza.AprData", "Regras de negócio da APR: Tabela 1/2/3, calcularT3(t1,t2), getCriticidade(t3), observações importantes")
    Component(storage, "storage.js", "Agiliza.Storage", "Wrapper de localStorage: empresas, solicitações, APRs, sessão, geração de IDs")
    Component(masks, "masks.js", "Agiliza.Masks", "Máscaras de input: CNPJ e CEP")
    Component(nav, "nav.js", "Agiliza.Nav", "navigateTo(pageId): alterna classes view-active/view-hidden entre as páginas")

    Component(pageHome, "page-home.js", "Agiliza.initHome", "Wiring da home: abrir login")
    Component(pageLogin, "page-login.js", "Agiliza.initLogin", "Login mock (CNPJ/senha) e criação de sessão")
    Component(pageCadastro, "page-cadastro.js", "Agiliza.initCadastro", "Fluxo de categoria + cadastro de empresa, upload de documentos")
    Component(pageDashboard, "page-dashboard.js", "Agiliza.Paginas.Dashboard", "Lista solicitações e APRs da empresa logada")
    Component(pageSolicitacao, "page-solicitacao.js", "Agiliza.Paginas.Solicitacao", "Formulário de Solicitação de Anuência, validação de antecedência 36h")
    Component(pageApr, "page-apr.js", "Agiliza.Paginas.Apr", "Formulário de APR: etapas dinâmicas, cálculo de risco ao vivo, painel de referência")

    Component(app, "app.js", "Bootstrap", "Inicializa todos os módulos de página na carga do documento")
  }

  Rel(app, pageHome, "Inicializa")
  Rel(app, pageLogin, "Inicializa")
  Rel(app, pageCadastro, "Inicializa")
  Rel(app, pageDashboard, "Inicializa")
  Rel(app, pageSolicitacao, "Inicializa")
  Rel(app, pageApr, "Inicializa")

  Rel(pageHome, nav, "Navega para login")
  Rel(pageLogin, storage, "Cria sessão / lê empresa")
  Rel(pageLogin, nav, "Navega para dashboard")
  Rel(pageCadastro, masks, "Aplica máscaras CNPJ/CEP")
  Rel(pageCadastro, storage, "Salva empresa")
  Rel(pageCadastro, nav, "Navega para dashboard")
  Rel(pageDashboard, storage, "Lista solicitações e APRs")
  Rel(pageSolicitacao, storage, "Salva solicitação de anuência")
  Rel(pageApr, aprData, "Calcula T3 e criticidade")
  Rel(pageApr, storage, "Salva APR")

  UpdateLayoutConfig($c4ShapeInRow="4", $c4BoundaryInRow="1")
```

## Notas
- Todos os módulos publicam no namespace global `window.Agiliza` (padrão de "revealing module" simples, sem bundler).
- `apr-data.js` e `storage.js` são os únicos componentes sem dependência de DOM — puras regras de negócio e persistência, reutilizáveis por qualquer página.
- `nav.js` é o único ponto que manipula transição entre views (`.view-active` / `.view-hidden`), evitando lógica de navegação duplicada em cada página.
