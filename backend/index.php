<?php

// Carrega o autoloader do Composer com caminho absoluto
require __DIR__ . '/vendor/autoload.php';

// Garanta que os caminhos abaixo estão corretos em relação a index.php
// Estas linhas são NECESSÁRIAS porque não configuramos PSR-4 para suas próprias classes
require 'config.php';
require 'controllers/BebidaController.php';


// Adicionar cabeçalhos CORS 
Flight::before('start', function(){
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit(0);
    }
});

// Rota para testar se o Flight está vivo
Flight::route('GET /', function(){
    echo 'API Desafio MG5 rodando!';
});

// Suas outras rotas
Flight::route('GET /bebidas', ['BebidaController', 'listar']);
Flight::route('POST /bebidas', ['BebidaController', 'cadastrar']);
Flight::GET('/volume/@tipo', ['BebidaController', 'volumeTotal']);
Flight::GET('/disponivel/@tipo/@litros', ['BebidaController', 'verificarEspaco']);
Flight::route('GET /historico', ['BebidaController', 'listarHistorico']);
Flight::route('POST /historico', ['BebidaController', 'registrarHistorico']);

Flight::start(); // Inicia o framework
?>
