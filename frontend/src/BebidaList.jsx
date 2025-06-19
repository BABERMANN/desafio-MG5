import React from 'react';

// Componente funcional BebidaList para exibir a lista de bebidas
// Recebe 'bebidas', 'handleEditClick' e 'handleDeleteClick' como props
function BebidaList({ bebidas, handleEditClick, handleDeleteClick }) {
    return (
        <section style={{ marginBottom: '40px' }}>
            <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px', color: '#61dafb' }}>Lista de Bebidas</h2>
            {bebidas.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Nenhuma bebida cadastrada.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {bebidas.map(bebida => (
                        <li key={bebida.id} style={{
                            backgroundColor: '#333',
                            padding: '10px 15px',
                            marginBottom: '10px',
                            borderRadius: '5px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>
                                <strong>{bebida.nome}</strong> - {bebida.volume}L ({bebida.tipo}) na Seção: {bebida.secao}
                            </span>
                            <div> {/* Container para os botões de ação */}
                                {/* Botão "Editar" */}
                                <button
                                    onClick={() => handleEditClick(bebida)}
                                    style={{
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 12px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontSize: '0.9em',
                                        marginRight: '5px' // Espaçamento entre os botões
                                    }}
                                >
                                    Editar
                                </button>
                                {/* Botão "Remover" */}
                                <button
                                    onClick={() => handleDeleteClick(bebida.id)} // Passa o ID da bebida para a função de remoção
                                    style={{
                                        backgroundColor: '#dc3545', // Cor vermelha para exclusão
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 12px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontSize: '0.9em'
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

export default BebidaList;
