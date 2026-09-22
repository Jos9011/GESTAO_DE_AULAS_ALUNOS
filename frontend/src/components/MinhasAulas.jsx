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
  CheckCircle
} from 'lucide-react';
import { abrirAulaCompleta, abrirArquivoNoWindows, abrirPastaNoExplorer, excluirAula } from '../services/api';
import { getFileMeta } from '../utils/fileIcons';

export default function MinhasAulas({
  aulas,
  onRecarregar,
  onAvisar,
  onNovaAula
}) {
  const [filtroMateria, setFiltroMateria] = useState('TODAS');
  const [busca, setBusca] = useState('');
  const [abrindoId, setAbrindoId] = useState(null);

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
    const matchBusca =
      !busca ||
      aula.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      (aula.descricao && aula.descricao.toLowerCase().includes(busca.toLowerCase())) ||
      (aula.materia && aula.materia.toLowerCase().includes(busca.toLowerCase()));
    return matchMateria && matchBusca;
  });

  return (
    <div className="minhas-aulas-container">
      {/* Controles de Filtro e Pesquisa */}
      <div className="aulas-toolbar">
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
          <p>Crie sua primeira aula selecionando vídeos, PDFs e slides do seu HD externo.</p>
          <button className="btn-primary" style={{ maxWidth: '240px', margin: '16px auto 0' }} onClick={onNovaAula}>
            Criar Minha Primeira Aula
          </button>
        </div>
      ) : (
        <div className="aulas-grid">
          {aulasFiltradas.map((aula) => {
            const isAbrindo = abrindoId === aula.id;

            return (
              <div key={aula.id} className="aula-card">
                {/* Cabeçalho do Card */}
                <div className="aula-card-header">
                  <div>
                    {aula.materia && (
                      <span className="aula-materia-badge">{aula.materia}</span>
                    )}
                    <h3 className="aula-card-title">{aula.titulo}</h3>
                    <div className="aula-meta-info">
                      <Calendar size={13} />
                      <span>{aula.dataCriacao}</span>
                      <span>•</span>
                      <Layers size={13} />
                      <span>{aula.arquivos?.length || 0} materiais</span>
                    </div>
                  </div>

                  <button
                    className="btn-excluir-aula"
                    onClick={() => handleExcluir(aula)}
                    title="Excluir aula (não apaga os arquivos do HD)"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Descrição / Anotações da aula */}
                {aula.descricao && (
                  <p className="aula-descricao">{aula.descricao}</p>
                )}

                {/* BOTÃO PRINCIPAL: ABRIR AULA COM 1 CLIQUE */}
                <button
                  className={`btn-abrir-aula-completa ${isAbrindo ? 'loading' : ''}`}
                  onClick={() => handleAbrirAulaCompleta(aula)}
                  disabled={isAbrindo || !aula.arquivos?.length}
                  title="Abre todos os arquivos desta aula no Windows de uma só vez"
                >
                  <Play size={20} fill="currentColor" />
                  <span>{isAbrindo ? 'Abrindo arquivos no Windows...' : 'ABRIR AULA (1 CLIQUE)'}</span>
                </button>

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
    </div>
  );
}
