<?php
require_once 'models/Bebida.php';

// Este controller é o "maestro" da API.
class BebidaController {
    
    public static function listar(): void {
        $dados = Bebida::listar();
        Flight::json($dados);
    }

    public static function cadastrar(): void {
        $data = Flight::request()->data->getData();
        $resultado = Bebida::cadastrar($data);
        if (isset($resultado['status']) && $resultado['status'] === 'error') {
            Flight::json(['message' => $resultado['message']], 400);
        } else {
            Flight::json($resultado, 201);
        }
    }

    public static function atualizar($id): void {
        $data = Flight::request()->data->getData();
        $resultado = Bebida::atualizar($id, $data);
        if (isset($resultado['status']) && $resultado['status'] === 'error') {
            Flight::json(['message' => $resultado['message']], 400);
        } else {
            Flight::json($resultado);
        }
    }

    public static function remover($id): void {
        $data = Flight::request()->data->getData();
        $resultado = Bebida::remover($id, $data);
        Flight::json($resultado);
    }
    
    public static function volumeTotal($tipo): void {
        $volume = Bebida::volumeTotal($tipo);
        Flight::json(['volume_total' => $volume]);
    }

    public static function verificarEspaco($tipo, $litros): void {
        $resultado = Bebida::verificarEspaco($tipo, $litros);
        Flight::json(['disponivel' => $resultado]);
    }

    public static function listarHistorico(): void {
        $params = Flight::request()->query->getData();
        $historico = Bebida::listarHistorico($params);
        Flight::json($historico);
    }

    public static function removerHistorico($id): void {
        $resultado = Bebida::removerHistorico($id);
        Flight::json($resultado);
    }
}