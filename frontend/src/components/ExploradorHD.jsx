import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  FolderUp,
  RotateCw,
  Search,
  ExternalLink,
  FolderOpen,
  Plus,
  Check,
  Play
} from 'lucide-react';
import { getDiscos, getConteudoPasta, abrirArquivoNoWindows, abrirPastaNoExplorer } from '../services/api';
import { getFileMeta } from '../utils/fileIcons';

export default function ExploradorHD({
  arquivosSelecionados,
  onAlternarArquivo,
  onAdicionarMultiplos,
  onAvisar,
  onIrParaCriacao
}) {
  const [discos, setDiscos] = useState([]);
  const [caminhoAtual, setCaminhoAtual] = useState('');
  const [caminhoInput, setCaminhoInput] = useState('');
  const [caminhoPai, setCaminhoPai] = useState(null);
  const [itens, setItens] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // Carregar unidades de disco
  useEffect(() => {
    carregarDiscos();
  }, []);

  const carregarDiscos = async () => {
    try {
      const listaDiscos = await getDiscos();
      setDiscos(listaDiscos);
      if (listaDiscos.length > 0 && !caminhoAtual) {
        navegarPara(listaDiscos[0].letra);
      }
    } catch (err) {
      console.error(err);
      setErro('Não foi possível carregar os discos do sistema.');
    }
  };

  const navegarPara = async (caminho) => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await getConteudoPasta(caminho, filtroTipo, busca);
      if (dados.erro) {
        setErro(dados.erro);
      } else {
        setCaminhoAtual(dados.caminhoAtual);
        setCaminhoInput(dados.caminhoAtual);
        setCaminhoPai(dados.caminhoPai);
        setItens(dados.itens || []);
      }
    } catch (err) {
      setErro('Erro ao acessar o diretório. Verifique se o HD está conectado.');
    } finally {
      setCarregando(false);
    }
  };

  // Recarrega quando mudar filtro ou busca
  useEffect(() => {
    if (caminhoAtual) {
      navegarPara(caminhoAtual);
    }
  }, [filtroTipo]);

  const handleSubmeterCaminho = (e) => {
    e.preventDefault();
    if (caminhoInput.trim()) {
      navegarPara(caminhoInput.trim());
    }
  };

  const handleSubirNivel = () => {
    if (caminhoPai) {
      navegarPara(caminhoPai);
    }
  };

  const handleAbrirArquivo = async (item) => {
    try {
      const res = await abrirArquivoNoWindows(item.caminhoCompleto);
      if (res.sucesso) {
        onAvisar(`Abrindo "${item.nome}" no Windows...`);
      } else {
        alert('Erro ao abrir o arquivo: ' + res.mensagem);
      }
    } catch (err) {
      alert('Falha ao comunicar com o backend.');
    }
  };

  const handleAbrirNoExplorer = async (caminho) => {
    try {
      const res = await abrirPastaNoExplorer(caminho);
      if (res.sucesso) {
        onAvisar('Pasta aberta no Windows Explorer.');
      }
    } catch (err) {
      alert('Falha ao abrir Windows Explorer.');
    }
  };

  const estaSelecionado = (caminhoCompleto) => {
    return arquivosSelecionados.some((arq) => arq.caminhoCompleto === caminhoCompleto);
  };

  const adicionarTodosVisiveis = () => {
    const apenasArquivos = itens.filter((i) => !i.diretorio);
    onAdicionarMultiplos(apenasArquivos);
    onAvisar(`${apenasArquivos.length} arquivos adicionados à aula!`);
  };

  return (
    <div className="explorador-container">
      {/* Seletor de Discos / HDs Externos */}
      <div className="discos-banner">
        <div className="discos-label">
          <HardDrive size={18} />
          <span>Unidades Detectadas:</span>
        </div>
        <div className="discos-lista">
          {discos.map((d) => (
            <button
              key={d.letra}
              className={`disco-pill ${caminhoAtual.startsWith(d.letra) ? 'active' : ''}`}
              onClick={() => navegarPara(d.letra)}
              title={`Espaço livre: ${d.espacoLivreFormatado} de ${d.espacoTotalFormatado}`}
            >
              <HardDrive size={15} />
              <span className="disco-letra">{d.letra}</span>
              <span className="disco-info">{d.espacoLivreFormatado} livre</span>
            </button>
          ))}
        </div>
      </div>

      {/* Barra de Navegação e Caminho */}
      <div className="nav-bar-card">
        <div className="nav-actions">
          <button
            className="btn-nav-icon"
            onClick={handleSubirNivel}
            disabled={!caminhoPai}
            title="Subir um nível de pasta"
          >
            <FolderUp size={18} />
          </button>
          <button
            className="btn-nav-icon"
            onClick={() => navegarPara(caminhoAtual)}
            title="Atualizar pasta"
          >
            <RotateCw size={18} className={carregando ? 'spin' : ''} />
          </button>
          <button
            className="btn-nav-icon"
            onClick={() => handleAbrirNoExplorer(caminhoAtual)}
            title="Abrir esta pasta no Windows Explorer"
          >
            <FolderOpen size={18} />
          </button>
        </div>

        <form className="caminho-form" onSubmit={handleSubmeterCaminho}>
          <input
            type="text"
            className="caminho-input"
            value={caminhoInput}
            onChange={(e) => setCaminhoInput(e.target.value)}
            placeholder="Digite ou cole o caminho da pasta do HD (Ex: D:\Aulas)..."
          />
          <button type="submit" className="btn-ir">Ir</button>
        </form>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="filtros-bar">
        <div className="filtros-tipos">
          {['TODOS', 'VIDEO', 'PDF', 'SLIDE', 'DOCUMENTO', 'AUDIO'].map((tipo) => (
            <button
              key={tipo}
              className={`filtro-chip ${filtroTipo === tipo ? 'active' : ''}`}
              onClick={() => setFiltroTipo(tipo)}
            >
              {tipo === 'TODOS' ? 'Todos' :
               tipo === 'VIDEO' ? '🎬 Vídeos' :
               tipo === 'PDF' ? '📄 PDFs' :
               tipo === 'SLIDE' ? '📊 Slides' :
               tipo === 'DOCUMENTO' ? '📝 Docs' : '🎵 Áudio'}
            </button>
          ))}
        </div>

        <div className="busca-wrapper">
          <Search size={16} className="busca-icon" />
          <input
            type="text"
            className="busca-input"
            placeholder="Filtrar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navegarPara(caminhoAtual);
            }}
          />
        </div>
      </div>

      {/* Ações de Seleção em Massa */}
      {itens.some(i => !i.diretorio) && (
        <div className="acoes-lote-bar">
          <span className="info-texto">
            {itens.filter(i => !i.diretorio).length} arquivos nesta pasta
          </span>
          <button className="btn-secondary-sm" onClick={adicionarTodosVisiveis}>
            <Plus size={14} /> Selecionar Todos os Arquivos para a Aula
          </button>
        </div>
      )}

      {/* Lista de Pastas e Arquivos */}
      {erro ? (
        <div className="erro-box">
          <p>{erro}</p>
        </div>
      ) : carregando ? (
        <div className="empty-state">
          <RotateCw size={32} className="spin" color="#10b981" />
          <p>Lendo arquivos do HD...</p>
        </div>
      ) : itens.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum arquivo ou pasta encontrado neste diretório.</p>
        </div>
      ) : (
        <div className="itens-grid">
          {itens.map((item) => {
            const meta = getFileMeta(item.tipo);
            const selecionado = estaSelecionado(item.caminhoCompleto);

            return (
              <div
                key={item.caminhoCompleto}
                className={`item-card ${item.diretorio ? 'is-folder' : 'is-file'} ${selecionado ? 'selected' : ''}`}
              >
                <div
                  className="item-click-area"
                  onClick={() => {
                    if (item.diretorio) {
                      navegarPara(item.caminhoCompleto);
                    } else {
                      handleAbrirArquivo(item);
                    }
                  }}
                  title={item.diretorio ? 'Clique para entrar na pasta' : 'Clique para abrir no Windows'}
                >
                  <div className="item-icon-col">
                    {meta.icon}
                  </div>

                  <div className="item-details">
                    <span className="item-title" title={item.nome}>{item.nome}</span>
                    <div className="item-meta-row">
                      <span className={`badge-tipo ${meta.badgeClass}`}>{meta.label}</span>
                      {!item.diretorio && (
                        <span className="item-tamanho">{item.tamanhoFormatado}</span>
                      )}
                      <span className="item-data">{item.dataModificacao}</span>
                    </div>
                  </div>
                </div>

                <div className="item-actions">
                  {!item.diretorio ? (
                    <>
                      <button
                        className="btn-item-action play"
                        onClick={() => handleAbrirArquivo(item)}
                        title="Abrir no Windows agora"
                      >
                        <Play size={15} />
                      </button>

                      <button
                        className={`btn-item-action check ${selecionado ? 'is-checked' : ''}`}
                        onClick={() => onAlternarArquivo(item)}
                        title={selecionado ? 'Remover da aula' : 'Adicionar à aula'}
                      >
                        {selecionado ? <Check size={16} strokeWidth={3} /> : <Plus size={16} />}
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn-item-action"
                      onClick={() => handleAbrirNoExplorer(item.caminhoCompleto)}
                      title="Abrir no Windows Explorer"
                    >
                      <ExternalLink size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
