export const protocols = [
  { id: "PROT-2026-0042", subject: "Iluminação pública", status: "analise" },
  { id: "PROT-2026-0043", subject: "Poda de árvore", status: "deferido" },
  { id: "PROT-2026-0044", subject: "Coleta de resíduos", status: "atencao" },
];

export const statuses = {
  analise: { label: "Em análise", legacy: "legacy-status--info", badge: "iui-badge--info" },
  deferido: { label: "Deferido", legacy: "legacy-status--success", badge: "iui-badge--success" },
  atencao: { label: "Atenção", legacy: "legacy-status--warning", badge: "iui-badge--warning" },
};
