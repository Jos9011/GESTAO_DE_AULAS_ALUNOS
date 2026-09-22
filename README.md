# Gestor de Aulas & HD Externo (React + Java Spring Boot)

Sistema Full-Stack para navegação, organização e execução de materiais de aulas (vídeos, PDFs, slides, apostilas e documentos) armazenados em **HD Externo** ou discos locais, com recurso de **abertura em 1 clique**.

---

## 🎯 Funcionalidades Principais

1. **Explorador do HD Externo**:
   - Detecção automática de discos e unidades (`C:\`, `D:\`, `E:\`, etc.).
   - Navegação por pastas com suporte a colar ou digitar caminhos personalizados.
   - Filtros rápidos por tipo de material:
     - 🎬 **Vídeos**: `.mp4`, `.mkv`, `.avi`, `.mov`, `.wmv`
     - 📄 **PDFs**: Apostilas, livros e exercícios
     - 📊 **Slides**: `.ppt`, `.pptx`, `.odp`
     - 📝 **Documentos**: `.docx`, `.doc`, `.txt`, `.md`
     - 🎵 **Áudios**: `.mp3`, `.wav`, `.m4a`
   - **Execução Imediata**: Botão para abrir qualquer arquivo diretamente no Windows usando o player ou leitor padrão (ex: VLC, Acrobat, PowerPoint).
   - Botão para abrir a pasta no **Windows Explorer**.

2. **Criação e Gestão de Aulas**:
   - Seleção prática de múltiplos arquivos diretamente enquanto navega pelas pastas do HD.
   - Bandeja flutuante que contabiliza os arquivos selecionados.
   - Cadastro de aula com **Título**, **Matéria / Disciplina** e **Anotações de estudo**.

3. **▶ Abertura de Aula com 1 Clique**:
   - Na aba **Minhas Aulas**, cada aula possui o botão destacado **"ABRIR AULA (1 CLIQUE)"**.
   - Ao clicar, o sistema dispara automaticamente a execução de todos os vídeos, slides e PDFs daquela aula no Windows de forma sequencial.
   - Acesso individual a cada material da aula a qualquer momento.

4. **Persistência dos Dados**:
   - As aulas criadas ficam salvas localmente em arquivo JSON (`aulas-db.json`), garantindo que suas aulas permaneçam salvas mesmo após reiniciar o computador.

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

