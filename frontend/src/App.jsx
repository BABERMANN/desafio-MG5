import React, { useState, useEffect } from 'react';
import './App.css'; // Estilos globais para a aplicação

// Importa os novos componentes
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

    // Estado unificado para o formulário de cadastro/edição
    const [formData, setFormData] = useState({
        id: null,
        nome: '',
        tipo: 'alcolica',
        volume: '',
        secao: ''
    });
    const [formStatus, setFormStatus] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // URL base da sua API PHP (AJUSTE CONFORME SEU SETUP!)
    const API_BASE_URL = 'http://localhost:8000'; // OU 'http://localhost/desafio_mg5/backend'

    // Função assíncrona para buscar a lista de bebidas da API
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

    // Função para buscar o histórico da API
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

    // Lida com mudanças nos campos do formulário
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Lida com o envio do formulário (cadastro ou edição)
    const handleSubmit = async (e) => {
        e.preventDefault();

        setFormStatus(isEditing ? 'Atualizando bebida...' : 'Cadastrando bebida...');

        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${API_BASE_URL}/bebidas/${formData.id}` : `${API_BASE_URL}/bebidas`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `Erro HTTP! Status: ${response.status}`);
            }

            if (result.status === 'ok') {
                setFormStatus(isEditing ? 'Bebida atualizada com sucesso!' : 'Bebida cadastrada com sucesso!');
                setFormData({ id: null, nome: '', tipo: 'alcolica', volume: '', secao: '' });
                setIsEditing(false);
                fetchBebidas(); // Recarrega a lista de bebidas
                fetchHistorico(); // Recarrega o histórico
            } else {
                setFormStatus(`Erro: ${result.message || 'Erro desconhecido'}`);
            }

        } catch (err) {
            setFormStatus(`Erro na requisição: ${err.message}`);
        }
    };

    // Função para iniciar a edição de uma bebida
    const handleEditClick = (bebida) => {
        setFormData({
            id: bebida.id,
            nome: bebida.nome,
            tipo: bebida.tipo,
            volume: bebida.volume,
            secao: bebida.secao
        });
        setIsEditing(true);
        setFormStatus('');
    };

    // Função para cancelar o modo de edição
    const handleCancelEdit = () => {
        setFormData({ id: null, nome: '', tipo: 'alcolica', volume: '', secao: '' });
        setIsEditing(false);
        setFormStatus('');
    };

    // Lidar com a exclusão de uma bebida
    const handleDeleteClick = async (bebidaId) => {
        if (window.confirm('Tem certeza que deseja remover esta bebida?')) {
            setFormStatus('Removendo bebida...');
            try {
                const response = await fetch(`${API_BASE_URL}/bebidas/${bebidaId}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || `Erro HTTP! Status: ${response.status}`);
                }

                if (result.status === 'ok') {
                    setFormStatus('Bebida removida com sucesso!');
                    fetchBebidas(); // Recarrega a lista de bebidas
                    fetchHistorico(); // Recarrega o histórico
                } else {
                    setFormStatus(`Erro ao remover: ${result.message || 'Erro desconhecido'}`);
                }
            } catch (err) {
                setFormStatus(`Erro na requisição de remoção: ${err.message}`);
            }
        }
    };

    // useEffect para buscar as bebidas e o histórico quando o componente é montado
    useEffect(() => {
        fetchBebidas();
        fetchHistorico();
    }, []);

    // Exibição condicional de estados de carregamento e erro (para bebidas)
    if (loadingBebidas) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Carregando bebidas...</div>;
    }

    if (errorBebidas) {
        return <div style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>Erro ao carregar bebidas: {errorBebidas}</div>;
    }

    return (
        <div className="App" style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#282c34', color: '#f0f0f0' }}>
            <h1 style={{ textAlign: 'center', color: '#61dafb' }}>Gerenciamento de Bebidas</h1>

            {/* Renderiza o componente BebidaList, passando as props necessárias */}
            <BebidaList
                bebidas={bebidas}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
            />

            {/* Renderiza o componente BebidaForm, passando as props necessárias */}
            <BebidaForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isEditing={isEditing}
                handleCancelEdit={handleCancelEdit}
                formStatus={formStatus}
            />

            {/* Renderiza o componente HistoricoList, passando as props necessárias */}
            <HistoricoList
                historico={historico}
                loadingHistorico={loadingHistorico}
                errorHistorico={errorHistorico}
            />
        </div>
    );
}

export default App;
