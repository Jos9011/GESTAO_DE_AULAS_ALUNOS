import React from 'react';
import { Check, Trash2 } from 'lucide-react';

const CATEGORIAS_NOMES = {
  HIDRATACAO: 'Hidratação',
  EXERCICIO: 'Exercício',
  SONO: 'Sono',
  ALIMENTACAO: 'Alimentação',
  BEM_ESTAR: 'Bem-Estar',
};

export default function AtividadeItem({ atividade, onToggle, onExcluir }) {
  return (
    <div className={`atividade-item ${atividade.concluida ? 'concluida' : ''}`}>
      <div className="item-left">
        <button
          className={`checkbox-btn ${atividade.concluida ? 'checked' : ''}`}
          onClick={() => onToggle(atividade.id)}
          title={atividade.concluida ? 'Marcar como pendente' : 'Marcar como concluída'}
        >
          {atividade.concluida && <Check size={16} strokeWidth={3} />}
        </button>

        <div className={`item-text ${atividade.concluida ? 'concluida-texto' : ''}`}>
          <h4>{atividade.titulo}</h4>
          <div className="item-meta">
            <span className={`tag-badge tag-${atividade.categoria}`}>
              {CATEGORIAS_NOMES[atividade.categoria] || atividade.categoria}
            </span>
            {atividade.metaOuDescricao && (
              <span>• {atividade.metaOuDescricao}</span>
            )}
          </div>
        </div>
      </div>

      <button
        className="btn-delete"
        onClick={() => onExcluir(atividade.id)}
        title="Excluir atividade"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
