import React from 'react';
import { Layers, ArrowRight, X } from 'lucide-react';

export default function BandejaSelecao({ arquivos, onRemover, onLimpar, onCriarAula }) {
  if (arquivos.length === 0) return null;

  return (
    <div className="bandeja-flutuante">
      <div className="bandeja-content">
        <div className="bandeja-info">
          <div className="bandeja-icon">
            <Layers size={20} />
          </div>
          <div>
            <strong>{arquivos.length} {arquivos.length === 1 ? 'arquivo selecionado' : 'arquivos selecionados'}</strong>
            <p className="bandeja-sub">Prontos para montar sua aula</p>
          </div>
        </div>

        <div className="bandeja-acoes">
          <button className="btn-limpar-selecao" onClick={onLimpar} title="Limpar seleção">
            <X size={16} /> Limpar
          </button>
          <button className="btn-montar-aula" onClick={onCriarAula}>
            <span>Criar Aula com Selecionados</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
