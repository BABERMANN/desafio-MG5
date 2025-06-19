<?php
// Define o modo de relatório de erros para exibir todos os erros (útil para depuração)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ESSENCIAL: Carrega o autoloader do Composer com caminho absoluto
// Ele se encarrega de carregar automaticamente as classes do FlightPHP
require __DIR__ . '/vendor/autoload.php';

// Inclui os arquivos necessários para o funcionamento da aplicação
// Usar 'require_once' garante que o arquivo seja incluído apenas uma vez, evitando erros de declaração duplicada
require_once 'config.php';        // Inclui a classe Database
require_once 'models/Bebida.php'; // Inclui a classe Bebida (modelo de dados)
require_once 'controllers/BebidaController.php'; // Inclui a classe BebidaController (controlador das rotas)

// Adicionar cabeçalhos CORS (muito importante para permitir a comunicação com o frontend React)
Flight::before('start', function(){
    // Permite requisições de qualquer origem (em ambiente de desenvolvimento é seguro; em produção, restrinja a domínios específicos)
    header("Access-Control-Allow-Origin: *");
    // Define os métodos HTTP que são permitidos em requisições CORS
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    // Define os cabeçalhos HTTP que são permitidos em requisições CORS
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // Lida com as requisições "preflight" (OPTIONS) que o navegador faz antes de certas requisições (POST, PUT, DELETE)
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit(0); // Responde à requisição OPTIONS e encerra o script
    }
});

// --- Definição das Rotas da API usando FlightPHP ---

// Rota principal da API
Flight::route('GET /', function(){
    echo 'API Desafio MG5 rodando!';
});

// Rotas para o gerenciamento de Bebidas
Flight::route('GET /bebidas', ['BebidaController', 'listar']);       // Lista todas as bebidas
Flight::route('POST /bebidas', ['BebidaController', 'cadastrar']);     // Cadastra uma nova bebida
Flight::route('PUT /bebidas/@id', ['BebidaController', 'atualizar']);   // Atualiza uma bebida por ID
Flight::route('DELETE /bebidas/@id', ['BebidaController', 'remover']);    // Remove uma bebida por ID

// Rotas para o Histórico de Movimentações
Flight::route('GET /historico', ['BebidaController', 'listarHistorico']); // Lista o histórico
Flight::route('POST /historico', ['BebidaController', 'registrarHistorico']); // Registra uma movimentação no histórico
Flight::route('DELETE /historico/@id', ['BebidaController', 'removerHistorico']); // Remove uma movimentação do histórico por ID

// Rotas para informações de volume e espaço (se necessário no frontend)
Flight::route('GET /volume/@tipo', ['BebidaController', 'volumeTotal']); // Retorna o volume total de um tipo
Flight::route('GET /disponivel/@tipo/@litros', ['BebidaController', 'verificarEspaco']); // Verifica espaço disponível

// Inicia o framework FlightPHP para processar as requisições e rotas
Flight::start();
