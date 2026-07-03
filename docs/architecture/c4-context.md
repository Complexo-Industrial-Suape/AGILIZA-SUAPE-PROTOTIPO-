# System Context — Agiliza SUAPE

Visão de mais alto nível: quem usa o sistema e com que sistemas externos ele troca dados.

```mermaid
C4Context
  title System Context - Agiliza SUAPE

  Person(empresa, "Representante de Empresa", "Usuário de empresa que opera resíduos sólidos/oleosos no Complexo de Suape")

  System(agiliza, "Agiliza SUAPE", "SPA estática (HTML/CSS/JS) para cadastro de empresas, Solicitação de Anuência e APR digital")

  System_Ext(browser, "Navegador Web", "Executa o SPA e persiste todos os dados via localStorage (sem backend)")
  System_Ext(pages, "GitHub Pages", "Hospedagem estática do site, servida a partir do branch main")
  System_Ext(cdn, "CDNs públicas", "Font Awesome (ícones) e imagem de banner (Unsplash)")

  Rel(empresa, agiliza, "Cadastra empresa, solicita anuência e preenche APR", "HTTPS")
  Rel(agiliza, browser, "Lê/grava dados de empresas, solicitações e APRs", "localStorage")
  Rel(pages, agiliza, "Serve os arquivos estáticos do site")
  Rel(agiliza, cdn, "Carrega ícones e imagem de fundo", "HTTPS")
```

## Notas
- Não há backend, API ou banco de dados — todo o estado (empresas, solicitações de anuência, APRs, sessão) vive no `localStorage` do próprio navegador do usuário.
- O "sistema" Agiliza SUAPE é servido inteiramente como arquivos estáticos pelo GitHub Pages.
