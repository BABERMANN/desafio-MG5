
CREATE DATABASE IF NOT EXISTS estoque_bebidas;
USE estoque_bebidas;

CREATE TABLE IF NOT EXISTS bebidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    tipo ENUM('alcolica', 'nao_alcolica'),
    volume FLOAT,
    secao VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS historico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data DATETIME,
    tipo ENUM('alcolica', 'nao_alcolica'),
    volume FLOAT,
    secao VARCHAR(50),
    responsavel VARCHAR(100)
);

INSERT INTO bebidas (nome, tipo, volume, secao) VALUES 
('Cerveja', 'alcolica', 100, 'A1'),
('Refrigerante', 'nao_alcolica', 150, 'B1');

INSERT INTO historico (data, tipo, volume, secao, responsavel) VALUES 
(NOW(), 'alcolica', 100, 'A1', 'João'),
(NOW(), 'nao_alcolica', 150, 'B1', 'Maria');
