# Dynamic Diagram — Fluxo "Nova APR"

Fluxo de requisição numerado para o cenário mais complexo do sistema: preenchimento de etapas da APR com cálculo de risco ao vivo e envio.

```mermaid
C4Dynamic
  title Dynamic Diagram - Preenchimento e envio de uma APR

  Person(empresa, "Representante de Empresa")

  Container_Boundary(spa, "SPA Agiliza SUAPE") {
    Component(pageApr, "page-apr.js", "Agiliza.Paginas.Apr", "Formulário de APR")
    Component(aprData, "apr-data.js", "Agiliza.AprData", "Regras T1+T2=T3 / criticidade")
    Component(storage, "storage.js", "Agiliza.Storage", "Persistência local")
    Component(nav, "nav.js", "Agiliza.Nav", "Navegação entre views")
  }

  ContainerDb(ls, "localStorage", "Web Storage", "agilizaSuape:aprs")

  Rel(empresa, pageApr, "1. Seleciona T1 (Exposição) e T2 (Efeito à Saúde) de uma etapa")
  Rel(pageApr, aprData, "2. calcularT3(t1, t2)")
  Rel(aprData, pageApr, "3. Retorna T3 (0-8)")
  Rel(pageApr, aprData, "4. getCriticidade(t3)")
  Rel(aprData, pageApr, "5. Retorna faixa (Irrelevante..Emergencial) + corClass")
  Rel(pageApr, empresa, "6. Atualiza badge de criticidade da etapa em tempo real")
  Rel(empresa, pageApr, "7. Confirma ciência das observações e assina, clica Enviar")
  Rel(pageApr, pageApr, "8. validarEtapas(): valida todas as etapas preenchidas")
  Rel(pageApr, storage, "9. saveApr(apr) - inclui a criticidade mais alta entre as etapas")
  Rel(storage, ls, "10. Grava em agilizaSuape:aprs")
  Rel(pageApr, nav, "11. navigateTo('dashboard-page')")

  UpdateRelStyle(pageApr, aprData, $textColor="blue", $offsetY="-10")
  UpdateRelStyle(pageApr, storage, $textColor="green", $offsetY="-10")
```

## Notas
- Os passos 1-6 se repetem para cada etapa adicionada dinamicamente (`adicionarEtapa()` em `page-apr.js`), já que o cálculo de risco é recalculado a cada mudança de T1/T2 via listeners `input`/`change`.
- A criticidade "pior caso" entre todas as etapas é a que aparece no card resumido do dashboard.
