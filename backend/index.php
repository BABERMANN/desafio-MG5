<?php
// ESSENCIAL: Carrega o autoloader do Composer com caminho absoluto
require __DIR__ . '/vendor/autoload.php';

// Garanta que os caminhos abaixo estão corretos em relação a index.php
require 'config.php';
require 'models/Bebida.php'; // Inclua o modelo Bebida aqui se não for auto-carregado
require 'controllers/BebidaController.php'; // Inclua o controller BebidaController

// Adicionar cabeçalhos CORS (muito importante para o frontend React)
Flight::before('start', function(){
    header("Access-Control-Allow-Origin: *"); // Permite requisições de qualquer origem (OK para desenvolvimento)
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Métodos HTTP permitidos
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"); // Cabeçalhos permitidos

    // Lida com as requisições OPTIONS (preflight requests do CORS)
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit(0); // Sai sem processar a requisição OPTIONS
    }
});

// Rota para a raiz da API (apenas para teste)
Flight::route('GET /', function(){
    echo 'API Desafio MG5 rodando!';
});

// Rota para listar todas as bebidas
Flight::route('GET /bebidas', ['BebidaController', 'listar']);

// Rota para cadastrar uma nova bebida
Flight::route('POST /bebidas', ['BebidaController', 'cadastrar']);

// Rota para atualizar uma bebida por ID (Método PUT)
Flight::route('PUT /bebidas/@id', ['BebidaController', 'atualizar']);

// NOVA ROTA: Para REMOVER uma bebida por ID (Método DELETE)
Flight::route('DELETE /bebidas/@id', ['BebidaController', 'remover']);

// Rota para volume total (GET /volume/tipo)
Flight::route('GET /volume/@tipo', ['BebidaController', 'volumeTotal']);

// Rota para verificar espaco (GET /disponivel/tipo/litros)
Flight::route('GET /disponivel/@tipo/@litros', ['BebidaController', 'verificarEspaco']);

// Rota para listar historico
Flight::route('GET /historico', ['BebidaController', 'listarHistorico']);

// Rota para registrar historico
Flight::route('POST /historico', ['BebidaController', 'registrarHistorico']);

// Inicia o framework FlightPHP para processar as rotas
Flight::start();
?>