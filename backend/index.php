<?php
require 'flight/Flight.php';
require 'config.php';
require 'controllers/BebidaController.php';

Flight::route('GET /', function(){
    echo 'API Desafio MG5 rodando!';
});

Flight::route('GET /bebidas', ['BebidaController', 'listar']);
Flight::route('POST /bebidas', ['BebidaController', 'cadastrar']);
Flight::route('GET /volume/@tipo', ['BebidaController', 'volumeTotal']);
Flight::route('GET /disponivel/@tipo/@litros', ['BebidaController', 'verificarEspaco']);
Flight::route('GET /historico', ['BebidaController', 'listarHistorico']);
Flight::route('POST /historico', ['BebidaController', 'registrarHistorico']);

Flight::start();
