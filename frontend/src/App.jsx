import React, { useState, useEffect } from 'react';
import './App.css'; // Estilos globais para a aplicação

// Importa os componentes já criados
import BebidaList from './BebidaList';
import BebidaForm from './BebidaForm';
import HistoricoList from './HistoricoList';

function App() {
    // Estados para a lista de bebidas
    const [bebidas, setBebidas] = useState([]);
    const [loadingBebidas, setLoadingBebidas] = useState(true);
    const [errorBebidas, setErrorBebidas] = useState(null);

    // Estados para o histórico
    const [historico, setHistorico] = useState([]);
    const [loadingHistorico, setLoadingHistorico] = useState(true);
    const [errorHistorico, setErrorHistorico] = useState(null);

    // Estado unificado para o formulário de cadastro/edição de bebidas
    const [formData, setFormData] = useState({
        id: null,
        nome: '',
        tipo: 'alcolica',
        volume: '',
        secao: ''
    });
    const [formStatus, setFormStatus] = useState(''); // Feedback para o usuário para operações de bebidas
    const [isEditing, setIsEditing] = useState(false);

    // --- NOVOS ESTADOS PARA O FORMULÁRIO DE HISTÓRICO MANUAL ---
    const [newHistoricoData, setNewHistoricoData] = useState({
        nome: '', // Campo para o nome da bebida no histórico manual
        tipo: 'alcolica',
        volume: '',
        secao: '',
        acao: 'Adicionada' // Valor padrão para a ação manual (simplificado)
    });
    const [newHistoricoFormStatus, setNewHistoricoFormStatus] = useState(''); // Feedback para o formulário de histórico
    // --- FIM DOS NOVOS ESTADOS ---

    // URL base da sua API PHP
    const API_BASE_URL = 'http://localhost:8000'; // <<--- VERIFIQUE E AJUSTE ESTA URL CONFORME SEU BACKEND!

    // Funções de fetch para bebidas e histórico
    const fetchBebidas = async () => {
        try {
            setLoadingBebidas(true);
            const response = await fetch(`${API_BASE_URL}/bebidas`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro HTTP! Status: ${response.status}`);
            }
            const data = await response.json();
            setBebidas(data);
        } catch (err) {
            setErrorBebidas(err.message);
        } finally {
            setLoadingBebidas(false);
        }
    };

    const fetchHistorico = async () => {
        try {
            setLoadingHistorico(true);
            const response = await fetch(`${API_BASE_URL}/historico`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro HTTP! Status: ${response.status}`);
            }
            const data = await response.json();
            setHistorico(data);
        } catch (err) {
            setErrorHistorico(err.message);
        } finally {
            setLoadingHistorico(false);
        }
    };

    // Lógicas de formulário de bebidas (handleInputChange, handleSubmit, handleEditClick, handleCancelEdit, handleDeleteClick)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus(isEditing ? 'Atualizando bebida...' : 'Cadastrando bebida...');
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${API_BASE_URL}/bebidas/${formData.id}` : `${API_BASE_URL}/bebidas`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (!response.ok) { throw new Error(result.message || `Erro HTTP! Status: ${response.status}`); }
            if (result.status === 'ok') {
                setFormStatus(isEditing ? 'Bebida atualizada com sucesso!' : 'Bebida cadastrada com sucesso!');
                setFormData({ id: null, nome: '', tipo: 'alcolica', volume: '', secao: '' });
                setIsEditing(false);
                fetchBebidas();
                fetchHistorico(); // Atualiza histórico após operação de bebida
            } else { setFormStatus(`Erro: ${result.message || 'Erro desconhecido'}`); }
        } catch (err) { setFormStatus(`Erro na requisição: ${err.message}`); }
    };

    const handleEditClick = (bebida) => {
        setFormData({ id: bebida.id, nome: bebida.nome, tipo: bebida.tipo, volume: bebida.volume, secao: bebida.secao });
        setIsEditing(true);
        setFormStatus('');
    };

    const handleCancelEdit = () => {
        setFormData({ id: null, nome: '', tipo: 'alcolica', volume: '', secao: '' });
        setIsEditing(false);
        setFormStatus('');
    };

    const handleDeleteClick = async (bebidaId) => {
        if (window.confirm('Tem certeza que deseja remover esta bebida permanentemente?')) {
            setFormStatus('Removendo bebida...');
            try {
                const response = await fetch(`${API_BASE_URL}/bebidas/${bebidaId}`, { method: 'DELETE' });
                const result = await response.json();
                if (!response.ok) { throw new Error(result.message || `Erro HTTP! Status: ${response.status}`); }
                if (result.status === 'ok') {
                    setFormStatus('Bebida removida com sucesso!');
                    fetchBebidas();
                    fetchHistorico(); // Atualiza histórico após exclusão de bebida
                } else { setFormStatus(`Erro ao remover: ${result.message || 'Erro desconhecido'}`); }
            } catch (err) { setFormStatus(`Erro na requisição de remoção: ${err.message}`); }
        }
    };

    // Lidar com a exclusão de uma movimentação do histórico
    const handleDeleteHistoricoClick = async (movimentoId) => {
        if (window.confirm('Tem certeza que deseja remover esta movimentação do histórico?')) {
            setNewHistoricoFormStatus('Removendo movimentação...');
            try {
                const response = await fetch(`${API_BASE_URL}/historico/${movimentoId}`, { method: 'DELETE' });
                const result = await response.json();

                if (!response.ok) { throw new Error(result.message || `Erro HTTP! Status: ${response.status}`); }
                if (result.status === 'ok') {
                    setNewHistoricoFormStatus('Movimentação removida com sucesso!');
                    fetchHistorico();
                } else { setNewHistoricoFormStatus(`Erro ao remover movimentação: ${result.message || 'Erro desconhecido'}`); }
            } catch (err) { setNewHistoricoFormStatus(`Erro na requisição de remoção do histórico: ${err.message}`); }
        }
    };

    // --- NOVAS FUNÇÕES PARA O FORMULÁRIO DE HISTÓRICO MANUAL ---
    const handleNewHistoricoInputChange = (e) => {
        const { name, value } = e.target;
        setNewHistoricoData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleNewHistoricoSubmit = async (e) => {
        e.preventDefault();
        setNewHistoricoFormStatus('Registrando movimentação...');

        // Prepara os dados para enviar, incluindo o responsável fixo
        const historicoToSend = {
            ...newHistoricoData,
            responsavel: 'Registro Manual' // Valor fixo para o responsável
        };

        try {
            const response = await fetch(`${API_BASE_URL}/historico`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(historicoToSend) // Envia os dados com o responsável fixo
            });

            const result = await response.json();

            if (!response.ok) { throw new Error(result.message || `Erro HTTP! Status: ${response.status}`); }
            if (result.status === 'registrado') { // Sua API retorna 'registrado' para sucesso no histórico
                setNewHistoricoFormStatus('Movimentação registrada com sucesso!');
                // Limpa formulário, ajustando a ação padrão para o novo conjunto de opções
                setNewHistoricoData({ nome: '', tipo: 'alcolica', volume: '', secao: '', acao: 'Adicionada' }); 
                fetchHistorico(); // Recarrega histórico
            } else { setNewHistoricoFormStatus(`Erro ao registrar: ${result.message || 'Erro desconhecido'}`); }
        } catch (err) { setNewHistoricoFormStatus(`Erro na requisição: ${err.message}`); }
    };
    // --- FIM DAS NOVAS FUNÇÕES ---


    useEffect(() => {
        fetchBebidas();
        fetchHistorico();
    }, []);

    if (loadingBebidas || loadingHistorico) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Carregando dados...</div>;
    }

    if (errorBebidas) {
        return <div style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>Erro ao carregar bebidas: {errorBebidas}</div>;
    }

    return (
        <div className="App" style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#282c34', color: '#f0f0f0' }}>
            <h1 style={{ textAlign: 'center', color: '#61dafb' }}>Gerenciamento de Bebidas</h1>

            {/* Renderiza o componente BebidaList */}
            <BebidaList
                bebidas={bebidas}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
            />

            {/* Renderiza o componente BebidaForm */}
            <BebidaForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isEditing={isEditing}
                handleCancelEdit={handleCancelEdit}
                formStatus={formStatus}
            />

            {/* Renderiza o componente HistoricoList, passando o handler de exclusão */}
            <HistoricoList
                historico={historico}
                loadingHistorico={loadingHistorico}
                errorHistorico={errorHistorico}
                handleDeleteHistoricoClick={handleDeleteHistoricoClick}
            />

            {/* --- NOVA SEÇÃO: FORMULÁRIO PARA ADICIONAR HISTÓRICO MANUALMENTE --- */}
            <section style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #444' }}>
                <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px', color: '#61dafb' }}>Adicionar Movimentação Manual ao Histórico</h2>
                <form onSubmit={handleNewHistoricoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label htmlFor="historicoNome" style={{ display: 'block', marginBottom: '5px' }}>Nome da Bebida:</label>
                        <input
                            type="text"
                            id="historicoNome"
                            name="nome"
                            value={newHistoricoData.nome}
                            onChange={handleNewHistoricoInputChange}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: '#f0f0f0' }}
                        />
                    </div>
                    <div>
                        <label htmlFor="historicoTipo" style={{ display: 'block', marginBottom: '5px' }}>Tipo:</label>
                        <select
                            id="historicoTipo"
                            name="tipo"
                            value={newHistoricoData.tipo}
                            onChange={handleNewHistoricoInputChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: '#f0f0f0' }}
                        >
                            <option value="alcolica">Alcoólica</option>
                            <option value="nao_alcolica">Não Alcoólica</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="historicoVolume" style={{ display: 'block', marginBottom: '5px' }}>Volume (L):</label>
                        <input
                            type="number"
                            id="historicoVolume"
                            name="volume"
                            value={newHistoricoData.volume}
                            onChange={handleNewHistoricoInputChange}
                            required
                            min="0"
                            step="0.01"
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: '#f0f0f0' }}
                        />
                    </div>
                    <div>
                        <label htmlFor="historicoSecao" style={{ display: 'block', marginBottom: '5px' }}>Seção:</label>
                        <input
                            type="text"
                            id="historicoSecao"
                            name="secao"
                            value={newHistoricoData.secao}
                            onChange={handleNewHistoricoInputChange}
                            required
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: '#f0f0f0' }}
                        />
                    </div>
                    <div>
                        <label htmlFor="historicoAcao" style={{ display: 'block', marginBottom: '5px' }}>Ação:</label>
                        <select
                            id="historicoAcao"
                            name="acao"
                            value={newHistoricoData.acao}
                            onChange={handleNewHistoricoInputChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: '#f0f0f0' }}
                        >
                            <option value="Adicionada">Adicionada</option>
                            <option value="Retirada">Retirada</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#17a2b8', // Cor diferente para o histórico manual
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '1em',
                                flexGrow: 1
                            }}
                        >
                            Registrar Movimentação
                        </button>
                    </div>
                </form>
                {newHistoricoFormStatus && <p style={{ textAlign: 'center', marginTop: '15px', fontWeight: 'bold', color: newHistoricoFormStatus.includes('sucesso') ? '#28a745' : '#dc3545' }}>{newHistoricoFormStatus}</p>}
            </section>
            {/* --- FIM DA NOVA SEÇÃO --- */}
        </div>
    );
}

export default App;
