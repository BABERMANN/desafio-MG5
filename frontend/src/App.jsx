import React from 'react';
import './App.css';
import { useBebidas } from './context/BebidasContext';

// Importando os "tijolos" da nossa página
import BebidaList from './BebidaList';
import BebidaForm from './BebidaForm';
import HistoricoList from './HistoricoList';
import Tabs from './Tabs';
import VolumeInfo from './VolumeInfo';

// Este é o componente principal, que monta a estrutura da página.
function App() {
    // A gente só pega o que o App realmente precisa pra funcionar.
    const { loading, error, activeTab } = useBebidas();

    // Se ainda estiver carregando os dados, mostra uma mensagem simples.
    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Carregando...</div>;
    }

    // Se deu algum erro feio ao carregar, avisa o usuário.
    if (error) {
        return <div style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>Erro: {error}</div>;
    }

    // Se tudo estiver certo, monta a página principal.
    return (
        <div className="App" style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#282c34', color: '#f0f0f0' }}>
            <img src="/logo.png" alt="Logo Magi5" className="app-logo" />

            <h1 style={{ textAlign: 'center', color: '#61dafb' }}>Gerenciamento de Bebidas</h1>
            
            <Tabs />
            
            <main>
                {activeTab === 'lista' && (
                    <>
                        <VolumeInfo />
                        <BebidaList />
                    </>
                )}

                {activeTab === 'cadastro' && (
                    <BebidaForm />
                )}

                {activeTab === 'historico' && (
                    <HistoricoList />
                )}
            </main>
        </div>
    );
}

export default App;