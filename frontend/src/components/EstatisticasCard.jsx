import React from 'react';
import { Target, CheckCircle, Clock, Award } from 'lucide-react';

export default function EstatisticasCard({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
          <Target size={24} />
        </div>
        <div className="stat-info">
          <h3>Total de Metas</h3>
          <p className="stat-number">{stats.total ?? 0}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
          <CheckCircle size={24} />
        </div>
        <div className="stat-info">
          <h3>Concluídas</h3>
          <p className="stat-number">{stats.concluidas ?? 0}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
          <Clock size={24} />
        </div>
        <div className="stat-info">
          <h3>Pendentes</h3>
          <p className="stat-number">{stats.pendentes ?? 0}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
          <Award size={24} />
        </div>
        <div className="stat-info">
          <h3>Progresso</h3>
          <p className="stat-number">{stats.progressoPorcentagem ?? 0}%</p>
        </div>
      </div>
    </div>
  );
}
