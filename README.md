# Motorcycle Manager

**ENTREGA — 3º SPRINT (Mobile)**

Aplicativo mobile em **React Native + Expo** para gestão de **motos** e **áreas de operação**, com autenticação via **Firebase** e integração com **API REST**.

---

## 📌 Proposta
Gerenciar o ciclo de vida de motos da operação (criar, listar, editar e excluir), vinculando cada moto a uma **área**. O acesso é controlado por **login/logout** (Firebase).

### ✨ Funcionalidades
- **Autenticação** com Firebase (login / logout, persistência de sessão)
- **CRUD de Motos** (Create, Read, Update, Delete)
- **Associação de Área** por moto (consumo de API REST de Áreas)
- **Lista com busca/atualização** e tela de **detalhes/edição**
- **Tema claro/escuro** (Theme Context)
- **Navegação** com **Expo Router**

---

## 🧱 Estrutura de Pastas (resumo)

```text
Mobile-Sprint1e2-FIAP-main/
│   ├── .env
│   ├── .gitignore
│   ├── App.tsx
│   ├── README.md
│   ├── app.json
│   ├── babel.config.js
│   ├── components.json
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.json
  ├── .expo/
  │   ├── README.md
  │   ├── devices.json
  ├── app/
  │   ├── favicon.ico
  │   ├── globals.css
  │   ├── layout.tsx
  │   ├── page.tsx
  ├── assets/
  │   ├── adaptive-icon.png
  │   ├── favicon.png
  │   ├── icon.png
  │   ├── splash.png
  ├── lib/
  │   ├── utils.ts
  ├── src/
    ├── components/
    │   ├── CustomButton.tsx
    │   ├── CustomInput.tsx
    ├── config/
    │   ├── firebase.ts
    ├── contexts/
    │   ├── AuthContext.tsx
    │   ├── ThemeContext.tsx
    ├── screens/
    │   ├── AddMotorcycleScreen.tsx
    │   ├── AddMotorcycleScreen.tsx.bak
    │   ├── AuthScreen.tsx
    │   ├── EditMotorcycleScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── MotorcycleFormScreen.tsx
    │   ├── MotorcycleListScreen.tsx
    │   ├── MotorcycleListScreen.tsx.bak
    │   ├── SettingsScreen.tsx
    ├── services/
    │   ├── areaService.ts
    │   ├── areaService.ts.bak
    │   ├── config.ts
    │   ├── config.ts.bak
    │   ├── motorcycleService.ts
    │   ├── motorcycleService.ts.bak
    ├── types/
    │   ├── motorcycle.ts
    │   ├── motorcycle.ts.bak
```

> Pastas-chave:
- `src/screens/` — Telas (Auth, Home, Lista/Edição/Cadastro de Motos, Settings)
- `src/services/` — Integração com API (`motorcycleService.ts`, `areaService.ts`, `config.ts`)
- `src/contexts/` — `AuthContext.tsx`, `ThemeContext.tsx`
- `src/config/` — `firebase.ts` (inicialização do Firebase)
- `app/` — Rotas e layout via **expo-router**
- `assets/` — Ícones e imagens do aplicativo

---

## 👥 Integrantes (Nome • RM • GitHub)
Desenvolvido por: 
RM 556293 Alice Teixeira Caldeira 
RM 555708 Gustavo Goulart 
RM 554557 Victor Medeiros

# API base
https://sprint1-dotnet.onrender.com
---

## ▶️ Como Rodar no **Expo Go**

### 1) Pré-requisitos
- **Node.js 20.x** (recomendado)
- **Expo CLI** (usar via `npx expo` já é suficiente)
- App **Expo Go** instalado no celular (Android/iOS)
- Estar **no mesmo Wi‑Fi** do computador (para modo LAN)

### 2) Instalação
```bash
# dentro da pasta do projeto
npm install
```

### 3) Variáveis de Ambiente
O arquivo `.env` tem que estar desse jeito:

```env
EXPO_PUBLIC_FIREBASE_API_KEY="AIzaSyByhxFhGfeu_aV40oOuwKzIAPwCnPe9Tfg"
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="projetovictor-817ad.firebaseapp.com"
EXPO_PUBLIC_FIREBASE_PROJECT_ID="projetovictor-817ad"
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="projetovictor-817ad.firebasestorage.app"
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="777243568227"
EXPO_PUBLIC_FIREBASE_APP_ID="1:777243568227:web:e19b9011be5ec79fe2b056"

# API base
https://sprint1-dotnet.onrender.com

### 4) Iniciar o projeto
```bash
npx expo start
```

- **Conexão LAN (recomendada no mesmo Wi‑Fi):** abra o Expo Go e escaneie o QR Code.
- **Se a LAN não funcionar:** pressione **`?`** no terminal do Expo e selecione **Tunnel** (ou execute com `--tunnel`).

### 5) Erros comuns
- **Assets faltando (`icon.png`, `splash.png`)**: garanta que existam em `assets/` (ou ajuste `app.json`).
- **Variáveis `.env` não lidas**: reinicie o bundler (`r`) e confirme os nomes das chaves acima.
- **Firebase Auth ‘component not registered’**: confira a inicialização em `src/config/firebase.ts` e que não há import cíclico.

---

## 🔧 Tecnologias e Versões

| Pacote | Versão |
|---|---|
| Expo SDK | ^54.0.0 |
| Expo Router | ~5.1.7 |
| React | 19.1.0 |
| React Native | 0.81.4 |
| Firebase | ^12.3.0 |
| TypeScript | ~5.8.3 |

> Outras dependências relevantes: `@react-navigation/*`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-safe-area-context`, etc. Verifique `package.json` para a lista completa.

---

## 📝 Observações
- Recomenda-se **Node 20** para compatibilidade com o Expo SDK 54.
