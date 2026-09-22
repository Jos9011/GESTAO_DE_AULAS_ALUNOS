import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PainelInicial from './components/PainelInicial';
import ExploradorHD from './components/ExploradorHD';
import MinhasAulas from './components/MinhasAulas';
import CriarAulaView from './components/CriarAulaView';
import BandejaSelecao from './components/BandejaSelecao';
import Toast from './components/Toast';
import { getAulas } from './services/api';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('painel'); // 'painel' | 'aulas' | 'explorador' | 'criar'
  const [arquivosSelecionados, setArquivosSelecionados] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [backendOnline, setBackendOnline] = useState(false);
  const [aviso, setAviso] = useState(null);

  const carregarAulas = async () => {
    try {
      const lista = await getAulas();
      setAulas(lista);
      setBackendOnline(true);
    } catch (err) {
      console.warn('Backend indisponível:', err);
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    carregarAulas();
    const interval = setInterval(carregarAulas, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleAlternarArquivo = (item) => {
    setArquivosSelecionados((prev) => {
      const jaExiste = prev.some((a) => a.caminhoCompleto === item.caminhoCompleto);
      if (jaExiste) {
        return prev.filter((a) => a.caminhoCompleto !== item.caminhoCompleto);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleAdicionarMultiplos = (itensNovos) => {
    setArquivosSelecionados((prev) => {
      const caminhosAtuais = new Set(prev.map((a) => a.caminhoCompleto));
      const filtrados = itensNovos.filter((i) => !caminhosAtuais.has(i.caminhoCompleto));
      return [...prev, ...filtrados];
    });
  };

  const handleRemoverArquivo = (caminhoCompleto) => {
    setArquivosSelecionados((prev) =>
      prev.filter((a) => a.caminhoCompleto !== caminhoCompleto)
    );
  };

  const handleLimparArquivos = () => {
    setArquivosSelecionados([]);
  };

  const handleAulaCriada = () => {
    carregarAulas();
    setActiveTab('aulas');
  };

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendOnline={backendOnline}
        totalAulas={aulas.length}
        totalSelecionados={arquivosSelecionados.length}
      />

      <main className="main-content-layout">
        {activeTab === 'painel' && (
          <PainelInicial
            onIrParaAulas={() => setActiveTab('aulas')}
            onIrParaCriar={() => setActiveTab('criar')}
            onIrParaExplorador={() => setActiveTab('explorador')}
            onAvisar={setAviso}
          />
        )}

        {activeTab === 'aulas' && (
          <MinhasAulas
            aulas={aulas}
            onRecarregar={carregarAulas}
            onAvisar={setAviso}
            onNovaAula={() => setActiveTab('criar')}
          />
        )}

        {activeTab === 'explorador' && (
          <ExploradorHD
            arquivosSelecionados={arquivosSelecionados}
            onAlternarArquivo={handleAlternarArquivo}
            onAdicionarMultiplos={handleAdicionarMultiplos}
            onAvisar={setAviso}
            onIrParaCriacao={() => setActiveTab('criar')}
          />
        )}

        {activeTab === 'criar' && (
          <CriarAulaView
            arquivosSelecionados={arquivosSelecionados}
            onAtualizarArquivos={(novos) => setArquivosSelecionados(novos)}
            onRemoverArquivo={handleRemoverArquivo}
            onLimparArquivos={handleLimparArquivos}
            onAulaCriada={handleAulaCriada}
            onAvisar={setAviso}
          />
        )}
      </main>

      {/* Bandeja flutuante apenas no explorador com itens selecionados */}
      {activeTab === 'explorador' && (
        <BandejaSelecao
          arquivos={arquivosSelecionados}
          onRemover={handleRemoverArquivo}
          onLimpar={handleLimparArquivos}
          onCriarAula={() => setActiveTab('criar')}
        />
      )}

      {/* Toast de feedback */}
      <Toast mensagem={aviso} onClose={() => setAviso(null)} />
    </div>
  );
}
