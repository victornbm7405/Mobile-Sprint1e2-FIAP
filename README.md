# Motorcycle Manager

Aplicativo React Native com Expo para gerenciamento de motocicletas.

---

## Integrante

- **Nome:** Gustavo Goulart Bretas  **RM:** 555708
- **Nome:** Alice Teixeira Caldeira  **RM:** 556293
- **Nome:** Victor Nieves Britto Medeiros  **RM:** 554557

---

## 🚀 Funcionalidades

- ✅ **Autenticação Firebase** - Login e cadastro de usuários
- ✅ **Dashboard Home** - Visão geral com estatísticas e ações rápidas
- ✅ **Cadastro de Motos** - Formulário para adicionar motos (modelo, placa, fabricante)
- ✅ **Lista com CRUD** - Visualizar, editar, excluir e buscar motos
- ✅ **Configurações** - Alternância entre tema claro/escuro
- ✅ **AsyncStorage** - Armazenamento local das motos
- ✅ **Design Moderno** - Interface com cores verde e preto

## 🛠️ Tecnologias

- React Native
- Expo
- TypeScript
- Firebase Authentication
- AsyncStorage
- React Navigation
- Expo Vector Icons

## 📱 Como executar

1. **Clone ou baixe o projeto**
2. **Instale as dependências:**
   \`\`\`bash
   npm install
   # ou
   expo install
   \`\`\`

3. **Configure o Firebase:**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative a autenticação por email/senha
   - Substitua as configurações em `src/config/firebase.ts`

4. **Execute o projeto:**
   \`\`\`bash
   npx expo start
   \`\`\`

5. **Teste no dispositivo:**
   - Instale o Expo Go no seu Android
   - Escaneie o QR code gerado

## 🎨 Design

O aplicativo utiliza um sistema de cores moderno:
- **Primary:** Verde (#10B981)
- **Secondary:** Verde escuro (#059669)
- **Suporte completo a tema claro/escuro**
- **Interface responsiva e acessível**

## 📁 Estrutura do Projeto

\`\`\`
src/
├── components/          # Componentes reutilizáveis
├── contexts/           # Contextos (Auth, Theme)
├── screens/            # Telas do aplicativo
├── services/           # Serviços (AsyncStorage)
├── types/              # Tipos TypeScript
└── config/             # Configurações (Firebase)
\`\`\`

## 🔧 Configuração do Firebase

Substitua as configurações em `src/config/firebase.ts`:

\`\`\`typescript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "seu-app-id"
};
\`\`\`

## 📱 Telas do Aplicativo

1. **Login/Cadastro** - Autenticação de usuários
2. **Home** - Dashboard com estatísticas e ações rápidas
3. **Cadastrar Moto** - Formulário de cadastro
4. **Lista de Motos** - CRUD completo com busca
5. **Configurações** - Alternância de tema e informações da conta

## 🎯 Funcionalidades Detalhadas

### Cadastro de Motos
- Campos: Modelo, Placa, Fabricante
- Validação de placa brasileira
- Sugestões de fabricantes populares
- Armazenamento local com AsyncStorage

### Lista de Motos
- Visualização em cards
- Busca por modelo, placa ou fabricante
- Edição inline
- Exclusão com confirmação
- Pull-to-refresh

### Configurações
- Alternância tema claro/escuro
- Informações da conta
- Sobre o aplicativo
- Logout seguro

## 📄 Licença

Este projeto foi criado para fins educacionais e de demonstração.
