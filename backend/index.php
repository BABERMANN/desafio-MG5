<?php
// Mostra todos os erros, o que é ótimo para a fase de desenvolvimento.
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Carrega o autoloader do Composer, que se vira pra incluir as classes que a gente precisa.
require __DIR__ . '/vendor/autoload.php';

// Inclui nossos arquivos principais com a lógica da aplicação.
require_once 'config.php';
require_once 'models/Bebida.php';
require_once 'controllers/BebidaController.php';

// Configuração do CORS para o frontend poder conversar com a API.
Flight::before('start', function(){
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit(0);
    }
});

// --- Rotas da API ---
// Define os "caminhos" e qual função do controller cada um vai chamar.

Flight::route('GET /', function(){ echo 'API Desafio MG5 rodando!'; });

// Rotas para gerenciar as bebidas
Flight::route('GET /bebidas', ['BebidaController', 'listar']);
Flight::route('POST /bebidas', ['BebidaController', 'cadastrar']);
Flight::route('PUT /bebidas/@id', ['BebidaController', 'atualizar']);
Flight::route('DELETE /bebidas/@id', ['BebidaController', 'remover']);

// Rotas para o histórico
Flight::route('GET /historico', ['BebidaController', 'listarHistorico']);
Flight::route('DELETE /historico/@id', ['BebidaController', 'removerHistorico']);

// Rotas de consulta de informações
Flight::route('GET /volume/@tipo', ['BebidaController', 'volumeTotal']);
Flight::route('GET /disponivel/@tipo/@litros', ['BebidaController', 'verificarEspaco']);

// Inicia o FlightPHP para processar as requisições.
Flight::start();