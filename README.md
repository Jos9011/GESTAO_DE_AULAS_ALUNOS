# Gestor de Aulas • Portal do Aluno (Estudos & Revisão)

Sistema Full-Stack para **Estudantes e Alunos** organizarem seus cursos e matérias a partir de arquivos armazenados em **HD Externo** ou discos locais, com **player acelerado de vídeo, leitor de PDF, caderno de anotações e progresso de conclusão**.

---

## 🎯 Funcionalidades Principais para o Aluno

1. **Player Interno de Vídeo com Aceleração**:
   - Assista às videoaulas gravadas em velocidade `1.0x`, `1.25x`, `1.5x`, `1.75x` ou `2.0x`.
   - Botões de avançar e retroceder `10 segundos`.
   - Streaming por partes (`HTTP 206 Partial Content`) para navegar por vídeos pesados sem travamento.

2. **Leitor de PDF & Apostilas Integrado**:
   - Visualize os PDFs e apostilas da aula diretamente no navegador, lado a lado com suas anotações.

3. **Caderno de Anotações & Resumos**:
   - Escreva seus resumos, fórmulas e insights durante a aula e salve com 1 clique junto com a matéria.

4. **Controle de Progresso de Estudos**:
   - Marque a aula como **Concluída** ao terminar de assistir.
   - Barra de porcentagem de conclusão geral e por disciplina no Painel Inicial.
   - Filtro de aulas **⭐ Favoritas**, **✅ Concluídas** e **⏳ Em Andamento**.

5. **▶ Abertura de Aula com 1 Clique no Windows**:
   - Se preferir, com 1 clique o sistema abre todos os arquivos da aula em seus reprodutores nativos do Windows (VLC, Adobe, PowerPoint).

---

## 📁 Estrutura do Projeto

```text
PROJETO_QUALIDADE_DE_VIDA/
├── backend/                                   # API REST Java Spring Boot 3.4.3
│   ├── src/main/java/com/qualidade/backend/
│   │   ├── config/WebConfig.java              # Liberação de CORS
│   │   ├── controller/
│   │   │   ├── ExploradorController.java      # Endpoints de navegação e execução
│   │   │   └── AulaController.java            # Endpoints de gestão de aulas
│   │   ├── model/
│   │   │   ├── DiscoInfo.java                 # Modelo de unidade de disco
│   │   │   ├── ItemArquivo.java               # Modelo de arquivo/pasta
│   │   │   └── Aula.java                      # Modelo de aula com lista de materiais
│   │   └── service/
│   │       ├── ExploradorService.java         # Varredura de HD e ProcessBuilder no Windows
│   │       └── AulaService.java               # CRUD e disparo em 1 clique
│   └── pom.xml
│
├── frontend/                                  # Interface Web React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx                     # Navegação entre abas e status
│   │   │   ├── ExploradorHD.jsx               # Navegador de arquivos e drives
│   │   │   ├── BandejaSelecao.jsx             # Barra flutuante de arquivos selecionados
│   │   │   ├── MinhasAulas.jsx                # Lista de aulas com botão de 1 clique
│   │   │   ├── CriarAulaView.jsx              # Formulário de montagem de aula
│   │   │   └── Toast.jsx                      # Notificações de ação
│   │   ├── services/api.js                    # Integração com o backend Java
│   │   ├── utils/fileIcons.jsx                # Ícones por tipo de mídia
│   │   ├── App.jsx                            # Componente mestre
│   │   └── App.css                            # Design escuro e moderno
│   └── package.json
│
├── configurar-ambiente.bat                  # Detector e instalador automático de dependências
├── iniciar-backend.bat                        # Inicializa a API Java (Porta 8080)
├── iniciar-frontend.bat                       # Inicializa o React (Porta 5173)
└── iniciar-sistema.bat                        # Inicializa ambos com 1 clique (com auto-setup)
```

---

## ⚡ Instalação Automática em Outro Computador

Se você enviar esta pasta para outro computador que **não tem Java ou Node.js instalados**, não se preocupe!

Ao dar dois cliques em `iniciar-sistema.bat`:
1. Ele analisa o sistema para checar se **Java (JDK)** e **Node.js** já existem.
2. Se faltar algum deles, ele **baixa e descompacta automaticamente** as versões portáteis oficiais (Microsoft OpenJDK 21 LTS e Node.js LTS) na pasta do usuário.
3. **Não necessita de permissões de Administrador** para fazer o download ou instalação.
4. Se a pasta `node_modules` estiver faltando, ele executa o `npm install` sozinho.
5. Em seguida, inicia o sistema normalmente!

---

## 🚀 Como Iniciar

### Modo Rápido (1 clique):
Execute o arquivo:
- `iniciar-sistema.bat`

### Modo Manual (Terminal):

1. **Iniciar o Backend:**
   ```powershell
   cd "backend"
   mvn spring-boot:run
   ```

2. **Iniciar o Frontend:**
   ```powershell
   cd "frontend"
   npm run dev
   ```

3. Acesse no navegador:
   - **`http://localhost:5173`**

