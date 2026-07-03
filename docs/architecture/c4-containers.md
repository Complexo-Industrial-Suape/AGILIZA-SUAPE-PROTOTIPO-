# Container Diagram — Agiliza SUAPE

Como o sistema é decomposto em partes executáveis/implantáveis.

```mermaid
C4Container
  title Container Diagram - Agiliza SUAPE

  Person(empresa, "Representante de Empresa", "Usuário final")

  System_Boundary(agiliza, "Agiliza SUAPE") {
    Container(spa, "SPA Agiliza SUAPE", "HTML5, CSS3, JavaScript (vanilla, sem framework)", "Única página com múltiplas views (home, login, cadastro, dashboard, solicitação, APR)")
    ContainerDb(storage, "localStorage", "Web Storage API do navegador", "Armazena empresas, solicitações de anuência, APRs e sessão sob o prefixo agilizaSuape:")
  }

  System_Ext(pages, "GitHub Pages", "Hospedagem estática (branch main + .nojekyll)")
  System_Ext(cdn, "CDN Font Awesome", "Ícones via cdnjs")

  Rel(empresa, spa, "Interage via navegador", "HTTPS")
  Rel(spa, storage, "Grava/lê dados", "Agiliza.Storage (wrapper JS)")
  Rel(pages, spa, "Serve arquivos estáticos")
  Rel(spa, cdn, "Carrega folha de ícones", "HTTPS")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

## Notas
- Não existem containers de servidor de aplicação, API ou banco de dados relacional/NoSQL — a "camada de dados" é inteiramente client-side (`localStorage`, acessado através do módulo `js/storage.js`).
- A SPA é um único artefato implantável: `index.html` + `style.css` + pasta `js/` + `assets/`.
