# Guest Mode Security

Use esta skill quando criar ou alterar modo convidado/presenteador.

Objetivo:
- Convidado pode apenas marcar item como presenteado.
- Convidado não pode editar item, quantidade, preço, configurações, adicionar ou excluir.
- Papai e Mamãe podem administrar normalmente.
- A lista deve usar código de acesso TIMOTEO2026.
- O modo convidado deve ser seguro na UI e nas funções, não apenas esconder botão visualmente.

Checklist obrigatório:
- Não renderizar botões administrativos para convidado.
- Bloquear funções de update/delete/add quando role for convidado.
- Confirmar que convidado não consegue alterar preço ou quantidade.
- Presente deve aparecer como 🎁 para Papai/Mamãe.
- Pedir confirmação antes de marcar como presenteado.
- Se possível, registrar nome opcional de quem presenteou.
