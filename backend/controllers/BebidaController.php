<?php
require_once 'models/Bebida.php';

class BebidaController {
    public static function listar(): array { // Mudei para array, pois retorna array de dados
        $dados = Bebida::listar();
        Flight::json($dados);
        return []; // Retorno vazio apenas para satisfazer o tipo, Flight::json já envia a resposta
    }

    public static function cadastrar(): void { // Se ela apenas faz Flight::json e não retorna
        $data = Flight::request()->data->getData();
        $resultado = Bebida::cadastrar($data);
        Flight::json($resultado);
    }

    // --- FUNÇÃO ATUALIZAR COM TIPO DE RETORNO ADICIONADO ---
    public static function atualizar($id): void { // Adicione o ": void" aqui
        $data = Flight::request()->data->getData();
        $resultado = Bebida::atualizar($id, $data);
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

    public static function listarHistorico($params): void {
        $historico = Bebida::listarHistorico($params);
        Flight::json($historico);
    }

    public static function registrarHistorico(): void {
        $data = Flight::request()->data->getData();
        $resultado = Bebida::registrarHistorico($data);
        Flight::json($resultado);
    }
    // Dentro da classe BebidaController em controllers/BebidaController.php
public static function remover($id): void { // Adicione o ": void" para consistência de linter
    $resultado = Bebida::remover($id); // Passa o ID para o modelo
    Flight::json($resultado);
}
}