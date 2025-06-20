import React from 'react';
import { useBebidas } from './context/BebidasContext';

// Este componente mostra a lista de bebidas, agrupada por seção.
function BebidaList() {
    // Pega as informações e funções necessárias direto do nosso contexto.
    const { bebidas, handleEditClick, handleDeleteClick } = useBebidas();

    // Uma pequena lógica para organizar as bebidas em grupos por seção.
    const bebidasPorSecao = bebidas.reduce((acc, bebida) => {
        if (!acc[bebida.secao]) {
            acc[bebida.secao] = [];
        }
        acc[bebida.secao].push(bebida);
        return acc;
    }, {});
    
    // Pega os nomes das seções e ordena em ordem alfabética.
    const secoesOrdenadas = Object.keys(bebidasPorSecao).sort();

    return (
        <section style={{ marginBottom: '40px' }}>
            <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px', color: '#61dafb' }}>Lista de Bebidas por Seção</h2>
            
            {secoesOrdenadas.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Nenhuma bebida cadastrada.</p>
            ) : (
                <div>
                    {secoesOrdenadas.map(secao => (
                        <div key={secao} style={{ marginBottom: '25px', padding: '15px', border: '1px solid #555', borderRadius: '8px', backgroundColor: '#3a3f47' }}>
                            <h3 style={{ color: '#88aaff', borderBottom: '1px solid #666', paddingBottom: '8px', marginBottom: '15px' }}>Seção: {secao}</h3>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {bebidasPorSecao[secao].map(bebida => (
                                    <li key={bebida.id} style={{ backgroundColor: '#444', padding: '10px 15px', marginBottom: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>
                                            <strong>{bebida.nome}</strong> - {bebida.volume}L ({bebida.tipo})
                                        </span>
                                        <div>
                                            <button onClick={() => handleEditClick(bebida)} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9em', marginRight: '5px' }}>
                                                Editar
                                            </button>
                                            <button onClick={() => handleDeleteClick(bebida.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9em' }}>
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