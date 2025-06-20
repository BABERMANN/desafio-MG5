// frontend/src/VolumeInfo.jsx

import React from 'react';
import { useBebidas } from './context/BebidasContext'; // 1. Importa o hook

// Estilos para o componente
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'space-around',
        gap: '20px',
        padding: '15px',
        marginBottom: '30px',
        backgroundColor: '#3a3f47',
        borderRadius: '8px',
        border: '1px solid #555'
    },
    card: {
        textAlign: 'center',
        flex: 1
    },
    title: {
        margin: 0,
        fontSize: '1em',
        color: '#aaa',
        textTransform: 'uppercase'
    },
    volume: {
        margin: '5px 0 0 0',
        fontSize: '1.8em',
        fontWeight: 'bold',
        color: '#61dafb'
    },
    capacity: {
        margin: 0,
        fontSize: '0.9em',
        color: '#888'
    }
};

//  Removemos as props, pois o componente vai pegar os dados sozinho
function VolumeInfo() {
    //  Pega os volumes diretamente do nosso contexto
    const { volumeAlcoolicas, volumeNaoAlcoolicas } = useBebidas();

    return (
        <section style={styles.container}>
            <div style={styles.card}>
                <h3 style={styles.title}>Volume Alcoólicas</h3>
                <p style={styles.volume}>
                    
                    {Number(volumeAlcoolicas).toFixed(2)} L
                </p>
                <p style={styles.capacity}>de 500.00 L</p>
            </div>
            <div style={styles.card}>
                <h3 style={styles.title}>Volume Não Alcoólicas</h3>
                <p style={styles.volume}>
                    {Number(volumeNaoAlcoolicas).toFixed(2)} L
                </p>
                <p style={styles.capacity}>de 400.00 L</p>
            </div>
        </section>
    );
}

export default VolumeInfo;