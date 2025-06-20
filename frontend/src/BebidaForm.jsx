import React from 'react';

// Componente funcional BebidaForm para o formulário de cadastro/edição
// Recebe 'formData', 'handleInputChange', 'handleSubmit', 'isEditing',
// 'handleCancelEdit' e 'formStatus' como props
function BebidaForm({ formData, handleInputChange, handleSubmit, isEditing, handleCancelEdit, formStatus }) {
    return (
        <section>
            {/* O título e o texto do botão mudam dependendo do modo (cadastro/edição) */}
            <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px', color: '#61dafb' }}>
                {isEditing ? 'Editar Bebida' : 'Cadastrar Nova Bebida'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="nome" style={{ display: 'block', marginBottom: '5px' }}>Nome:</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: '#f0f0f0' }}
                    />
                </div>
                <div>
                    <label htmlFor="tipo" style={{ display: 'block', marginBottom: '5px' }}>Tipo:</label>
                    <select
                        id="tipo"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: '#f0f0f0' }}
                    >
                        <option value="alcolica">Alcoólica</option>
                        <option value="nao_alcolica">Não Alcoólica</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="volume" style={{ display: 'block', marginBottom: '5px' }}>Volume (L):</label>
                    <input
                        type="number"
                        id="volume"
                        name="volume"
                        value={formData.volume}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: '#f0f0f0' }}
                    />
                </div>
                <div>
                    <label htmlFor="secao" style={{ display: 'block', marginBottom: '5px' }}>Seção:</label>
                    <input
                        type="text"
                        id="secao"
                        name="secao"
                        value={formData.secao}
                        onChange={handleInputChange}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: '#f0f0f0' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '1em',
                            flexGrow: 1
                        }}
                    >
                        {isEditing ? 'Atualizar Bebida' : 'Cadastrar Bebida'}
                    </button>
                    {/* Botão "Cancelar Edição" aparece apenas no modo de edição */}
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '1em',
                                flexGrow: 1
                            }}
                        >
                            Cancelar Edição
                        </button>
                    )}
                </div>
            </form>
            {/* Exibe o status da operação (cadastro/edição) */}
            {formStatus && <p style={{ textAlign: 'center', marginTop: '15px', fontWeight: 'bold', color: formStatus.includes('sucesso') ? '#28a745' : '#dc3545' }}>{formStatus}</p>}
        </section>
    );
}

export default BebidaForm;