const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.port === '5173' ? 'http://localhost:8080/api' : '/api');

// =================== EXPLORADOR DE ARQUIVOS ===================

export async function getDiscos() {
  const res = await fetch(`${API_BASE_URL}/explorador/discos`);
  if (!res.ok) throw new Error('Erro ao listar unidades de disco');
  return res.json();
}

export async function getConteudoPasta(caminho = '', filtro = 'TODOS', busca = '') {
  const params = new URLSearchParams();
  if (caminho) params.append('caminho', caminho);
  if (filtro) params.append('filtro', filtro);
  if (busca) params.append('busca', busca);

  const res = await fetch(`${API_BASE_URL}/explorador/conteudo?${params.toString()}`);
  if (!res.ok) throw new Error('Erro ao listar arquivos da pasta');
  return res.json();
}

export async function abrirArquivoNoWindows(caminho) {
  const res = await fetch(`${API_BASE_URL}/explorador/abrir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caminho }),
  });
  if (!res.ok) throw new Error('Erro ao solicitar abertura de arquivo');
  return res.json();
}

export async function abrirPastaNoExplorer(caminho) {
  const res = await fetch(`${API_BASE_URL}/explorador/abrir-explorer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caminho }),
  });
  if (!res.ok) throw new Error('Erro ao solicitar abertura no Explorer');
  return res.json();
}

// =================== GESTÃO DE AULAS ===================

export async function getAulas() {
  const res = await fetch(`${API_BASE_URL}/aulas`);
  if (!res.ok) throw new Error('Erro ao buscar aulas');
  return res.json();
}

export async function getResumoAulas() {
  const res = await fetch(`${API_BASE_URL}/aulas/resumo`);
  if (!res.ok) throw new Error('Erro ao buscar resumo das aulas');
  return res.json();
}

export async function criarAula(aula) {
  const res = await fetch(`${API_BASE_URL}/aulas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aula),
  });
  if (!res.ok) throw new Error('Erro ao cadastrar aula');
  return res.json();
}

export async function atualizarAula(id, dados) {
  const res = await fetch(`${API_BASE_URL}/aulas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error('Erro ao atualizar aula');
  return res.json();
}

export async function excluirAula(id) {
  const res = await fetch(`${API_BASE_URL}/aulas/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao excluir aula');
  return true;
}

export async function abrirAulaCompleta(id) {
  const res = await fetch(`${API_BASE_URL}/aulas/${id}/abrir-todos`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Erro ao disparar abertura dos arquivos da aula');
  return res.json();
}

export async function toggleConcluida(id) {
  const res = await fetch(`${API_BASE_URL}/aulas/${id}/toggle-concluida`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Erro ao alterar status de conclusão');
  return res.json();
}

export async function toggleFavorita(id) {
  const res = await fetch(`${API_BASE_URL}/aulas/${id}/toggle-favorita`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Erro ao favoritar aula');
  return res.json();
}

export async function salvarAnotacoes(id, anotacoes) {
  const res = await fetch(`${API_BASE_URL}/aulas/${id}/anotacoes`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ anotacoes }),
  });
  if (!res.ok) throw new Error('Erro ao salvar anotações');
  return res.json();
}

export function getStreamUrl(caminho) {
  return `${API_BASE_URL}/explorador/stream?caminho=${encodeURIComponent(caminho)}`;
}

export function getVisualizarUrl(caminho) {
  return `${API_BASE_URL}/explorador/visualizar?caminho=${encodeURIComponent(caminho)}`;
}

