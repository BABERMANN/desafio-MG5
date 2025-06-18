<?php
require_once 'models/Bebida.php';

class BebidaController {
    public static function listar() {
        $dados = Bebida::listar();
        Flight::json($dados);
    }

    public static function cadastrar() {
        $data = Flight::request()->data->getData();
        $resultado = Bebida::cadastrar($data);
        Flight::json($resultado);
    }

    public static function volumeTotal($tipo) {
        $volume = Bebida::volumeTotal($tipo);
        Flight::json(['volume_total' => $volume]);
    }

    public static function verificarEspaco($tipo, $litros) {
        $resultado = Bebida::verificarEspaco($tipo, $litros);
        Flight::json(['disponivel' => $resultado]);
    }

    public static function listarHistorico() {
        $params = Flight::request()->query;
        $historico = Bebida::listarHistorico($params);
        Flight::json($historico);
    }

    public static function registrarHistorico() {
        $data = Flight::request()->data->getData();
        $resultado = Bebida::registrarHistorico($data);
        Flight::json($resultado);
    }
}
