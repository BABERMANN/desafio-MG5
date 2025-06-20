import React from 'react';
import { useBebidas } from './context/BebidasContext';

// Mostra a lista de histórico e os botões pra ordenar.
function HistoricoList() {
    // Pega do contexto tudo que precisa pra funcionar.
    const { historico, loading, error, handleDeleteHistoricoClick, historicoOrder, handleHistoricoOrderChange } = useBebidas();

    return (
        <section style={{ marginTop: '40px' }}>
            <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px', color: '#61dafb' }}>Histórico de Movimentações</h2>
            
            {/* Controles de ordenação */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center' }}>
                <label htmlFor="orderByData" style={{ fontWeight: 'bold' }}>Ordenar por Data:</label>
                <select id="orderByData" name="data" value={historicoOrder.data} onChange={handleHistoricoOrderChange} style={{ padding: '5px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: '#f0f0f0' }}>
                    <option value="desc">Mais Recente</option>
                    <option value="asc">Mais Antigo</option>
                </select>
                <label htmlFor="orderBySecao" style={{ fontWeight: 'bold' }}>Ordenar por Seção:</label>
                <select id="orderBySecao" name="secao" value={historicoOrder.secao} onChange={handleHistoricoOrderChange} style={{ padding: '5px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: '#f0f0f0' }}>
                    <option value="">Nenhum</option>
                    <option value="asc">A-Z</option>
                    <option value="desc">Z-A</option>
                </select>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Carregando histórico...</p>
            ) : error ? (
                <p style={{ textAlign: 'center', color: 'red' }}>Erro ao carregar histórico: {error}</p>
            ) : historico.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Nenhuma movimentação no histórico.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {historico.map(movimento => (
                        <li key={movimento.id} style={{ backgroundColor: '#333', padding: '10px 15px', marginBottom: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          
                            <span>
                                [{new Date(movimento.data).toLocaleString()}] - <strong>{movimento.nome}</strong> ({movimento.volume}L de {movimento.tipo}) na Seção: {movimento.secao} ({movimento.acao}) por: <strong>{movimento.responsavel}</strong>
                            </span>
                            <div>
                                <button onClick={() => handleDeleteHistoricoClick(movimento.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}>
                                    Remover
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default HistoricoList;