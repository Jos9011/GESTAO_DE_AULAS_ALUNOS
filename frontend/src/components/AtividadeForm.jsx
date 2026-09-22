import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

export default function AtividadeForm({ onAdicionar }) {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('HIDRATACAO');
  const [metaOuDescricao, setMetaOuDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    setLoading(true);
    try {
      await onAdicionar({
        titulo: titulo.trim(),
        categoria,
        metaOuDescricao: metaOuDescricao.trim() || 'Meta diária',
        concluida: false,
      });
      setTitulo('');
      setMetaOuDescricao('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="card-heading">
        <PlusCircle size={20} color="#10b981" /> Nova Atividade / Hábito
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Título da Atividade</label>
          <input
            id="titulo"
            type="text"
            className="form-input"
            placeholder="Ex: Beber 500ml de água, Treino pernas..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoria">Categoria</label>
          <select
            id="categoria"
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="HIDRATACAO">💧 Hidratação</option>
            <option value="EXERCICIO">🏃 Exercício Físico</option>
            <option value="SONO">😴 Sono e Descanso</option>
            <option value="ALIMENTACAO">🥗 Alimentação Saudável</option>
            <option value="BEM_ESTAR">🧘 Bem-Estar e Mente</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="meta">Meta ou Observação</label>
          <input
            id="meta"
            type="text"
            className="form-input"
            placeholder="Ex: 2 litros, 45 min, 8 horas..."
            value={metaOuDescricao}
            onChange={(e) => setMetaOuDescricao(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Adicionar Atividade'}
        </button>
      </form>
    </div>
  );
}
