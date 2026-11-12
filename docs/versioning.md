# Versionamento

O UI-NPA usa SemVer.

- `0.1.0` é a fundação para revisão. Não é versão estável.
- Em `0.x`, correção compatível incrementa o patch. Mudança de nome de token, classe ou comportamento público incrementa o minor e é escrita no changelog.
- `1.0.0` não será atribuída antes da paleta homologada, dos contratos maduros e de uma decisão explícita de estabilidade.
- O pacote está marcado `private`. Esta missão não publica no npm nem faz push.

O artefato versionado é o repositório. Não há versionamento independente de `tokens` e `styles` enquanto os dois andarem juntos.

Cada alteração relevante entra em `CHANGELOG.md` com a data e o motivo.
