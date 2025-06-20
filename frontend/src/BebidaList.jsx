import React from 'react';

// Componente funcional BebidaList para exibir a lista de bebidas
// Recebe 'bebidas', 'handleEditClick' e 'handleDeleteClick' como props
function BebidaList({ bebidas, handleEditClick, handleDeleteClick }) {

    // Lógica para agrupar as bebidas por seção
    const bebidasPorSecao = bebidas.reduce((acc, bebida) => {
        // Se a seção ainda não existe no acumulador, cria um array vazio para ela
        if (!acc[bebida.secao]) {
            acc[bebida.secao] = [];
        }
        // Adiciona a bebida à sua respectiva seção
        acc[bebida.secao].push(bebida);
        return acc;
    }, {}); // Inicia o acumulador como um objeto vazio

    // Transforma o objeto agrupado em um array de arrays para facilitar o mapeamento
    // Ex: [['A1', [bebida1, bebida2]], ['B1', [bebida3]]]
    const secoesOrdenadas = Object.keys(bebidasPorSecao).sort(); // Opcional: Ordenar as seções alfabeticamente

    return (
        <section style={{ marginBottom: '40px' }}>
            <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px', color: '#61dafb' }}>Lista de Bebidas por Seção</h2>
            
            {secoesOrdenadas.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Nenhuma bebida cadastrada.</p>
            ) : (
                <div> {/* Container para todas as seções */}
                    {secoesOrdenadas.map(secao => (
                        <div key={secao} style={{ marginBottom: '25px', padding: '15px', border: '1px solid #555', borderRadius: '8px', backgroundColor: '#3a3f47' }}>
                            <h3 style={{ color: '#88aaff', borderBottom: '1px solid #666', paddingBottom: '8px', marginBottom: '15px' }}>Seção: {secao}</h3>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {bebidasPorSecao[secao].map(bebida => (
                                    <li key={bebida.id} style={{
                                        backgroundColor: '#444',
                                        padding: '10px 15px',
                                        marginBottom: '10px',
                                        borderRadius: '5px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span>
                                            <strong>{bebida.nome}</strong> - {bebida.volume}L ({bebida.tipo})
                                        </span>
                                        <div>
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
                                                    marginRight: '5px'
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(bebida.id)}
                                                style={{
                                                    backgroundColor: '#dc3545',
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
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default BebidaList;