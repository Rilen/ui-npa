# Versionamento

O UI-NPA usa SemVer.

- `0.1.0` é a fundação para revisão. `0.3.0` homologa a paleta clara oficial; `0.3.1` adiciona distribuição local em `dist`, exports públicos e fixture de consumidor. `0.3.2` corrige `[hidden]`, borda externa de tabela e adiciona o piloto legado. Ainda não é versão estável.
- Em `0.x`, correção compatível incrementa o patch. Mudança de nome de token, classe ou comportamento público incrementa o minor e é escrita no changelog.
- `1.0.0` não será atribuída antes da paleta homologada, dos contratos maduros e de uma decisão explícita de estabilidade. A homologação da paleta da UI-NPA-007 não antecipa `1.0.0`.
- O pacote está marcado `private`. Esta missão não publica no npm nem faz push.

O artefato versionado é o repositório. Não há versionamento independente de `tokens` e `styles` enquanto os dois andarem juntos.

Cada alteração relevante entra em `CHANGELOG.md` com a data e o motivo.
