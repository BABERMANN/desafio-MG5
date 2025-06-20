import React from 'react';
import { useBebidas } from './context/BebidasContext';

// A gente simplesmente remove a opção 'manual' da nossa lista de abas.
const tabs = [
    { key: 'lista', label: 'Lista de Bebidas' },
    { key: 'cadastro', label: 'Cadastrar/Editar' },
    { key: 'historico', label: 'Histórico' }
];

function Tabs() {
    // Pega só o que precisa do contexto: a aba ativa e a função pra trocar.
    const { activeTab, setActiveTab } = useBebidas();
    
    return (
        <nav className="tabs-nav">
            {tabs.map(tab => (
                <button
                    key={tab.key}
                    // Se a aba do botão for a mesma que está ativa, o CSS deixa ela com um estilo diferente.
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