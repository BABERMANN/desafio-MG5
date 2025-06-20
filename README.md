# Desafio Magi5 - Gerenciamento de Estoque de Bebidas

Este projeto é a implementação de um sistema ERP simplificado para o gerenciamento de um estoque de bebidas, desenvolvido como parte do desafio técnico para a vaga de Desenvolvedor PHP na Magi5.

A aplicação consiste em uma API RESTful em PHP no backend e uma interface reativa e moderna em React no frontend.

## Tecnologias Utilizadas

* **Backend:** PHP 8+, FlightPHP (microframework), Composer.
* **Frontend:** React 18+, Vite, JavaScript (ES6+), CSS3.
* **Banco de Dados:** MySQL.
* **Ambiente:** XAMPP, Node.js.

## Como Executar o Projeto

Para rodar a aplicação localmente, siga os passos abaixo:

**Pré-requisitos:**
* Ter o XAMPP (ou similar) com Apache e MySQL ativos.
* Ter o PHP e o Composer instalados globalmente.
* Ter o Node.js (versão 18 ou superior) e o `npm` instalados.

**Passos:**

1.  **Banco de Dados:**
    * Inicie os serviços do Apache e MySQL no seu painel XAMPP.
    * Crie um novo banco de dados no phpMyAdmin com o nome `estoque_bebidas`.
    * Importe o arquivo `backend/banco.sql` para dentro desse banco de dados para criar as tabelas necessárias.

2.  **Backend (API):**
    * Abra um terminal.
    * Navegue até a pasta do backend: `cd caminho/para/o/projeto/backend`.
    * Instale as dependências do PHP: `composer install`.
    * Inicie o servidor da API: `php -S localhost:8000`.
    * **Deixe este terminal rodando.**

3.  **Frontend (Interface):**
    * Abra **outro** terminal.
    * Navegue até a pasta do frontend: `cd caminho/para/o/projeto/frontend`.
    * Instale as dependências do Node.js: `npm install`.
    * Inicie o servidor de desenvolvimento: `npm run dev`.
    * **Deixe este terminal rodando.**

4.  **Acesse a Aplicação:**
    * Abra seu navegador e acesse o endereço fornecido pelo Vite (geralmente `http://localhost:5173`).

---

## Feedback sobre o Desafio

### 1. O que achei do desafio?

Achei o desafio excelente, muito bem estruturado e completo. Ele consegue avaliar de forma eficaz as habilidades essenciais de um desenvolvedor full-stack, desde a configuração do ambiente até a criação de uma API robusta e uma interface de usuário funcional.

O grau de dificuldade é intermediário, pois envolve não apenas a implementação das features, mas também a resolução de problemas de integração entre frontend e backend, gerenciamento de dependências e a aplicação de regras de negócio específicas.

### 2. Principais Desafios Encontrados

Durante o desenvolvimento, enfrentei alguns desafios que foram ótimas oportunidades de aprendizado:

* **Configuração do Ambiente Backend:** Um dos primeiros grandes desafios foi garantir que o backend com FlightPHP funcionasse corretamente. Lidei com erros de `404 Not Found` nas rotas, o que me levou a aprender sobre a configuração do Apache (`mod_rewrite`) e a importância do `.htaccess`. Em seguida, enfrentei problemas com o Composer para instalar as dependências, o que reforçou a importância de entender como o `autoload.php` funciona para carregar o framework.

* **Refatoração e Arquitetura do Frontend (Context API):** Percebi que o componente `App.jsx` estava crescendo muito, acumulando toda a lógica de estado. Decidi então refatorar toda a aplicação para usar a Context API do React. Criei um `BebidasContext` centralizado para gerenciar o estado, o que resultou em um código muito mais limpo, organizado e escalável, com componentes independentes que consomem apenas os dados de que precisam.

* **As Regras dos Hooks do React:** Encontrei o erro `Rendered more hooks than during the previous render`, que foi um ótimo aprendizado sobre como o React exige que os Hooks sejam chamados sempre na mesma ordem, e não dentro de condicionais que podem não ser executadas em todas as renderizações.

* **Validação e Experiência do Usuário:** Além da validação no backend, implementei checagens no frontend para regras de negócio, como o limite de capacidade do estoque. O desafio foi garantir que o usuário recebesse uma mensagem de erro clara e imediata, sem precisar esperar uma resposta do servidor, melhorando a usabilidade da aplicação.


