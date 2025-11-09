# Motorcycle Manager

**ENTREGA — 3º SPRINT (Mobile)**

Aplicativo mobile em **React Native + Expo** para gestão de **motos** e **áreas de operação**, com autenticação via **Firebase** e integração com **API REST**.

---

## 📌 Proposta
Gerenciar o ciclo de vida de motos da operação (criar, listar, editar e excluir), vinculando cada moto a uma **área**. O acesso é controlado por **login/logout** (Firebase).

### ✨ Funcionalidades
- **Autenticação** via JWT (login / logout)
- **CRUD de Motos** (Create, Read, Update, Delete)
- **Associação de Área** por moto (consumo de API REST de Áreas)
- **Lista com busca/atualização** e tela de **detalhes/edição**
- **Tema claro/escuro** (Theme Context)
- **Navegação** com **Expo Router**
- ** Mudança de linguas**
- **Notificação local** quando uma moto é cadastrada

---

## 🧱 Estrutura de Pastas (resumo)

```text
Mobile-Sprint1e2-FIAP-main/
├── .env
├── .gitignore
├── App.tsx
├── README.md
├── app.json
├── babel.config.js
├── components.json
├── eas.json
├── package.json
├── tsconfig.json
├── .expo/
│   ├── README.md
│   └── devices.json
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── assets/
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash.png
├── lib/
│   └── utils.ts
└── src/
    ├── components/
    │   ├── CustomButton.tsx
    │   ├── CustomInput.tsx
    │   └── LanguageSwitcher.tsx
    ├── config/
    │   └── firebase.ts
    ├── contexts/
    │   ├── AuthContext.tsx
    │   └── ThemeContext.tsx
    ├── i18n/
    │   ├── en.json
    │   └── pt.json
    ├── screens/
    │   ├── AboutScreen.tsx
    │   ├── AddMotorcycleScreen.tsx
    │   ├── AddUserScreen.tsx
    │   ├── AuthScreen.tsx
    │   ├── EditMotorcycleScreen.tsx
    │   ├── EditUserScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── MotorcycleFormScreen.tsx
    │   ├── MotorcycleListScreen.tsx
    │   ├── SettingsScreen.tsx
    │   └── UserListScreen.tsx
    ├── services/
    │   ├── areaService.ts
    │   ├── config.ts
    │   ├── http.ts
    │   ├── motorcycleService.ts
    │   ├── rest.ts
    │   └── userService.ts
    ├── types/
    │   └── motorcycle.ts
    └── utils/
        ├── formatador.ts
        ├── internationalization.ts
        └── notifications.ts

---

## 👥 Integrantes (Nome • RM • GitHub)
Desenvolvido por: 
RM 556293 Alice Teixeira Caldeira 
RM 555708 Gustavo Goulart 
RM 554557 Victor Medeiros

# API base
https://sprint1-dotnet.onrender.com
---

## ✅ Como rodar

1) **Baixar e instalar o APK**
   - Link da build (Expo): `https://expo.dev/accounts/victornievesmedeiros136/projects/motorcycle-manager/builds/93e4680e-0e73-4e96-84b9-374e4ac2f834`
   - No Android, habilite **Instalar apps de fontes desconhecidas** (se necessário).
   - Toque no arquivo **.apk** baixado e conclua a instalação.

2) **Abrir o aplicativo**
   - Conceda as permissões solicitadas (principalmente **Câmera**, usada para **leitura de QR Code**).

### Instalação
```bash
# dentro da pasta do projeto
npm install
``

# API base
https://sprint1-dotnet.onrender.com

### Iniciar o projeto
```bash
npx expo start

```

- **Conexão LAN (recomendada no mesmo Wi‑Fi):** abra o aplicativo e escaneie o QR Code gerado pelo npx expo start.


### 5) Erros comuns
- **Assets faltando (`icon.png`, `splash.png`)**: garanta que existam em `assets/` (ou ajuste `app.json`).
- **Variáveis `.env` não lidas**: reinicie o bundler (`r`) e confirme os nomes das chaves acima.

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
