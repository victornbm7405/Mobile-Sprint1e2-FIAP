"use client"

export default function Page() {
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "system-ui, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ color: "#10B981", marginBottom: "20px" }}>Motorcycle Manager - React Native App</h1>

      <div
        style={{
          backgroundColor: "#f9fafb",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ color: "#111827", marginTop: "0" }}>📱 Aplicativo React Native</h2>
        <p>Este é um aplicativo React Native com Expo para gerenciamento de motocicletas.</p>

        <h3 style={{ color: "#374151" }}>Funcionalidades:</h3>
        <ul style={{ color: "#6b7280" }}>
          <li>✅ Autenticação com Firebase</li>
          <li>✅ Página home com dashboard</li>
          <li>✅ Cadastro de motos com AsyncStorage</li>
          <li>✅ Lista de motos com CRUD completo</li>
          <li>✅ Configurações com alternância de tema</li>
          <li>✅ Design moderno com cores verde e preto</li>
        </ul>
      </div>

      <div
        style={{
          backgroundColor: "#fef3c7",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #f59e0b",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ color: "#92400e", marginTop: "0" }}>⚠️ Como executar o aplicativo:</h3>
        <ol style={{ color: "#92400e" }}>
          <li>Baixe o projeto usando o botão "Download ZIP"</li>
          <li>Extraia os arquivos</li>
          <li>
            Configure o Firebase no arquivo <code>src/config/firebase.ts</code>
          </li>
          <li>
            Execute <code>npm install</code> ou <code>yarn install</code>
          </li>
          <li>
            Execute <code>expo start</code>
          </li>
          <li>Use o Expo Go no seu celular Android para testar</li>
        </ol>
      </div>

      <div
        style={{
          backgroundColor: "#dbeafe",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #3b82f6",
        }}
      >
        <h3 style={{ color: "#1e40af", marginTop: "0" }}>🔧 Configuração do Firebase:</h3>
        <p style={{ color: "#1e40af" }}>
          Você precisará criar um projeto no Firebase Console e substituir as configurações no arquivo{" "}
          <code>src/config/firebase.ts</code> pelas suas credenciais.
        </p>
      </div>

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          Motorcycle Manager v1.0.0 - React Native + Expo + TypeScript + Firebase
        </p>
      </div>
    </div>
  )
}
