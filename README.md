# #️⃣ BeFitness PRO - Evolução Fitness Inteligente

BeFitness PRO é um ecossistema de alta performance para monitoramento de saúde e evolução física, inspirado nos princípios de design **Material Design 3 (M3)**. Focado em simplicidade, precisão e uma experiência de usuário premium, o aplicativo permite que você acompanhe seu peso, IMC e necessidades calóricas com inteligência.

![Dashboard Preview](https://img.shields.io/badge/Status-Development-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Convex](https://img.shields.io/badge/Backend-Convex-000000?style=for-the-badge&logo=convex)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=for-the-badge&logo=clerk)

## ✨ Funcionalidades Principais

- 🚀 **Onboarding Inteligente:** Configuração rápida de perfil com cálculo automático de metas.
- 📊 **Dashboard M3 Premium:** Visualização clara de Peso Atual, IMC e Gasto Calórico.
- 🌡️ **Velocímetro de IMC 3D:** Visualização imersiva da sua saúde corporal com efeitos de profundidade.
- 🏗️ **Gasto Calórico Personalizado:** Estimativas baseadas na fórmula de Mifflin-St Jeor revisada.
- 📅 **Calendário Evolutivo:** Acompanhamento cronológico com sinalização visual de progresso.
- 🔐 **Privacidade Total:** Modo de visibilidade oculta para valores sensíveis no dashboard.
- 🔔 **Notificações Push Reais:** Lembretes inteligentes via Web Push API.
- 🌑 **Otimização OLED:** Modo "Pure Black" para economia extrema de bateria.
- ⚡ **Performance Otimista:** Interface ultra-rápida com atualizações instantâneas (Zero Lag).
- 📂 **Exportação de Dados:** Exportação completa do histórico de pesagem para CSV.
- 🎨 **Design Adaptativo:** Experiência otimizada para Desktop, Tablet e Mobile com Skeletons de carregamento.

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 15 (App Router), React 19.
- **Estilização & Animação:** Tailwind CSS v4, Framer Motion, Lottie React.
- **Backend:** Convex (Real-time DB & Cloud Functions).
- **Autenticação:** Clerk (Social & Email Login).
- **Notificações:** Web-Push API & VAPID.
- **Componentes:** Shadcn/UI, Magic UI, Lucide React.

## 🚀 Começando

### Pré-requisitos
- Node.js 18+
- Conta no [Convex](https://www.convex.dev/)
- Conta no [Clerk](https://clerk.com/)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/befitness-pro.git
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz com suas chaves do Clerk e Convex.

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 📂 Documentação Interna

Para detalhes sobre o desenvolvimento e planejamento, consulte a pasta `/docs`:

- [Progress](docs/progress.md) - Status atual das funcionalidades.
- [Changelog](docs/changelog.md) - Histórico de versões e alterações.
- [Roadmap](docs/roadmap.md) - Próximos passos e visão de futuro.
- [Improvements](docs/improvements.md) - Melhorias pendentes e ideias.

---
Desenvolvido com ❤️ pela equipe BeFitness.
