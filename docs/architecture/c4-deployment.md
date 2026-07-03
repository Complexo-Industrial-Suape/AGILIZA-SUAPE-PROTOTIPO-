# Deployment Diagram — Agiliza SUAPE

```mermaid
C4Deployment
  title Deployment Diagram - Agiliza SUAPE

  Deployment_Node(devMachine, "Máquina do desenvolvedor", "Windows") {
    Deployment_Node(git, "Repositório Git local", "Git") {
      Container(repo, "AGILIZA-SUAPE-PROTOTIPO-", "index.html, style.css, js/, assets/, docs/", "Código-fonte versionado")
    }
  }

  Deployment_Node(github, "GitHub", "SaaS") {
    Deployment_Node(ghRepo, "Repositório público", "github.com") {
      Container(mainBranch, "branch main", "Git", "Fonte de deploy do Pages")
    }
    Deployment_Node(ghPages, "GitHub Pages", "Static hosting") {
      Container(sitePublicado, "Site publicado", "HTML/CSS/JS estático", "complexo-industrial-suape.github.io/AGILIZA-SUAPE-PROTOTIPO-/")
    }
  }

  Deployment_Node(userDevice, "Dispositivo do usuário", "Desktop/Mobile") {
    Deployment_Node(navegador, "Navegador", "Chrome/Firefox/Edge") {
      Container(spaRuntime, "SPA em execução", "JavaScript runtime", "Instância do Agiliza SUAPE")
      ContainerDb(ls, "localStorage", "Web Storage", "Dados da empresa logada")
    }
  }

  Rel(repo, mainBranch, "git push", "SSH/Git")
  Rel(mainBranch, sitePublicado, "Build & deploy automático do Pages")
  Rel(navegador, sitePublicado, "GET /index.html, /js/*.js, /style.css, /assets/*", "HTTPS")
  Rel(spaRuntime, ls, "Lê/grava dados")
```

## Notas
- Não há pipeline de CI/CD customizado: o próprio GitHub Pages observa pushes no branch `main` e publica o conteúdo estático (arquivo `.nojekyll` presente para evitar processamento Jekyll).
- Cada usuário tem seu próprio `localStorage` isolado por navegador/dispositivo — não há sincronização entre dispositivos (limitação conhecida do modelo "mock local" adotado).
