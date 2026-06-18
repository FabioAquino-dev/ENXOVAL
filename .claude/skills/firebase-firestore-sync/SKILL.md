# Firebase Firestore Sync

Use esta skill quando mexer em Firebase, Firestore, sincronização ou dados compartilhados.

Objetivo:
- Garantir sincronização real entre dispositivos.
- Não usar localStorage como fonte principal de dados.
- Firestore deve ser a fonte da verdade.
- Anonymous Auth pode ser usado para simplificar o acesso.
- Evitar quebrar onSnapshot, collection, doc, setDoc, updateDoc e demais operações existentes.

Checklist obrigatório:
- Confirmar caminho das collections/documentos.
- Confirmar que Papai e Mamãe veem as mesmas alterações.
- Confirmar que convidado consegue marcar presente e isso aparece para Papai/Mamãe.
- Confirmar que alterações não ficam só locais.
- Se regras Firestore mudarem, entregar regras exatas para publicar.
- Não migrar para Realtime Database.
