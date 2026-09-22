import React, { useState } from 'react';
import { PlusCircle, FolderSearch, Trash2, FolderOpen, Sparkles, AlertCircle } from 'lucide-react';
import { criarAula } from '../services/api';
import { getFileMeta } from '../utils/fileIcons';
import SeletorArquivosModal from './SeletorArquivosModal';

const SUGESTOES_MATERIAS = [
  'Programação',
  'Banco de Dados',
  'Redes & Infraestrutura',
  'Design & UI/UX',
  'Matemática & Estatística',
  'Engenharia de Software',
];

export default function CriarAulaView({
  arquivosSelecionados,
  onAtualizarArquivos,
  onRemoverArquivo,
  onLimparArquivos,
  onAulaCriada,
  onAvisar
}) {
  const [titulo, setTitulo] = useState('');
  const [materia, setMateria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      alert('Por favor, informe o título da aula.');
      return;
    }

    if (arquivosSelecionados.length === 0) {
      if (!window.confirm('Você ainda não anexou nenhum arquivo do HD para esta aula. Deseja criá-la mesmo assim?')) {
        return;
      }
    }

    setSalvando(true);
    try {
      const novaAula = {
        titulo: titulo.trim(),
        materia: materia.trim() || 'Geral',
        descricao: descricao.trim(),
        arquivos: arquivosSelecionados,
      };

      await criarAula(novaAula);
      onAvisar(`✅ Aula "${novaAula.titulo}" criada com sucesso!`);
      onLimparArquivos();
      setTitulo('');
      setMateria('');
      setDescricao('');
      onAulaCriada();
    } catch (err) {
      alert('Erro ao salvar aula no servidor Java.');
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmarModal = (arquivosConfirmados) => {
    onAtualizarArquivos(arquivosConfirmados);
    onAvisar(`${arquivosConfirmados.length} materiais associados à aula!`);
  };

  return (
    <div className="criar-aula-container">
      <div className="criar-aula-card">
        <div className="criar-aula-header">
          <div className="criar-aula-icon">
            <PlusCircle size={28} />
          </div>
          <div>
            <h2>Criar Nova Aula</h2>
            <p>Defina o plano da sua aula e escolha os arquivos do seu HD externo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Informações Básicas */}
          <div className="form-group">
            <label htmlFor="aula-titulo">Título da Aula *</label>
            <input
              id="aula-titulo"
              type="text"
              className="form-input"
              placeholder="Ex: Aula 01 - Fundamentos e Arquitetura"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="aula-materia">Matéria / Disciplina / Curso</label>
            <input
              id="aula-materia"
              type="text"
              className="form-input"
              placeholder="Ex: Programação Java, Cálculo, Redes..."
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
            />
            {/* Sugestões rápidas */}
            <div className="sugestoes-wrapper">
              <span className="sugestoes-label">Sugestões:</span>
              {SUGESTOES_MATERIAS.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  className="sugestao-pill"
                  onClick={() => setMateria(sug)}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="aula-desc">Anotações / Descrição</label>
            <textarea
              id="aula-desc"
              className="form-textarea"
              rows={3}
              placeholder="Ex: Assistir o vídeo parte 1, ler o PDF da página 10 à 25 e resolver exercícios..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          {/* Seção de Arquivos Selecionados */}
          <div className="arquivos-selecionados-card">
            <div className="arquivos-selecionados-header">
              <div>
                <h3>Materiais do HD Anexados ({arquivosSelecionados.length})</h3>
                <p>Estes arquivos serão abertos juntos no Windows ao clicar em "Abrir Aula"</p>
              </div>

              {/* BOTÃO QUE ABRE O SELETOR SEM SAIR DA TELA */}
              <button
                type="button"
                className="btn-abrir-seletor-modal"
                onClick={() => setModalAberto(true)}
              >
                <FolderOpen size={18} />
                <span>+ Escolher Arquivos do HD</span>
              </button>
            </div>

            {arquivosSelecionados.length === 0 ? (
              <div className="arquivos-empty-box">
                <FolderSearch size={40} color="#64748b" />
                <p>Nenhum material selecionado para esta aula ainda.</p>
                <button
                  type="button"
                  className="btn-escolher-arquivos-destaque"
                  onClick={() => setModalAberto(true)}
                >
                  <FolderOpen size={18} />
                  <span>Navegar no HD e Adicionar Arquivos</span>
                </button>
              </div>
            ) : (
              <div className="arquivos-anexados-lista">
                {arquivosSelecionados.map((arq, idx) => {
                  const meta = getFileMeta(arq.tipo);

                  return (
                    <div key={idx} className="arquivo-anexado-item">
                      <div className="anexado-left">
                        <span className="anexado-icon">{meta.icon}</span>
                        <div className="anexado-nomes">
                          <span className="anexado-nome" title={arq.caminhoCompleto}>
                            {arq.nome}
                          </span>
                          <span className="anexado-sub">
                            {meta.label} • {arq.tamanhoFormatado}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-remover-anexo"
                        onClick={() => onRemoverArquivo(arq.caminhoCompleto)}
                        title="Remover da aula"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="form-submit-row">
            <button
              type="submit"
              className="btn-salvar-aula"
              disabled={salvando}
            >
              <Sparkles size={18} />
              <span>{salvando ? 'Salvando Aula...' : 'Salvar e Criar Aula'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Seleção de Arquivos do HD integrado */}
      <SeletorArquivosModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        arquivosIniciais={arquivosSelecionados}
        onConfirmar={handleConfirmarModal}
      />
    </div>
  );
}
