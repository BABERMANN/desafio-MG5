import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const BebidasContext = createContext();

export const BebidasProvider = ({ children }) => {
    // Estados da aplicação (sem a parte do formulário manual)
    const [bebidas, setBebidas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [formData, setFormData] = useState({ id: null, nome: '', tipo: 'alcolica', volume: '', secao: '', responsavel: '' });
    const [formStatus, setFormStatus] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('lista');
    const [volumeAlcoolicas, setVolumeAlcoolicas] = useState(0);
    const [volumeNaoAlcoolicas, setVolumeNaoAlcoolicas] = useState(0);
    const [historicoOrder, setHistoricoOrder] = useState({ data: 'desc', secao: '' });

    const API_BASE_URL = 'http://localhost:8000';

    const fetchVolumes = useCallback(async () => {
        try {
            const resAlcoolicas = await fetch(`${API_BASE_URL}/volume/alcolica`);
            const dataAlcoolicas = await resAlcoolicas.json();
            setVolumeAlcoolicas(dataAlcoolicas.volume_total || 0);
            const resNaoAlcoolicas = await fetch(`${API_BASE_URL}/volume/nao_alcolica`);
            const dataNaoAlcoolicas = await resNaoAlcoolicas.json();
            setVolumeNaoAlcoolicas(dataNaoAlcoolicas.volume_total || 0);
        } catch (error) { console.error("Erro ao buscar volumes:", error); }
    }, []);

    const fetchBebidas = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/bebidas`);
            if (!response.ok) { const errorText = await response.text(); throw new Error(errorText); }
            setBebidas(await response.json());
        } catch (err) { setError(err.message); }
    }, []);

    const fetchHistorico = useCallback(async () => {
        try {
            setError(null);
            let url = new URL(`${API_BASE_URL}/historico`);
            if (historicoOrder.data) url.searchParams.append('data', historicoOrder.data);
            if (historicoOrder.secao) url.searchParams.append('secao', historicoOrder.secao);
            const response = await fetch(url);
            if (!response.ok) { const errorText = await response.text(); throw new Error(errorText); }
            setHistorico(await response.json());
        } catch (err) { setError(err.message); }
    }, [historicoOrder]);

    const handleDataUpdate = useCallback(async () => {
        setLoading(true);
        setError(null);
        await Promise.all([ fetchBebidas(), fetchHistorico(), fetchVolumes() ]);
        setLoading(false);
    }, [fetchBebidas, fetchHistorico, fetchVolumes]);

    useEffect(() => { handleDataUpdate(); }, [handleDataUpdate]);
    useEffect(() => { fetchHistorico(); }, [fetchHistorico]);
    
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const limite = formData.tipo === 'alcolica' ? 500 : 400;
        const volumeAtual = formData.tipo === 'alcolica' ? volumeAlcoolicas : volumeNaoAlcoolicas;
        const volumeEntrada = parseFloat(formData.volume);
        let volumeParaAdicionar = isEditing ? volumeEntrada - parseFloat(bebidas.find(b => b.id === formData.id)?.volume || 0) : volumeEntrada;
        if (volumeParaAdicionar > 0 && (volumeAtual + volumeParaAdicionar) > limite) {
            setFormStatus(`Erro: Volume excede a capacidade! Espaço disponível: ${(limite - volumeAtual).toFixed(2)}L`);
            return;
        }
        setFormStatus(isEditing ? 'Atualizando...' : 'Cadastrando...');
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${API_BASE_URL}/bebidas/${formData.id}` : `${API_BASE_URL}/bebidas`;
        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            const result = await response.json();
            if (!response.ok) { throw new Error(result.message); }
            setFormStatus(isEditing ? 'Atualizado!' : 'Cadastrado!');
            setFormData({ id: null, nome: '', tipo: 'alcolica', volume: '', secao: '', responsavel: '' });
            setIsEditing(false);
            handleDataUpdate();
            setActiveTab('lista');
        } catch (err) { setFormStatus(`Erro: ${err.message}`); }
    }, [formData, isEditing, bebidas, volumeAlcoolicas, volumeNaoAlcoolicas, handleDataUpdate]);
    
    const handleEditClick = useCallback((bebida) => {
        setFormData({ id: bebida.id, nome: bebida.nome, tipo: bebida.tipo, volume: bebida.volume, secao: bebida.secao, responsavel: '' });
        setIsEditing(true);
        setFormStatus('');
        setActiveTab('cadastro');
    }, []);

    const handleCancelEdit = useCallback(() => {
        setFormData({ id: null, nome: '', tipo: 'alcolica', volume: '', secao: '', responsavel: '' });
        setIsEditing(false);
        setFormStatus('');
        setActiveTab('lista');
    }, []);

    const handleDeleteClick = useCallback(async (bebidaId) => {
        const responsavel = window.prompt("Digite o nome do responsável pela remoção:");
        if (responsavel && responsavel.trim() !== "") {
            try {
                await fetch(`${API_BASE_URL}/bebidas/${bebidaId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ responsavel: responsavel })
                });
                handleDataUpdate();
            } catch (err) {
                setFormStatus(`Erro ao remover: ${err.message}`);
            }
        } else {
            alert("O nome do responsável é obrigatório para remover.");
        }
    }, [handleDataUpdate]);

    const handleDeleteHistoricoClick = useCallback(async (movimentoId) => {
        if (window.confirm('Tem certeza?')) {
            try {
                await fetch(`${API_BASE_URL}/historico/${movimentoId}`, { method: 'DELETE' });
                fetchHistorico();
            } catch (err) { console.error("Erro:", err); }
        }
    }, [fetchHistorico]);
    
    const handleHistoricoOrderChange = useCallback((e) => {
        const { name, value } = e.target;
        if (name === 'data') setHistoricoOrder({ data: value, secao: '' });
        else setHistoricoOrder({ data: '', secao: value });
    }, []);

    const value = {
        bebidas, loading, error, historico, formData, setFormData, formStatus,
        isEditing, setIsEditing, activeTab, setActiveTab,
        volumeAlcoolicas, volumeNaoAlcoolicas, historicoOrder, setHistoricoOrder,
        handleDataUpdate, handleInputChange, handleSubmit, handleEditClick,
        handleCancelEdit, handleDeleteClick, handleDeleteHistoricoClick, handleHistoricoOrderChange,
    };

    return (
        <BebidasContext.Provider value={value}>
            {children}
        </BebidasContext.Provider>
    );
};

export const useBebidas = () => {
    return useContext(BebidasContext);
};