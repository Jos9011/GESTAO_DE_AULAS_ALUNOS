import React, { useState } from 'react';
import {
  Play,
  Trash2,
  BookOpen,
  Calendar,
  Layers,
  FolderOpen,
  ExternalLink,
  Search,
  CheckCircle,
  Circle,
  Star,
  MonitorPlay,
  FileText
} from 'lucide-react';
import {
  abrirAulaCompleta,
  abrirArquivoNoWindows,
  abrirPastaNoExplorer,
  excluirAula,
  toggleConcluida,
  toggleFavorita
} from '../services/api';
import { getFileMeta } from '../utils/fileIcons';
import PlayerModal from './PlayerModal';

export default function MinhasAulas({
  aulas,
  onRecarregar,
  onAvisar,
  onNovaAula
}) {
  const [filtroMateria, setFiltroMateria] = useState('TODAS');
  const [filtroStatus, setFiltroStatus] = useState('TODOS'); // 'TODOS', 'FAVORITAS', 'CONCLUIDAS', 'PENDENTES'
  const [busca, setBusca] = useState('');
  const [abrindoId, setAbrindoId] = useState(null);
  const [aulaEmEstudo, setAulaEmEstudo] = useState(null);

  // Obter lista única de matérias
  const materias = ['TODAS', ...new Set(aulas.map((a) => a.materia).filter(Boolean))];

  const handleAbrirAulaCompleta = async (aula) => {
    if (!aula.arquivos || aula.arquivos.length === 0) {
      alert('Esta aula não possui arquivos associados.');
      return;
    }

    setAbrindoId(aula.id);
    try {
      const res = await abrirAulaCompleta(aula.id);
      if (res.sucesso) {
        onAvisar(`🚀 Abrindo aula "${aula.titulo}": ${res.arquivosAbertos} arquivo(s) sendo executados no Windows!`);
      } else {
        alert('Erro ao abrir arquivos da aula: ' + (res.erros?.join('\n') || 'Verifique se o HD está conectado.'));
      }
    } catch (err) {
      alert('Falha ao comunicar com o backend.');
    } finally {
      setAbrindoId(null);
    }
  };

  const handleAbrirArquivoIndividual = async (caminho, nome) => {
    try {
      const res = await abrirArquivoNoWindows(caminho);
      if (res.sucesso) {
        onAvisar(`Abrindo "${nome}" no Windows...`);
      } else {
        alert('Erro ao abrir arquivo. Verifique se o caminho existe.');
      }
    } catch (err) {
      alert('Falha ao abrir arquivo.');
    }
  };

  const handleAbrirPasta = async (caminho) => {
    try {
      const res = await abrirPastaNoExplorer(caminho);
      if (res.sucesso) {
        onAvisar('Local do arquivo aberto no Windows Explorer.');
      }
    } catch (err) {
      alert('Falha ao abrir Windows Explorer.');
    }
  };

  const handleToggleFavoritaCard = async (e, aula) => {
    e.stopPropagation();
    try {
      const atualizada = await toggleFavorita(aula.id);
      onAvisar(atualizada.favorita ? `⭐ "${aula.titulo}" favoritada!` : `Aula desfavoritada.`);
      onRecarregar();
    } catch (err) {
      alert('Erro ao favoritar aula.');
    }
  };

  const handleToggleConcluidaCard = async (e, aula) => {
    e.stopPropagation();
    try {
      const atualizada = await toggleConcluida(aula.id);
      onAvisar(atualizada.concluida ? `🎉 "${aula.titulo}" concluída!` : `Status alterado para pendente.`);
      onRecarregar();
    } catch (err) {
      alert('Erro ao alterar conclusão da aula.');
    }
  };

  const handleExcluir = async (aula) => {
    if (window.confirm(`Deseja realmente excluir a aula "${aula.titulo}"? Os arquivos originais no seu HD não serão apagados.`)) {
      try {
        await excluirAula(aula.id);
        onAvisar(`Aula "${aula.titulo}" removida.`);
        onRecarregar();
      } catch (err) {
        alert('Erro ao excluir aula.');
      }
    }
  };

  const aulasFiltradas = aulas.filter((aula) => {
    const matchMateria = filtroMateria === 'TODAS' || aula.materia === filtroMateria;

    let matchStatus = true;
    if (filtroStatus === 'FAVORITAS') matchStatus = !!aula.favorita;
    if (filtroStatus === 'CONCLUIDAS') matchStatus = !!aula.concluida;
    if (filtroStatus === 'PENDENTES') matchStatus = !aula.concluida;

    const matchBusca =
      !busca ||
      aula.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      (aula.descricao && aula.descricao.toLowerCase().includes(busca.toLowerCase())) ||
      (aula.materia && aula.materia.toLowerCase().includes(busca.toLowerCase()));

    return matchMateria && matchStatus && matchBusca;
  });

  return (
    <div className="minhas-aulas-container">
      {/* Controles de Filtro e Pesquisa */}
      <div className="aulas-toolbar">
        <div className="filtros-container-duplo">
          {/* Filtro de Status (Todos, Favoritas, Concluídas, Pendentes) */}
          <div className="filtros-status">
            <button
              className={`status-chip ${filtroStatus === 'TODOS' ? 'active' : ''}`}
              onClick={() => setFiltroStatus('TODOS')}
            >
              Todas ({aulas.length})
            </button>
            <button
              className={`status-chip ${filtroStatus === 'FAVORITAS' ? 'active' : ''}`}
              onClick={() => setFiltroStatus('FAVORITAS')}
            >
              ⭐ Favoritas ({aulas.filter((a) => a.favorita).length})
            </button>
            <button
              className={`status-chip ${filtroStatus === 'CONCLUIDAS' ? 'active' : ''}`}
              onClick={() => setFiltroStatus('CONCLUIDAS')}
            >
              ✅ Concluídas ({aulas.filter((a) => a.concluida).length})
            </button>
            <button
              className={`status-chip ${filtroStatus === 'PENDENTES' ? 'active' : ''}`}
              onClick={() => setFiltroStatus('PENDENTES')}
            >
              ⏳ Em Andamento ({aulas.filter((a) => !a.concluida).length})
            </button>
          </div>

          {/* Filtro de Matérias */}
          <div className="filtros-materias">
            {materias.map((m) => (
              <button
                key={m}
                className={`materia-chip ${filtroMateria === m ? 'active' : ''}`}
                onClick={() => setFiltroMateria(m)}
              >
                {m === 'TODAS' ? 'Todas as Matérias' : m}
              </button>
            ))}
          </div>
        </div>

        <div className="busca-wrapper">
          <Search size={16} className="busca-icon" />
          <input
            type="text"
            className="busca-input"
            placeholder="Pesquisar aulas..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* Grid de Aulas */}
      {aulasFiltradas.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} color="#64748b" />
          <h3>Nenhuma aula encontrada</h3>
          <p>Experimente alterar o filtro ou crie uma nova aula com os materiais do seu HD.</p>
          <button className="btn-primary" style={{ maxWidth: '240px', margin: '16px auto 0' }} onClick={onNovaAula}>
            Criar Minha Primeira Aula
          </button>
        </div>
      ) : (
        <div className="aulas-grid">
          {aulasFiltradas.map((aula) => {
            const isAbrindo = abrindoId === aula.id;

            return (
              <div key={aula.id} className={`aula-card ${aula.concluida ? 'card-concluida' : ''}`}>
                {/* Cabeçalho do Card com Status, Favorito e Exclusão */}
                <div className="aula-card-header">
                  <div className="header-tags-row">
                    {aula.materia && (
                      <span className="aula-materia-badge">{aula.materia}</span>
                    )}
                    {aula.concluida && (
                      <span className="badge-concluida-tag">
                        <CheckCircle size={12} /> Concluída
                      </span>
                    )}
                  </div>

                  <div className="card-top-actions">
                    <button
                      className={`btn-card-star ${aula.favorita ? 'favorita' : ''}`}
                      onClick={(e) => handleToggleFavoritaCard(e, aula)}
                      title={aula.favorita ? 'Remover dos favoritos' : 'Favoritar aula'}
                    >
                      <Star size={17} fill={aula.favorita ? '#f59e0b' : 'none'} color={aula.favorita ? '#f59e0b' : '#94a3b8'} />
                    </button>
                    <button
                      className="btn-excluir-aula"
                      onClick={() => handleExcluir(aula)}
                      title="Excluir aula (não apaga os arquivos do HD)"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="aula-card-title">{aula.titulo}</h3>

                <div className="aula-meta-info">
                  <Calendar size={13} />
                  <span>{aula.dataCriacao}</span>
                  <span>•</span>
                  <Layers size={13} />
                  <span>{aula.arquivos?.length || 0} materiais</span>
                  {aula.anotacoesEstudo && (
                    <>
                      <span>•</span>
                      <span className="badge-com-notas" title="Possui anotações de estudo">
                        <FileText size={12} /> Notas salvas
                      </span>
                    </>
                  )}
                </div>

                {/* Descrição da aula */}
                {aula.descricao && (
                  <p className="aula-descricao">{aula.descricao}</p>
                )}

                {/* DUPLO BOTÃO DE AÇÃO: Estudar no Navegador OU Abrir no Windows */}
                <div className="aula-card-botoes-principais">
                  <button
                    className="btn-estudar-browser"
                    onClick={() => setAulaEmEstudo(aula)}
                    title="Assistir vídeos, ler PDFs e fazer anotações aqui mesmo com controle de velocidade"
                  >
                    <MonitorPlay size={17} />
                    <span>Estudar Aqui (Player Interno)</span>
                  </button>

                  <button
                    className={`btn-abrir-aula-completa ${isAbrindo ? 'loading' : ''}`}
                    onClick={() => handleAbrirAulaCompleta(aula)}
                    disabled={isAbrindo || !aula.arquivos?.length}
                    title="Abre todos os arquivos desta aula no Windows com seus programas padrão de uma só vez"
                  >
                    <Play size={16} fill="currentColor" />
                    <span>{isAbrindo ? 'Abrindo no Windows...' : 'Abrir no Windows (1 Clique)'}</span>
                  </button>
                </div>

                {/* Botão de Conclusão Rápida no Rodapé */}
                <div className="aula-card-quick-toggle">
                  <button
                    className={`btn-quick-conclusao ${aula.concluida ? 'concluida' : ''}`}
                    onClick={(e) => handleToggleConcluidaCard(e, aula)}
                  >
                    {aula.concluida ? (
                      <>
                        <CheckCircle size={15} color="#10b981" />
                        <span>Aula Concluída {aula.dataConclusao ? `(${aula.dataConclusao})` : ''}</span>
                      </>
                    ) : (
                      <>
                        <Circle size={15} />
                        <span>Marcar como Concluída</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Lista de Arquivos da Aula */}
                <div className="aula-arquivos-section">
                  <span className="aula-arquivos-titulo">Materiais incluídos:</span>
                  <div className="aula-arquivos-lista">
                    {aula.arquivos?.map((arq, idx) => {
                      const meta = getFileMeta(arq.tipo);

                      return (
                        <div key={idx} className="aula-arquivo-item">
                          <div className="arquivo-item-left">
                            <span className="arquivo-icon">{meta.icon}</span>
                            <div className="arquivo-nomes">
                              <span className="arquivo-nome" title={arq.caminhoCompleto}>
                                {arq.nome}
                              </span>
                              <span className="arquivo-sub">
                                {meta.label} • {arq.tamanhoFormatado}
                              </span>
                            </div>
                          </div>

                          <div className="arquivo-item-acoes">
                            <button
                              className="btn-mini-acao play"
                              onClick={() => handleAbrirArquivoIndividual(arq.caminhoCompleto, arq.nome)}
                              title="Abrir este arquivo no Windows"
                            >
                              <Play size={13} />
                            </button>
                            <button
                              className="btn-mini-acao"
                              onClick={() => handleAbrirPasta(arq.caminhoCompleto)}
                              title="Ver arquivo na pasta do Windows"
                            >
                              <FolderOpen size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal do Player Integrado com Caderno de Anotações */}
      {aulaEmEstudo && (
        <PlayerModal
          aula={aulaEmEstudo}
          onClose={() => setAulaEmEstudo(null)}
          onAtualizada={() => {
            onRecarregar();
          }}
          onAvisar={onAvisar}
        />
      )}
    </div>
  );
}
