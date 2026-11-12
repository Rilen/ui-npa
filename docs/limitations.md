# Limitações conhecidas

- A paleta é provisória e não é a identidade oficial do NPA.
- O tema escuro é experimental. Sombras não foram reajustadas e a demonstração não oferece seletor de tema.
- Não há família tipográfica própria nem ícones como pacote. Os ícones da demonstração são desenhos locais de traço.
- As marcas da demonstração são desenhos fictícios e não representam órgão real.
- React, Angular, PHP e Web Components não estão implementados.
- Dialog, select avançado e tabela complexa não estão implementados.
- A preferência recolhida da sidebar só é aplicada depois que o módulo carrega. Pode haver um instante inicial expandido.
- O breakpoint `48rem` está escrito no CSS e no valor padrão do JavaScript porque media query não recebe custom property.
- Navegadores sem CSS Layers não aplicam a folha como previsto. Internet Explorer não é alvo.
- A demonstração precisa do servidor local. Não há backend, autenticação, API nem dado real.
- A captura visual varia com a fonte do sistema operacional.
- Os testes automáticos não comprovam WCAG 2.2 AA integral.
- Parte da governança não é verificável por teste, conforme a própria política.
- Nenhum pacote foi publicado e nenhum remoto foi atualizado por esta fundação.
