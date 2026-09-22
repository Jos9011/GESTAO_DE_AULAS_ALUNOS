import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Star,
  CheckCircle,
  Circle,
  FileText,
  BookOpen,
  Sparkles,
  Save,
  ExternalLink,
  Layers,
  HelpCircle
} from 'lucide-react';
import { getStreamUrl, getVisualizarUrl, salvarAnotacoes, toggleConcluida, toggleFavorita, abrirArquivoNoWindows } from '../services/api';
import { getFileMeta } from '../utils/fileIcons';

export default function PlayerModal({ aula, onClose, onAtualizada, onAvisar }) {
  const [aulaAtual, setAulaAtual] = useState(aula);
  const [indiceArquivo, setIndiceArquivo] = useState(0);
  const [velocidade, setVelocidade] = useState(1.0);
  const [anotacoes, setAnotacoes] = useState(aula.anotacoesEstudo || '');
  const [salvandoAnotacoes, setSalvandoAnotacoes] = useState(false);
  const [abaDireita, setAbaDireita] = useState('notas'); // 'notas' ou 'guia'
  const videoRef = useRef(null);

  const arquivos = aulaAtual.arquivos || [];
  const arquivoAtual = arquivos[indiceArquivo] || null;

  useEffect(() => {
    setAulaAtual(aula);
    setAnotacoes(aula.anotacoesEstudo || '');
  }, [aula]);

  const handleAlterarVelocidade = (v) => {
    setVelocidade(v);
    if (videoRef.current) {
      videoRef.current.playbackRate = v;
    }
  };

  const pularSegundos = (segundos) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime + segundos);
    }
  };

  const handleSalvarAnotacoes = async () => {
    setSalvandoAnotacoes(true);
    try {
      const atualizada = await salvarAnotacoes(aulaAtual.id, anotacoes);
      setAulaAtual(atualizada);
      onAtualizada(atualizada);
      onAvisar('✍️ Anotações salvas com sucesso!');
    } catch (err) {
      alert('Erro ao salvar anotações.');
    } finally {
      setSalvandoAnotacoes(false);
    }
  };

  const handleToggleConcluida = async () => {
    try {
      const atualizada = await toggleConcluida(aulaAtual.id);
      setAulaAtual(atualizada);
      onAtualizada(atualizada);
      onAvisar(atualizada.concluida ? '🎉 Aula marcada como concluída!' : 'Aula marcada como pendente.');
    } catch (err) {
      alert('Erro ao alterar status de conclusão.');
    }
  };

  const handleToggleFavorita = async () => {
    try {
      const atualizada = await toggleFavorita(aulaAtual.id);
      setAulaAtual(atualizada);
      onAtualizada(atualizada);
      onAvisar(atualizada.favorita ? '⭐ Aula adicionada aos favoritos!' : 'Aula removida dos favoritos.');
    } catch (err) {
      alert('Erro ao alterar favoritos.');
    }
  };

  const handleAbrirNoWindows = async (caminho, nome) => {
    try {
      await abrirArquivoNoWindows(caminho);
      onAvisar(`Abrindo "${nome}" no aplicativo padrão do Windows...`);
    } catch (err) {
      alert('Erro ao abrir arquivo no Windows.');
    }
  };

  const isVideo = arquivoAtual?.tipo === 'VIDEO' || 
    (arquivoAtual?.nome && /\.(mp4|webm|mkv|mov|avi)$/i.test(arquivoAtual.nome));
  const isPdf = arquivoAtual?.tipo === 'PDF' || 
    (arquivoAtual?.nome && /\.pdf$/i.test(arquivoAtual.nome));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="player-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho do Player Modal */}
        <div className="player-modal-header">
          <div className="player-header-left">
            {aulaAtual.materia && (
              <span className="aula-materia-badge">{aulaAtual.materia}</span>
            )}
            <h2 className="player-title">{aulaAtual.titulo}</h2>
            {aulaAtual.concluida && (
              <span className="badge-concluida-pill">
                <CheckCircle size={14} /> Concluída
              </span>
            )}
          </div>

          <div className="player-header-actions">
            <button
              className={`btn-header-action ${aulaAtual.favorita ? 'favorita' : ''}`}
              onClick={handleToggleFavorita}
              title={aulaAtual.favorita ? 'Remover dos Favoritos' : 'Marcar como Favorita'}
            >
              <Star size={18} fill={aulaAtual.favorita ? '#f59e0b' : 'none'} color={aulaAtual.favorita ? '#f59e0b' : 'currentColor'} />
              <span>{aulaAtual.favorita ? 'Favorita' : 'Favoritar'}</span>
            </button>

            <button
              className={`btn-header-action ${aulaAtual.concluida ? 'concluida' : ''}`}
              onClick={handleToggleConcluida}
              title="Alternar status de conclusão"
            >
              {aulaAtual.concluida ? <CheckCircle size={18} color="#10b981" /> : <Circle size={18} />}
              <span>{aulaAtual.concluida ? 'Concluída' : 'Marcar Concluída'}</span>
            </button>

            <button className="btn-modal-fechar" onClick={onClose} title="Fechar (Esc)">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Abas dos Materiais da Aula (se houver mais de 1) */}
        {arquivos.length > 0 && (
          <div className="player-materiais-tabs">
            {arquivos.map((arq, idx) => {
              const meta = getFileMeta(arq.tipo);
              const ativo = idx === indiceArquivo;
              return (
                <button
                  key={idx}
                  className={`material-tab-item ${ativo ? 'active' : ''}`}
                  onClick={() => setIndiceArquivo(idx)}
                >
                  <span className="material-tab-icon">{meta.icon}</span>
                  <span className="material-tab-label">{arq.nome}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Corpo Principal (Dividido: Mídia à esquerda, Anotações à direita) */}
        <div className="player-modal-body">
          {/* Lado Esquerdo: Visualizador de Mídia */}
          <div className="player-media-area">
            {arquivoAtual ? (
              <>
                {isVideo ? (
                  <div className="video-player-wrapper">
                    <video
                      key={arquivoAtual.caminhoCompleto}
                      ref={videoRef}
                      className="html5-video-player"
                      controls
                      autoPlay
                      onLoadedMetadata={() => {
                        if (videoRef.current) videoRef.current.playbackRate = velocidade;
                      }}
                    >
                      <source src={getStreamUrl(arquivoAtual.caminhoCompleto)} type="video/mp4" />
                      Seu navegador não suporta reprodução direta deste formato de vídeo.
                    </video>

                    {/* Barra de Aceleração e Atalhos */}
                    <div className="video-custom-controls">
                      <div className="velocidades-container">
                        <span className="velocidade-label">Velocidade:</span>
                        {[1.0, 1.25, 1.5, 1.75, 2.0].map((v) => (
                          <button
                            key={v}
                            className={`btn-velocidade ${velocidade === v ? 'active' : ''}`}
                            onClick={() => handleAlterarVelocidade(v)}
                          >
                            {v}x
                          </button>
                        ))}
                      </div>

                      <div className="pular-container">
                        <button className="btn-pular" onClick={() => pularSegundos(-10)} title="Voltar 10 segundos">
                          <RotateCcw size={15} /> -10s
                        </button>
                        <button className="btn-pular" onClick={() => pularSegundos(10)} title="Avançar 10 segundos">
                          +10s <RotateCw size={15} />
                        </button>
                        <button
                          className="btn-pular windows-btn"
                          onClick={() => handleAbrirNoWindows(arquivoAtual.caminhoCompleto, arquivoAtual.nome)}
                          title="Abrir no VLC / reprodutor do Windows"
                        >
                          <ExternalLink size={14} /> Abrir no Windows
                        </button>
                      </div>
                    </div>
                  </div>
                ) : isPdf ? (
                  <div className="pdf-viewer-wrapper">
                    <iframe
                      src={getVisualizarUrl(arquivoAtual.caminhoCompleto)}
                      title={arquivoAtual.nome}
                      className="pdf-iframe"
                    />
                    <div className="pdf-footer-bar">
                      <span>Documento PDF: {arquivoAtual.nome}</span>
                      <button
                        className="btn-pular windows-btn"
                        onClick={() => handleAbrirNoWindows(arquivoAtual.caminhoCompleto, arquivoAtual.nome)}
                      >
                        <ExternalLink size={14} /> Abrir no Adobe / Leitor Windows
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="unsupported-media-box">
                    <Layers size={48} color="#64748b" />
                    <h3>Arquivo: {arquivoAtual.nome}</h3>
                    <p>Este formato ({arquivoAtual.tipo}) é melhor aproveitado abrindo no programa nativo do seu computador.</p>
                    <button
                      className="btn-primary"
                      onClick={() => handleAbrirNoWindows(arquivoAtual.caminhoCompleto, arquivoAtual.nome)}
                    >
                      <ExternalLink size={18} /> Executar no Windows
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <BookOpen size={48} color="#64748b" />
                <h3>Nenhum material selecionado</h3>
              </div>
            )}
          </div>

          {/* Lado Direito: Caderno de Anotações & Guia */}
          <div className="player-notes-area">
            <div className="notes-tabs">
              <button
                className={`note-tab-btn ${abaDireita === 'notas' ? 'active' : ''}`}
                onClick={() => setAbaDireita('notas')}
              >
                <FileText size={16} /> Caderno de Anotações
              </button>
              <button
                className={`note-tab-btn ${abaDireita === 'guia' ? 'active' : ''}`}
                onClick={() => setAbaDireita('guia')}
              >
                <Sparkles size={16} /> Guia & Resumo
              </button>
            </div>

            {abaDireita === 'notas' ? (
              <div className="notes-container">
                <textarea
                  className="notes-textarea"
                  placeholder="Escreva seus resumos, dúvidas, insights e pontos importantes desta aula..."
                  value={anotacoes}
                  onChange={(e) => setAnotacoes(e.target.value)}
                />
                <div className="notes-footer">
                  <span className="notes-char-count">{anotacoes.length} caracteres</span>
                  <button
                    className="btn-salvar-notas"
                    onClick={handleSalvarAnotacoes}
                    disabled={salvandoAnotacoes}
                  >
                    <Save size={16} />
                    <span>{salvandoAnotacoes ? 'Salvando...' : 'Salvar Anotações'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="guia-container">
                <div className="guia-card">
                  <span className="guia-badge">Objetivo da Aula</span>
                  <h4>{aulaAtual.titulo}</h4>
                  <p>{aulaAtual.descricao || 'Sem descrição cadastrada. Use as anotações para registrar o foco desta aula.'}</p>
                </div>

                <div className="guia-card">
                  <span className="guia-badge">Materiais de Apoio</span>
                  <ul className="guia-lista-materiais">
                    {arquivos.map((a, i) => (
                      <li key={i}>
                        <strong>{a.nome}</strong> ({a.tipo})
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="guia-card dica-estudo">
                  <h4>💡 Dica de Retenção Ativa</h4>
                  <p>
                    Experimente assistir o vídeo em <strong>1.25x</strong> ou <strong>1.5x</strong>. Anote com suas próprias palavras os 3 conceitos mais cruciais e marque a aula como <strong>Concluída</strong> ao terminar.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
