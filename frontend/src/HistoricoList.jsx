import React from 'react';

// Componente funcional HistoricoList para exibir o histórico de movimentações
// Recebe 'historico', 'loadingHistorico' e 'errorHistorico' como props
function HistoricoList({ historico, loadingHistorico, errorHistorico }) {
    return (
        <section style={{ marginTop: '40px' }}>
            <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px', color: '#61dafb' }}>Histórico de Movimentações</h2>
            {loadingHistorico ? (
                <p style={{ textAlign: 'center' }}>Carregando histórico...</p>
            ) : errorHistorico ? (
                <p style={{ textAlign: 'center', color: 'red' }}>Erro ao carregar histórico: {errorHistorico}</p>
            ) : historico.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Nenhuma movimentação no histórico.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {historico.map(movimento => (
                        <li key={movimento.id} style={{
                            backgroundColor: '#333',
                            padding: '10px 15px',
                            marginBottom: '10px',
                            borderRadius: '5px'
                        }}>
                            <span>
                                [{new Date(movimento.data).toLocaleString()}] - <strong>{movimento.volume}L</strong> de {movimento.tipo} na Seção: {movimento.secao} ({movimento.acao})
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default HistoricoList;
