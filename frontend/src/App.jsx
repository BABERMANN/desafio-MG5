import React, { useState, useEffect } from 'react';
import './App.css'; // Mantenha ou remova se não for usar estilos globais

function App() {
    const [bebidas, setBebidas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para o formulário de nova bebida
    const [newBebida, setNewBebida] = useState({
        nome: '',
        tipo: 'alcolica', // Valor padrão
        volume: '',
        secao: ''
    });
    const [cadastroStatus, setCadastroStatus] = useState(''); // Feedback para o usuário

    // URL base da sua API PHP (AJUSTE CONFORME SEU SETUP!)
    const API_BASE_URL = 'http://localhost:8000'; // OU 'http://localhost/desafio_mg5/backend'

    // Função para buscar as bebidas da API
    const fetchBebidas = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/bebidas`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setBebidas(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Função para lidar com mudanças nos campos do formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBebida(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão de recarregar a página
        setCadastroStatus('Cadastrando...');
        try {
            const response = await fetch(`${API_BASE_URL}/bebidas`, {
                method: 'POST', // Método HTTP POST para cadastrar
                headers: {
                    'Content-Type': 'application/json' // Indicamos que estamos enviando JSON
                },
                body: JSON.stringify(newBebida) // Converte o objeto JavaScript para uma string JSON
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status === 'ok') {
                setCadastroStatus('Bebida cadastrada com sucesso!');
                setNewBebida({ nome: '', tipo: 'alcolica', volume: '', secao: '' }); // Limpa o formulário
                fetchBebidas(); // Recarrega a lista de bebidas para mostrar a nova
            } else {
                setCadastroStatus(`Erro ao cadastrar: ${result.message || 'Erro desconhecido'}`);
            }

        } catch (err) {
            setCadastroStatus(`Erro na requisição: ${err.message}`);
        }
    };


    // useEffect para chamar a função de busca quando o componente montar
    useEffect(() => {
        fetchBebidas();
    }, []);

    if (loading) {
        return <div>Carregando bebidas...</div>;
    }

    if (error) {
        return <div>Erro ao carregar bebidas: {error}</div>;
    }

    return (
        <div className="App">
            <h1>Gerenciamento de Bebidas</h1>

            <section>
                <h2>Lista de Bebidas</h2>
                {bebidas.length === 0 ? (
                    <p>Nenhuma bebida cadastrada.</p>
                ) : (
                    <ul>
                        {bebidas.map(bebida => (
                            <li key={bebida.id}>
                                {bebida.nome} - {bebida.volume}L ({bebida.tipo}) na Seção: {bebida.secao}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h2>Cadastrar Nova Bebida</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="nome">Nome:</label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={newBebida.nome}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="tipo">Tipo:</label>
                        <select
                            id="tipo"
                            name="tipo"
                            value={newBebida.tipo}
                            onChange={handleInputChange}
                        >
                            <option value="alcolica">Alcoólica</option>
                            <option value="nao_alcolica">Não Alcoólica</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="volume">Volume (L):</label>
                        <input
                            type="number"
                            id="volume"
                            name="volume"
                            value={newBebida.volume}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label htmlFor="secao">Seção:</label>
                        <input
                            type="text"
                            id="secao"
                            name="secao"
                            value={newBebida.secao}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit">Cadastrar Bebida</button>
                </form>
                {cadastroStatus && <p>{cadastroStatus}</p>} {/* Exibe o status do cadastro */}
            </section>

            <section>
                <h2>Histórico</h2>
                <p>Listagem de histórico virá aqui.</p>
            </section>
        </div>
    );
}

export default App;