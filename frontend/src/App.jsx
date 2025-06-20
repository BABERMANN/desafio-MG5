// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import './App.css';

// Nossos componentes
import BebidaList from './BebidaList';
import BebidaForm from './BebidaForm';
import HistoricoList from './HistoricoList';
import Tabs from './Tabs'; // 1. Importando o novo componente de abas

function App() {
    // --- Estados da Aplicação (sem mudanças aqui) ---
    const [bebidas, setBebidas] = useState([]);
    const [loadingBebidas, setLoadingBebidas] = useState(true);
    const [errorBebidas, setErrorBebidas] = useState(null);

    const [historico, setHistorico] = useState([]);
    const [loadingHistorico, setLoadingHistorico] = useState(true);
    const [errorHistorico, setErrorHistorico] = useState(null);

    const [formData, setFormData] = useState({ id: null, nome: '', tipo: 'alcolica', volume: '', secao: '' });
    const [formStatus, setFormStatus] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const [newHistoricoData, setNewHistoricoData] = useState({ nome: '', tipo: 'alcolica', volume: '', secao: '', acao: 'Adicionada' });
    const [newHistoricoFormStatus, setNewHistoricoFormStatus] = useState('');
    
    // 2. Estado para controlar a aba ativa. Começamos na 'lista'.
    const [activeTab, setActiveTab] = useState('lista');

    const API_BASE_URL = 'http://localhost:8000';

    // --- Funções de Fetch e Lógica (a maioria sem mudanças) ---
    const fetchBebidas = async () => {
        try {
            setLoadingBebidas(true);
            const response = await fetch(`${API_BASE_URL}/bebidas`);
            if (!response.ok) { throw new Error((await response.json()).message); }
            setBebidas(await response.json());
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
            if (!response.ok) { throw new Error((await response.json()).message); }
            setHistorico(await response.json());
        } catch (err) {
            setErrorHistorico(err.message);
        } finally {
            setLoadingHistorico(false);
        }
    };

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

    // --- Funções de Manipulação de Dados ---
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
            const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            const result = await response.json();
            if (!response.ok) { throw new Error(result.message); }
            
            setFormStatus(isEditing ? 'Bebida atualizada com sucesso!' : 'Bebida cadastrada com sucesso!');
            setFormData({ id: null, nome: '', tipo: 'alcolica', volume: '', secao: '' });
            setIsEditing(false);
            fetchBebidas();
            fetchHistorico();
            setActiveTab('lista'); // Volta para a lista após cadastrar/editar
        } catch (err) {
            setFormStatus(`Erro: ${err.message}`);
        }
    };

    // 3. Função para trocar de aba ao clicar em "Editar"
    const handleEditClick = (bebida) => {
        setFormData({ id: bebida.id, nome: bebida.nome, tipo: bebida.tipo, volume: bebida.volume, secao: bebida.secao });
        setIsEditing(true);
        setFormStatus('');
        setActiveTab('cadastro'); // Muda para a aba de formulário
    };

    const handleCancelEdit = () => {
        setFormData({ id: null, nome: '', tipo: 'alcolica', volume: '', secao: '' });
        setIsEditing(false);
        setFormStatus('');
        setActiveTab('lista'); // Volta para a lista ao cancelar
    };

    const handleDeleteClick = async (bebidaId) => {
        if (window.confirm('Tem certeza?')) {
            setFormStatus('Removendo...');
            try {
                const response = await fetch(`${API_BASE_URL}/bebidas/${bebidaId}`, { method: 'DELETE' });
                if (!response.ok) { throw new Error((await response.json()).message); }
                setFormStatus('Bebida removida!');
                fetchBebidas();
                fetchHistorico();
            } catch (err) {
                setFormStatus(`Erro ao remover: ${err.message}`);
            }
        }
    };
    
    const handleDeleteHistoricoClick = async (movimentoId) => {
        if (window.confirm('Tem certeza?')) {
            try {
                await fetch(`${API_BASE_URL}/historico/${movimentoId}`, { method: 'DELETE' });
                fetchHistorico();
            } catch (err) {
                // Tratar erro se necessário
            }
        }
    };

    const handleNewHistoricoInputChange = (e) => {
        const { name, value } = e.target;
        setNewHistoricoData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleNewHistoricoSubmit = async (e) => {
        e.preventDefault();
        const historicoToSend = { ...newHistoricoData, responsavel: 'Registro Manual' };
        try {
            await fetch(`${API_BASE_URL}/historico`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(historicoToSend) });
            setNewHistoricoData({ nome: '', tipo: 'alcolica', volume: '', secao: '', acao: 'Adicionada' });
            fetchHistorico();
            setActiveTab('historico');
        } catch (err) {
            // Tratar erro
        }
    };

    return (
        <div className="App" style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#282c34', color: '#f0f0f0' }}>
            <h1 style={{ textAlign: 'center', color: '#61dafb' }}>Gerenciamento de Bebidas</h1>

            {/* 4. Renderiza o componente de abas */}
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* 5. Renderização condicional do conteúdo baseado na aba ativa */}
            <main>
                {activeTab === 'lista' && (
                    <BebidaList
                        bebidas={bebidas}
                        handleEditClick={handleEditClick}
                        handleDeleteClick={handleDeleteClick}
                    />
                )}

                {activeTab === 'cadastro' && (
                    <BebidaForm
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        isEditing={isEditing}
                        handleCancelEdit={handleCancelEdit}
                        formStatus={formStatus}
                    />
                )}

                {activeTab === 'historico' && (
                    <HistoricoList
                        historico={historico}
                        loadingHistorico={loadingHistorico}
                        errorHistorico={errorHistorico}
                        handleDeleteHistoricoClick={handleDeleteHistoricoClick}
                    />
                )}

                {activeTab === 'manual' && (
                    <section style={{ marginTop: '40px' }}>
                        <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px', color: '#61dafb' }}>Adicionar Movimentação Manual</h2>
                        <form onSubmit={handleNewHistoricoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                             {/* ... Inputs do formulário manual ... */}
                            <div>
                                <label htmlFor="historicoNome">Nome da Bebida:</label>
                                <input type="text" id="historicoNome" name="nome" value={newHistoricoData.nome} onChange={handleNewHistoricoInputChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: '#f0f0f0' }} />
                            </div>
                            <div>
                                <label htmlFor="historicoTipo">Tipo:</label>
                                <select id="historicoTipo" name="tipo" value={newHistoricoData.tipo} onChange={handleNewHistoricoInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: '#f0f0f0' }}>
                                    <option value="alcolica">Alcoólica</option>
                                    <option value="nao_alcolica">Não Alcoólica</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="historicoVolume">Volume (L):</label>
                                <input type="number" id="historicoVolume" name="volume" value={newHistoricoData.volume} onChange={handleNewHistoricoInputChange} required min="0" step="0.01" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: '#f0f0f0' }} />
                            </div>
                            <div>
                                <label htmlFor="historicoSecao">Seção:</label>
                                <input type="text" id="historicoSecao" name="secao" value={newHistoricoData.secao} onChange={handleNewHistoricoInputChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: '#f0f0f0' }} />
                            </div>
                            <div>
                                <label htmlFor="historicoAcao">Ação:</label>
                                <select id="historicoAcao" name="acao" value={newHistoricoData.acao} onChange={handleNewHistoricoInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: '#f0f0f0' }}>
                                    <option value="Adicionada">Adicionada</option>
                                    <option value="Retirada">Retirada</option>
                                </select>
                            </div>
                            <button type="submit" style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}>
                                Registrar Movimentação
                            </button>
                        </form>
                        {newHistoricoFormStatus && <p>{newHistoricoFormStatus}</p>}
                    </section>
                )}
            </main>
        </div>
    );
}

export default App;