// frontend/src/Tabs.jsx

import React from 'react';

// Os nomes das nossas abas
const tabs = [
    { key: 'lista', label: 'Lista de Bebidas' },
    { key: 'cadastro', label: 'Cadastrar/Editar Bebida' },
    { key: 'historico', label: 'Histórico' },
    { key: 'manual', label: 'Adicionar Manual' }
];

function Tabs({ activeTab, setActiveTab }) {
    return (
        <nav className="tabs-nav">
            {tabs.map(tab => (
                <button
                    key={tab.key}
                    // Aplica a classe 'active' se a aba for a que está ativa
                    className={activeTab === tab.key ? 'active' : ''}
                    onClick={() => setActiveTab(tab.key)}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
}

export default Tabs;