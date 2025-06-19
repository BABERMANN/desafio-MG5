    import React, { useState, useEffect } from 'react';
    import './App.css'; // Estilos globais para a aplicação

    function App() {
        // Estados para a lista de bebidas
        const [bebidas, setBebidas] = useState([]);
        const [loading, setLoading] = useState(true); // Indica se os dados estão sendo carregados
        const [error, setError] = useState(null);   // Armazena mensagens de erro

        // Estado unificado para o formulário de cadastro/edição
        const [formData, setFormData] = useState({
            id: null, // Armazena o ID da bebida em edição, ou null para cadastro
            nome: '',
            tipo: 'alcolica', // Valor padrão para o tipo
            volume: '',
            secao: ''
        });
        const [formStatus, setFormStatus] = useState(''); // Mensagem de feedback para o usuário (sucesso/erro)
        const [isEditing, setIsEditing] = useState(false); // Flag para controlar se o formulário está no modo de edição

        // URL base da sua API PHP (AJUSTE CONFORME SEU SETUP!)
        const API_BASE_URL = 'http://localhost:8000'; // <<--- VERIFIQUE E AJUSTE ESTA URL CONFORME SEU BACKEND!

        // Função assíncrona para buscar a lista de bebidas da API
        const fetchBebidas = async () => {
            try {
                setLoading(true); // Ativa o estado de carregamento
                const response = await fetch(`${API_BASE_URL}/bebidas`); // Faz a requisição GET para a rota /bebidas
                
                // Verifica se a resposta HTTP foi bem-sucedida (status 2xx)
                if (!response.ok) {
                    const errorData = await response.json(); // Tenta ler a mensagem de erro do corpo
                    throw new Error(errorData.message || `Erro HTTP! Status: ${response.status}`);
                }
                
                const data = await response.json(); // Converte a resposta para JSON
                setBebidas(data); // Atualiza o estado com as bebidas recebidas
            } catch (err) {
                setError(err.message); // Captura e exibe erros de requisição
            } finally {
                setLoading(false); // Desativa o estado de carregamento
            }
        };

        // Lida com as mudanças nos campos do formulário (nome, tipo, volume, secao)
        const handleInputChange = (e) => {
            const { name, value } = e.target; // Pega o nome do campo e o valor
            setFormData(prevState => ({
                ...prevState, // Mantém os outros campos do formulado inalterados
                [name]: value // Atualiza o campo específico que mudou
            }));
        };

        // Lida com o envio do formulário (funciona tanto para cadastro quanto para edição)
        const handleSubmit = async (e) => {
            e.preventDefault(); // Previne o comportamento padrão do formulário (recarregar a página)

            setFormStatus(isEditing ? 'Atualizando bebida...' : 'Cadastrando bebida...'); // Mensagem de status inicial

            // Define o método HTTP e a URL com base no modo (edição ou cadastro)
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `${API_BASE_URL}/bebidas/${formData.id}` : `${API_BASE_URL}/bebidas`;

            try {
                const response = await fetch(url, {
                    method: method, // Método HTTP (POST ou PUT)
                    headers: {
                        'Content-Type': 'application/json' // Indica que o corpo da requisição é JSON
                    },
                    body: JSON.stringify(formData) // Converte os dados do formulário para string JSON
                });

                const result = await response.json(); // Pega a resposta da API (JSON)

                // Se a resposta HTTP não foi bem-sucedida (ex: 400, 500), lança um erro
                if (!response.ok) {
                    throw new Error(result.message || `Erro HTTP! Status: ${response.status}`);
                }

                // Se a API retornou status 'ok' (sucesso na operação)
                if (result.status === 'ok') {
                    setFormStatus(isEditing ? 'Bebida atualizada com sucesso!' : 'Bebida cadastrada com sucesso!');
                    
                    // Reseta o formulário para seus valores iniciais
                    setFormData({ id: null, nome: '', tipo: 'alcolica', volume: '', secao: '' });
                    setIsEditing(false); // Volta para o modo de cadastro
                    fetchBebidas(); // Recarrega a lista de bebidas para mostrar as alterações
                } else {
                    // Se a API retornou { status: 'error', message: '...' }
                    setFormStatus(`Erro: ${result.message || 'Erro desconhecido'}`);
                }

            } catch (err) {
                // Captura erros de rede ou erros lançados pelo 'throw new Error'
                setFormStatus(`Erro na requisição: ${err.message}`);
            }
        };

        // Função chamada quando o botão "Editar" de uma bebida na lista é clicado
        const handleEditClick = (bebida) => {
            // Preenche o formulário com os dados da bebida selecionada
            setFormData({
                id: bebida.id,
                nome: bebida.nome,
                tipo: bebida.tipo,
                volume: bebida.volume,
                secao: bebida.secao
            });
            setIsEditing(true); // Ativa o modo de edição do formulário
            setFormStatus(''); // Limpa qualquer mensagem de status anterior
        };

        // Função para cancelar o modo de edição (limpa o formulário e volta para cadastro)
        const handleCancelEdit = () => {
            setFormData({ id: null, nome: '', tipo: 'alcolica', volume: '', secao: '' });
            setIsEditing(false);
            setFormStatus('');
        };

        // --- NOVA FUNÇÃO: Lidar com a exclusão de uma bebida ---
        const handleDeleteClick = async (bebidaId) => {
            // Pede confirmação ao usuário antes de excluir
            if (window.confirm('Tem certeza que deseja remover esta bebida?')) {
                setFormStatus('Removendo bebida...');
                try {
                    const response = await fetch(`${API_BASE_URL}/bebidas/${bebidaId}`, {
                        method: 'DELETE' // Método HTTP DELETE para exclusão
                    });

                    const result = await response.json(); // Pega a resposta da API

                    if (!response.ok) {
                        throw new Error(result.message || `Erro HTTP! Status: ${response.status}`);
                    }

                    if (result.status === 'ok') {
                        setFormStatus('Bebida removida com sucesso!');
                        fetchBebidas(); // Recarrega a lista para refletir a exclusão
                    } else {
                        setFormStatus(`Erro ao remover: ${result.message || 'Erro desconhecido'}`);
                    }
                } catch (err) {
                    setFormStatus(`Erro na requisição de remoção: ${err.message}`);
                }
            }
        };
        // --- FIM DA NOVA FUNÇÃO ---

        // useEffect para buscar as bebidas quando o componente é montado pela primeira vez
        useEffect(() => {
            fetchBebidas();
        }, []); // O array vazio [] como dependência garante que esta função rode apenas uma vez

        // Exibição condicional de estados de carregamento e erro
        if (loading) {
            return <div style={{ textAlign: 'center', marginTop: '50px' }}>Carregando bebidas...</div>;
        }

        if (error) {
            return <div style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>Erro ao carregar bebidas: {error}</div>;
        }

        return (
            <div className="App" style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#282c34', color: '#f0f0f0' }}>
                <h1 style={{ textAlign: 'center', color: '#61dafb' }}>Gerenciamento de Bebidas</h1>

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
                                        {/* NOVO BOTÃO: "Remover" */}
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

                <section>
                    {/* Título do formulário muda entre 'Cadastrar' e 'Editar' */}
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

                <section style={{ marginTop: '40px' }}>
                    <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px', color: '#61dafb' }}>Histórico</h2>
                    <p style={{ textAlign: 'center' }}>Listagem de histórico virá aqui.</p>
                </section>
            </div>
        );
    }

    export default App;