import React from 'react';
import { LayoutDashboard, BookOpen, PlusCircle, FolderSearch, HardDrive } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, backendOnline, totalAulas, totalSelecionados }) {
  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand" onClick={() => setActiveTab('painel')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">
            <HardDrive size={26} />
          </div>
          <div>
            <h1 className="brand-title">Gestor de Aulas • Aluno</h1>
            <p className="brand-subtitle">Organize seus estudos, assista aulas e anote com 1 clique</p>
          </div>
        </div>

        <div className={`backend-badge ${backendOnline ? '' : 'offline'}`}>
          <span className={`status-dot ${backendOnline ? '' : 'offline'}`}></span>
          {backendOnline ? (
            <span>Java Conectado (Porta 8080)</span>
          ) : (
            <span>Java Desconectado</span>
          )}
        </div>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'painel' ? 'active' : ''}`}
          onClick={() => setActiveTab('painel')}
        >
          <LayoutDashboard size={18} />
          <span>Painel Inicial</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'aulas' ? 'active' : ''}`}
          onClick={() => setActiveTab('aulas')}
        >
          <BookOpen size={18} />
          <span>Minhas Aulas</span>
          {totalAulas > 0 && <span className="tab-count-badge">{totalAulas}</span>}
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'explorador' ? 'active' : ''}`}
          onClick={() => setActiveTab('explorador')}
        >
          <FolderSearch size={18} />
          <span>Explorador do HD</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'criar' ? 'active' : ''}`}
          onClick={() => setActiveTab('criar')}
        >
          <PlusCircle size={18} />
          <span>Criar Aula</span>
          {totalSelecionados > 0 && (
            <span className="tab-count-badge highlight">{totalSelecionados} arq.</span>
          )}
        </button>
      </nav>
    </header>
  );
}
