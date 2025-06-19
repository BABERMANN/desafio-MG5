import React from 'react';

// Componente funcional HistoricoList para exibir o histórico de movimentações
// Recebe 'historico', 'loadingHistorico', 'errorHistorico' e o NOVO 'handleDeleteHistoricoClick' como props
function HistoricoList({ historico, loadingHistorico, errorHistorico, handleDeleteHistoricoClick }) {
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
                            borderRadius: '5px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center' // Para alinhar o texto e o botão verticalmente
                        }}>
                            <span>
                                [{new Date(movimento.data).toLocaleString()}] - <strong>{movimento.volume}L</strong> de {movimento.tipo} na Seção: {movimento.secao} ({movimento.acao})
                            </span>
                            {/* NOVO BOTÃO: Remover Movimentação do Histórico */}
                            <div>
                                <button
                                    onClick={() => handleDeleteHistoricoClick(movimento.id)}
                                    style={{
                                        backgroundColor: '#dc3545', // Cor vermelha para exclusão
                                        color: 'white',
                                        border: 'none',
                                        padding: '5px 10px', // Um pouco menor que os botões de bebida
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '0.8em'
                                    }}
                                >
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
