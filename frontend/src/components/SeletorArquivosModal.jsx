import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  FolderUp,
  RotateCw,
  Search,
  Check,
  Plus,
  X,
  Folder,
  FolderOpen,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { getDiscos, getConteudoPasta } from '../services/api';
import { getFileMeta } from '../utils/fileIcons';

export default function SeletorArquivosModal({
  isOpen,
  onClose,
  arquivosIniciais,
  onConfirmar
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
  const [selecionados, setSelecionados] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setSelecionados(arquivosIniciais || []);
      carregarDiscos();
    }
  }, [isOpen, arquivosIniciais]);

  const carregarDiscos = async () => {
    try {
      const lista = await getDiscos();
      setDiscos(lista);
      if (lista.length > 0 && !caminhoAtual) {
        navegar(lista[0].letra);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const navegar = async (caminho) => {
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

        // Se o usuário colou o caminho direto de um arquivo, seleciona-o automaticamente
        if (dados.arquivoDestacado) {
          const arq = dados.arquivoDestacado;
          setSelecionados((prev) => {
            const jaExiste = prev.some((a) => a.caminhoCompleto === arq.caminhoCompleto);
            return jaExiste ? prev : [...prev, arq];
          });
        }
      }
    } catch (err) {
      setErro('Erro ao acessar o diretório. Verifique se o caminho ou HD está correto.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (caminhoAtual && isOpen) {
      navegar(caminhoAtual);
    }
  }, [filtroTipo]);

  const handleSubmeterCaminho = (e) => {
    e.preventDefault();
    if (caminhoInput.trim()) {
      navegar(caminhoInput.trim());
    }
  };

  const toggleArquivo = (item) => {
    setSelecionados((prev) => {
      const jaExiste = prev.some((a) => a.caminhoCompleto === item.caminhoCompleto);
      if (jaExiste) {
        return prev.filter((a) => a.caminhoCompleto !== item.caminhoCompleto);
      } else {
        return [...prev, item];
      }
    });
  };

  const selecionarTodosDestaPasta = () => {
    const apenasArquivos = itens.filter((i) => !i.diretorio);
    setSelecionados((prev) => {
      const caminhos = new Set(prev.map((p) => p.caminhoCompleto));
      const novos = apenasArquivos.filter((a) => !caminhos.has(a.caminhoCompleto));
      return [...prev, ...novos];
    });
  };

  const isSelecionado = (caminhoCompleto) => {
    return selecionados.some((a) => a.caminhoCompleto === caminhoCompleto);
  };

  const handleSalvar = () => {
    onConfirmar(selecionados);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        {/* Header do Modal */}
        <div className="modal-header">
          <div className="modal-header-info">
            <FolderOpen size={24} color="#10b981" />
            <div>
              <h3>Selecionar Materiais do HD</h3>
              <p>Cole o caminho da pasta/arquivo ou navegue pelas pastas do seu HD externo</p>
            </div>
          </div>
          <button className="modal-btn-close" onClick={onClose} title="Fechar">
            <X size={20} />
          </button>
        </div>

        {/* Barra de Discos */}
        <div className="modal-discos-bar">
          <span className="modal-discos-label">Unidades:</span>
          {discos.map((d) => (
            <button
              key={d.letra}
              className={`modal-disco-btn ${caminhoAtual.startsWith(d.letra) ? 'active' : ''}`}
              onClick={() => navegar(d.letra)}
            >
              <HardDrive size={14} />
              <span>{d.letra}</span>
              <small>({d.espacoLivreFormatado})</small>
            </button>
          ))}
        </div>

        {/* Barra de Caminho Editável (Input onde o usuário pode colar o caminho) */}
        <div className="modal-nav-bar">
          <button
            className="btn-nav-icon"
            onClick={() => caminhoPai && navegar(caminhoPai)}
            disabled={!caminhoPai}
            title="Subir um nível de pasta"
          >
            <FolderUp size={16} />
          </button>
          <button
            className="btn-nav-icon"
            onClick={() => navegar(caminhoAtual)}
            title="Atualizar pasta"
          >
            <RotateCw size={16} className={carregando ? 'spin' : ''} />
          </button>

          {/* FORMULÁRIO COM CAMPO DE TEXTO EDITÁVEL PARA COLAR O CAMINHO */}
          <form className="modal-caminho-form" onSubmit={handleSubmeterCaminho}>
            <input
              type="text"
              className="modal-caminho-input"
              placeholder="Cole ou digite o caminho da pasta ou arquivo (Ex: D:\Aulas ou E:\video.mp4)..."
              value={caminhoInput}
              onChange={(e) => setCaminhoInput(e.target.value)}
            />
            <button type="submit" className="btn-modal-ir" title="Ir para este caminho">
              <span>Ir</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Mensagem de Erro se o caminho não existir */}
        {erro && (
          <div className="modal-erro-box">
            <AlertCircle size={16} />
            <span>{erro}</span>
          </div>
        )}

        {/* Filtros e Busca */}
        <div className="modal-filtros-bar">
          <div className="filtros-tipos">
            {['TODOS', 'VIDEO', 'PDF', 'SLIDE', 'DOCUMENTO'].map((tipo) => (
              <button
                key={tipo}
                className={`filtro-chip ${filtroTipo === tipo ? 'active' : ''}`}
                onClick={() => setFiltroTipo(tipo)}
              >
                {tipo === 'TODOS' ? 'Todos' :
                 tipo === 'VIDEO' ? '🎬 Vídeos' :
                 tipo === 'PDF' ? '📄 PDFs' :
                 tipo === 'SLIDE' ? '📊 Slides' : '📝 Docs'}
              </button>
            ))}
          </div>

          <div className="busca-wrapper" style={{ minWidth: '200px' }}>
            <Search size={14} className="busca-icon" />
            <input
              type="text"
              className="busca-input"
              placeholder="Buscar pelo nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && navegar(caminhoAtual)}
            />
          </div>
        </div>

        {/* Lista de Arquivos */}
        <div className="modal-lista-container">
          {carregando ? (
            <div className="empty-state" style={{ padding: '30px' }}>
              <RotateCw size={28} className="spin" color="#10b981" />
              <p>Lendo arquivos da pasta...</p>
            </div>
          ) : itens.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px' }}>
              <p>Nenhum arquivo encontrado nesta pasta.</p>
            </div>
          ) : (
            <div className="modal-arquivos-grid">
              {itens.map((item) => {
                const meta = getFileMeta(item.tipo);
                const selecionado = isSelecionado(item.caminhoCompleto);

                if (item.diretorio) {
                  return (
                    <div
                      key={item.caminhoCompleto}
                      className="modal-item pasta"
                      onClick={() => navegar(item.caminhoCompleto)}
                      title="Clique para entrar na pasta"
                    >
                      <Folder size={18} color="#38bdf8" />
                      <span className="modal-item-nome">{item.nome}</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.caminhoCompleto}
                    className={`modal-item arquivo ${selecionado ? 'selected' : ''}`}
                    onClick={() => toggleArquivo(item)}
                  >
                    <div className="modal-item-check">
                      {selecionado ? (
                        <Check size={14} strokeWidth={3} />
                      ) : (
                        <Plus size={14} />
                      )}
                    </div>
                    <span className="modal-item-icon">{meta.icon}</span>
                    <div className="modal-item-dados">
                      <span className="modal-item-nome" title={item.nome}>{item.nome}</span>
                      <span className="modal-item-meta">{meta.label} • {item.tamanhoFormatado}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer do Modal com confirmação */}
        <div className="modal-footer">
          <div className="modal-footer-info">
            <button
              type="button"
              className="btn-secondary-sm"
              onClick={selecionarTodosDestaPasta}
            >
              + Marcar Todos desta Pasta
            </button>
            <span className="modal-selecionados-badge">
              <strong>{selecionados.length}</strong> {selecionados.length === 1 ? 'arquivo selecionado' : 'arquivos selecionados'}
            </span>
          </div>

          <div className="modal-footer-botoes">
            <button type="button" className="btn-modal-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn-modal-confirmar" onClick={handleSalvar}>
              Confirmar e Adicionar à Aula ({selecionados.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
