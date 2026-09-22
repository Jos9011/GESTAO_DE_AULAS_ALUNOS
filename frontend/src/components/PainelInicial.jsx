import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Layers,
  GraduationCap,
  HardDrive,
  Play,
  PlusCircle,
  FolderSearch,
  Video,
  FileText,
  Presentation,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';
import { getResumoAulas, getDiscos, abrirAulaCompleta } from '../services/api';

export default function PainelInicial({
  onIrParaAulas,
  onIrParaCriar,
  onIrParaExplorador,
  onAvisar
}) {
  const [resumo, setResumo] = useState({
    totalAulas: 0,
    totalMateriais: 0,
    totalMaterias: 0,
    totalVideos: 0,
    totalPdfs: 0,
    totalSlides: 0,
    totalDocs: 0,
    ultimasAulas: []
  });
  const [discos, setDiscos] = useState([]);
  const [abrindoId, setAbrindoId] = useState(null);

  useEffect(() => {
    carregarResumo();
    carregarDiscos();
  }, []);

  const carregarResumo = async () => {
    try {
      const data = await getResumoAulas();
      setResumo(data);
    } catch (err) {
      console.warn('Erro ao carregar resumo:', err);
    }
  };

  const carregarDiscos = async () => {
    try {
      const lista = await getDiscos();
      setDiscos(lista);
    } catch (err) {
      console.warn('Erro ao carregar discos:', err);
    }
  };

  const handleAbrirAulaRapida = async (aula) => {
    if (!aula.arquivos || aula.arquivos.length === 0) {
      alert('Esta aula não possui materiais associados.');
      return;
    }

    setAbrindoId(aula.id);
    try {
      const res = await abrirAulaCompleta(aula.id);
      if (res.sucesso) {
        onAvisar(`🚀 Abrindo aula "${aula.titulo}": ${res.arquivosAbertos} arquivo(s) em execução!`);
      } else {
        alert('Erro ao abrir aula: ' + (res.erros?.join('\n') || 'Verifique se o HD está conectado.'));
      }
    } catch (err) {
      alert('Falha ao comunicar com o servidor.');
    } finally {
      setAbrindoId(null);
    }
  };

  return (
    <div className="painel-dashboard-container">
      {/* Banner de Boas-Vindas */}
      <div className="dashboard-hero">
        <div className="hero-text">
          <h2>Bem-vindo à sua Central de Aulas</h2>
          <p>
            Organize os arquivos do seu HD externo por disciplinas, crie planos de estudo e abra tudo com apenas 1 clique.
          </p>
        </div>

        <div className="hero-botoes">
          <button className="btn-hero-primary" onClick={onIrParaCriar}>
            <PlusCircle size={18} />
            <span>Criar Nova Aula</span>
          </button>
          <button className="btn-hero-secondary" onClick={onIrParaExplorador}>
            <FolderSearch size={18} />
            <span>Explorar HD</span>
          </button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="metricas-grid">
        <div className="metrica-card">
          <div className="metrica-icon" style={{ background: 'rgba(59, 130, 246, 0.18)', color: '#60a5fa' }}>
            <BookOpen size={24} />
          </div>
          <div className="metrica-info">
            <span className="metrica-rotulo">Aulas Montadas</span>
            <span className="metrica-valor">{resumo.totalAulas}</span>
          </div>
        </div>

        <div className="metrica-card">
          <div className="metrica-icon" style={{ background: 'rgba(16, 185, 129, 0.18)', color: '#34d399' }}>
            <Layers size={24} />
          </div>
          <div className="metrica-info">
            <span className="metrica-rotulo">Materiais Vinculados</span>
            <span className="metrica-valor">{resumo.totalMateriais}</span>
          </div>
        </div>

        <div className="metrica-card">
          <div className="metrica-icon" style={{ background: 'rgba(168, 85, 247, 0.18)', color: '#c084fc' }}>
            <GraduationCap size={24} />
          </div>
          <div className="metrica-info">
            <span className="metrica-rotulo">Disciplinas / Cursos</span>
            <span className="metrica-valor">{resumo.totalMaterias}</span>
          </div>
        </div>

        <div className="metrica-card">
          <div className="metrica-icon" style={{ background: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8' }}>
            <HardDrive size={24} />
          </div>
          <div className="metrica-info">
            <span className="metrica-rotulo">HDs & Unidades</span>
            <span className="metrica-valor">{discos.length} detectadas</span>
          </div>
        </div>
      </div>

      {/* Layout 2 Colunas: Aulas Recentes + Detalhes do HD & Mídias */}
      <div className="painel-duas-colunas">
        {/* Coluna Esquerda: Aulas Recentes */}
        <div className="painel-secao-card">
          <div className="secao-header">
            <div className="secao-titulo-wrapper">
              <Clock size={20} color="#3b82f6" />
              <h3>Aulas Recentes (Acesso Rápido)</h3>
            </div>
            {resumo.totalAulas > 0 && (
              <button className="btn-link" onClick={onIrParaAulas}>
                Ver todas ({resumo.totalAulas}) <ArrowRight size={14} />
              </button>
            )}
          </div>

          {resumo.ultimasAulas && resumo.ultimasAulas.length > 0 ? (
            <div className="ultimas-aulas-lista">
              {resumo.ultimasAulas.map((aula) => {
                const isAbrindo = abrindoId === aula.id;

                return (
                  <div key={aula.id} className="item-aula-recente">
                    <div className="aula-recente-info">
                      <div className="aula-recente-tags">
                        <span className="badge-materia-pequena">{aula.materia || 'Geral'}</span>
                        <span className="badge-materiais-count">
                          {aula.arquivos?.length || 0} materiais
                        </span>
                      </div>
                      <h4 className="aula-recente-nome">{aula.titulo}</h4>
                      {aula.descricao && (
                        <p className="aula-recente-desc">{aula.descricao}</p>
                      )}
                    </div>

                    <button
                      className={`btn-play-recente ${isAbrindo ? 'loading' : ''}`}
                      onClick={() => handleAbrirAulaRapida(aula)}
                      disabled={isAbrindo || !aula.arquivos?.length}
                      title="Abrir todos os arquivos desta aula agora"
                    >
                      <Play size={16} fill="currentColor" />
                      <span>{isAbrindo ? 'Abrindo...' : 'Abrir'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="painel-empty-card">
              <BookOpen size={40} color="#64748b" />
              <p>Nenhuma aula criada até o momento.</p>
              <button className="btn-primary-sm" onClick={onIrParaCriar}>
                + Criar Primeira Aula
              </button>
            </div>
          )}
        </div>

        {/* Coluna Direita: Distribuição de Mídias e HDs */}
        <div className="painel-coluna-lateral">
          {/* Distribuição de Conteúdo */}
          <div className="painel-secao-card">
            <div className="secao-header">
              <div className="secao-titulo-wrapper">
                <Sparkles size={20} color="#10b981" />
                <h3>Materiais por Formato</h3>
              </div>
            </div>

            <div className="midias-grid">
              <div className="midia-item video">
                <Video size={20} color="#fb7185" />
                <span className="midia-qtd">{resumo.totalVideos || 0}</span>
                <span className="midia-nome">Vídeos</span>
              </div>

              <div className="midia-item pdf">
                <FileText size={20} color="#f87171" />
                <span className="midia-qtd">{resumo.totalPdfs || 0}</span>
                <span className="midia-nome">PDFs / Livros</span>
              </div>

              <div className="midia-item slide">
                <Presentation size={20} color="#fbbf24" />
                <span className="midia-qtd">{resumo.totalSlides || 0}</span>
                <span className="midia-nome">Slides (PPT)</span>
              </div>

              <div className="midia-item doc">
                <FileText size={20} color="#60a5fa" />
                <span className="midia-qtd">{resumo.totalDocs || 0}</span>
                <span className="midia-nome">Docs / Textos</span>
              </div>
            </div>
          </div>

          {/* Unidades de Disco e HDs */}
          <div className="painel-secao-card">
            <div className="secao-header">
              <div className="secao-titulo-wrapper">
                <HardDrive size={20} color="#38bdf8" />
                <h3>HDs e Discos Conectados</h3>
              </div>
              <button className="btn-link" onClick={onIrParaExplorador}>
                Navegar <ArrowRight size={14} />
              </button>
            </div>

            <div className="discos-resumo-lista">
              {discos.map((d) => (
                <div key={d.letra} className="disco-resumo-item" onClick={onIrParaExplorador}>
                  <HardDrive size={18} color="#38bdf8" />
                  <div className="disco-resumo-text">
                    <strong>{d.nomeExibicao}</strong>
                    <span>{d.espacoLivreFormatado} livres de {d.espacoTotalFormatado}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dicas e Portabilidade */}
          <div className="painel-dica-card">
            <div className="dica-header">
              <CheckCircle2 size={18} color="#10b981" />
              <strong>Dica de Produtividade</strong>
            </div>
            <p>
              Ao clicar em <strong>"ABRIR AULA"</strong>, o Windows inicia os vídeos no seu player preferido (ex: VLC) e abre as apostilas em PDF simultaneamente, deixando seu ambiente de estudo pronto instantaneamente!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
