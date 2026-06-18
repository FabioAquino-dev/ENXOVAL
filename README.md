# Enxoval do Bebê 👶

App (PWA) para organizar a compra do enxoval do bebê junto com sua esposa, em tempo real: o que um marca/compra no celular aparece instantaneamente no celular do outro.

Já vem com uma lista de ~50 itens sugeridos (roupas, banho, quarto, higiene, alimentação, passeio e maternidade), com tamanhos RN/P/M/G e preço estimado de mercado — tudo editável.

## O que você precisa fazer (uma vez só)

O app por si só não tem onde guardar os dados "na nuvem" — para os dois celulares se comunicarem em tempo real, ele usa o **Firebase** (do Google, gratuito para esse uso). São ~10 minutos de configuração.

### 1. Criar o projeto Firebase

1. Acesse https://console.firebase.google.com/ e entre com a mesma conta Google do seu Gmail.
2. Clique em **Adicionar projeto**, dê um nome (ex: `enxoval-bebe`) e siga até criar.
3. No menu lateral, vá em **Build > Firestore Database** > **Criar banco de dados**.
   - Escolha o modo **produção**.
   - Escolha uma localização (ex: `southamerica-east1` para o Brasil).
4. Ainda no Firestore, vá na aba **Regras** e substitua pelo conteúdo abaixo, depois **Publicar**:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

5. Vá em **Build > Authentication** > **Começar** > aba **Sign-in method** > habilite o provedor **Anônimo**.
   - Isso permite que o app se identifique de forma automática (sem tela de login) e ao mesmo tempo impede que estranhos leiam ou editem sua lista.
6. Volte para a Visão Geral do projeto, clique no ícone **`</>`** (Web) para registrar um app, dê um nome e clique em **Registrar app**.
7. Copie os valores mostrados em `firebaseConfig` (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId). Você vai usá-los no próximo passo.

### 2. Configurar as variáveis de ambiente

Na pasta do projeto, copie `.env.local.example` para `.env.local` e cole os valores do Firebase:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Teste localmente:

```bash
npm install
npm run dev
```

Abra http://localhost:3000 — na primeira vez, ele pede pra você escolher "Papai" ou "Mamãe" e já cria a lista padrão de itens no Firestore.

### 3. Subir para o GitHub

```bash
git init
git add .
git commit -m "Primeira versão do app de enxoval"
gh repo create enxoval-bebe --private --source=. --push
```

(ou crie o repositório manualmente no GitHub e faça `git remote add origin ...` + `git push`)

### 4. Publicar na Vercel

1. Acesse https://vercel.com/new e importe o repositório que você acabou de criar.
2. Em **Environment Variables**, cole as mesmas 6 variáveis do `.env.local`.
3. Clique em **Deploy**. Em ~1 minuto você terá uma URL pública (ex: `enxoval-bebe.vercel.app`).

### 5. Instalar no celular de cada um

Abra a URL da Vercel no navegador do celular (Chrome no Android, Safari no iPhone):

- **Android (Chrome):** toque no menu (⋮) → "Adicionar à tela inicial" / "Instalar app".
- **iPhone (Safari):** toque em Compartilhar (□↑) → "Adicionar à Tela de Início".

Cada um escolhe "Papai" ou "Mamãe" na primeira vez que abrir. A partir daí, tudo que um marcar, editar ou comprar aparece em tempo real no celular do outro.

## Funcionalidades

- Lista de enxoval por categoria (Roupas, Acessórios, Banho, Sono e Quarto, Higiene e Saúde, Alimentação, Passeio e Transporte, Maternidade), com itens e quantidades sugeridas por tamanho (RN/P/M/G).
- Preço estimado de mercado pré-preenchido — totalmente editável.
- Campo de "preço real" para preencher depois da compra, com cálculo automático do total gasto x estimado.
- Marcação de quem comprou cada item (Papai/Mamãe) e quando.
- Dashboard com progresso, total estimado, total já gasto e diferença.
- Adicionar itens personalizados que não estavam na lista.
- Busca e filtro por categoria / ocultar comprados.
- Contagem regressiva para a data prevista do parto (editável em Configurações).
- Funciona como PWA instalável, com cache básico para abrir mesmo com internet instável.

## Rodando localmente sem Firebase configurado

Se você abrir o app sem preencher o `.env.local`, ele funciona em modo local (sem sincronizar entre dispositivos) — útil só para testar a interface.

## Estrutura do projeto

- `src/lib/types.ts` — modelo de dados (itens, categorias, tamanhos).
- `src/lib/defaultItems.ts` — lista padrão de itens sugeridos e preços estimados.
- `src/lib/firebase.ts` / `src/lib/useEnxoval.ts` — conexão e sincronização em tempo real com o Firestore.
- `src/components/` — interface (dashboard, lista de itens, formulários, configurações).
- `scripts/gen-icons.ps1` — regera os ícones do app (caso queira trocar as cores/design).
