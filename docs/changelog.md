# Registro de Alterações (Changelog)

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
