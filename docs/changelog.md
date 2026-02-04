# Registro de Alterações (Changelog)

## [0.5.1] - 2026-02-04
### Adicionado
- **Exportação de Dados**: Adicionada funcionalidade de exportação do histórico de pesagem para formato CSV (;).

## [0.5.0] - 2026-02-04
### Adicionado
- **Sistema Real de Push Notifications**: Implementação nativa via Web Push API e VAPID.
  - Solicitação de permissão integrada nas configurações.
  - Registro de Service Worker (`sw.js`) para recebimento de notificações em segundo plano.
  - Armazenamento seguro de assinaturas no banco Convex.
- **Otimização para Telas OLED**: Novo modo "Pure Black" para economia de bateria e contraste infinito.
  - Ativação manual via configurações.
  - Injeção dinâmica de propriedades CSS para fundo #000000.
- **Micro-interações com Lottie**: Adição de feedback visual animado.
  - Animação de sucesso ao registrar peso.
  - Efeito de gota d'água ao registrar hidratação.
  - Componente genérico `LottieAnimation` para expansão futura.
- **Skeletons de Carregamento**: Substituição do loader genérico por placeholders que imitam a estrutura do dashboard, melhorando a percepção de performance.

### Alterado
- **Atualizações Otimistas (Optimistic Updates)**: Registro de peso e hidratação agora atualizam a interface instantaneamente antes mesmo da confirmação do servidor.
- **Refinamento do Calendário**: O ícone de "Início da Jornada" (Foguete) agora possui um badge com desfoque de fundo e tooltip informativo.

### Corrigido
- Erro de `InvalidAccessError` na inscrição de notificações push devido a chaves VAPID malformadas.
- Sincronização de estado do `isOledMode` no armazenamento persistente do Zustand.


## [0.4.0] - 2026-02-04
### Adicionado
- **Rastreador de Hidratação**: Sistema completo para monitoramento de ingestão de água.
  - Cálculo automático de meta (35ml/kg) baseado no peso atual.
  - Card interativo com barra de progresso e presets de adição rápida (200ml, 250ml, 350ml, 500ml).
  - Modal de Histórico de Hidratação com filtros por Mês e Ano.
  - Status dinâmico "Meta Batida! 🎉" ao atingir o objetivo diário.
- **Calendário Unificado**: O calendário agora exibe conquistas de peso e hidratação simultaneamente.
  - Indicador de Estrela Amarela para dias com meta de água atingida.
- **Métricas de Objetivo Expandidas**: Card "Meu Objetivo" agora inclui:
  - Peso Inicial, Progresso Total (kg) e IMC alvo na meta.
  - Status de "Meta Atingida! 🏆" com ícone de troféu.

### Alterado
- **Reorganização do Dashboard**: Layout otimizado para melhor priorização visual:
  - Linha 1: Gráfico de Evolução + Histórico de Pesagem.
  - Linha 2: Hidratação + Calendário + Meu Objetivo.
- **Padronização Visual (Glassmorphism)**: Todos os cards do dashboard agora seguem a mesma estética premium com gradientes vibrantes (Indigo, Púrpura, Azul) e desfoque de fundo.
- **Nomenclatura**: Card "Calendário de Peso" renomeado para apenas "Calendário" para refletir a natureza multidisciplinar.

### Corrigido
- Sincronização de exclusão de dados: "Resetar Dados" agora remove também o histórico de hidratação.
- Ordem de renderização e espaçamento em grids de 3 colunas para dispositivos grandes.


## [0.3.0] - 2026-02-03
### Adicionado
- **Sistema de Configurações**: Novo modal centralizado para gerenciamento total da conta.
  - Seleção de Tema (Claro, Escuro, Sistema).
  - Toggles de Preferências: "Esconder Valores", "Efeitos Sonoros" e "Notificações Push".
  - Zona Crítica: Recurso "Apagar Minha Jornada" com limpeza total do banco de dados via Convex.
- **Feedback Auditivo**: Sistema de sons (`playSound`) integrado a botões, switches e salvamento de dados.
- **Refatoração do Wizard**:
  - Campos agora iniciam vazios com placeholders descritivos.
  - Novo layout de 3 colunas para Objetivos.
  - Altura dinâmica e largura expandida para evitar transbordos visual.

### Alterado
- Layout do header unificado para usar o ícone de engrenagem como acesso único às preferências.
- Sincronização automática do estado global de visibilidade e som via Zustand.
- Escala dos switches e ícones em menus de configuração para um visual mais compacto.

### Corrigido
- Conflito de foco (pointer-events) entre modais do Radix UI e alertas do SweetAlert2.
- Problema de sincronização de funções do servidor Convex (resetUserData).

## [0.2.0] - 2026-02-03
### Adicionado
- **Dashboard Premium**: Implementação completa do painel principal com estética M3.
- **Diálogos Interativos**:
  - `BmiStatsDialog`: Visualizador de IMC com gráfico 3D, alertas de categoria e fórmula de cálculo.
  - `CalorieStatsDialog`: Estratégias de manutenção e conselhos personalizados.
- **Integração com IA**: Sistema de frases motivacionais aleatórias ao carregar o dashboard.
- **Melhorias de UX**:
  - Persistência de modal (bloqueio de fechamento ao clicar fora).
  - Barras de rolagem arredondadas personalizadas para um visual profissional.
  - Modo de privacidade (alternância de visibilidade) para métricas sensíveis.
- **Persistência de Dados**: Salvamento automático de perfis e entradas de peso via Convex.

### Alterado
- Refatoração do `StatsCards` para suportar diálogos interativos.
- Otimização do layout do dashboard com melhor comportamento responsivo em grid.
- Melhoria do `BmiStatsDialog` com largura autoajustável e texto sem quebra em desktop.
- Refino do `EditProfileDialog` para melhor contraste e legibilidade.

### Corrigido
- Erros de aninhamento JSX em `page.tsx`.
- Tags `div` não fechadas e avisos de linting no layout principal.
- Erros de lógica nos cálculos de calorias e mapeamento de campos do perfil.

## [0.1.0] - 2026-02-03
### Adicionado
- Estrutura inicial do projeto.
- Template Next.js 15.
- Pasta e arquivos de documentação.
