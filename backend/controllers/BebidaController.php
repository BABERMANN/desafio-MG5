<?php
require_once 'models/Bebida.php';

class BebidaController {
    /**
     * Lista todas as bebidas.
     * Responde com um JSON da lista de bebidas.
     */
    public static function listar(): void {
        $dados = Bebida::listar();
        Flight::json($dados);
    }

    /**
     * Cadastra uma nova bebida.
     * Recebe dados via POST.
     * Responde com um JSON do resultado da operacao.
     */
    public static function cadastrar(): void {
        $data = Flight::request()->data->getData();
        $resultado = Bebida::cadastrar($data);
        Flight::json($resultado);
    }

    /**
     * Atualiza uma bebida existente.
     * Recebe o ID da bebida via URL e dados via PUT.
     * Responde com um JSON do resultado da operacao.
     * @param int $id ID da bebida a ser atualizada.
     */
    public static function atualizar($id): void {
        $data = Flight::request()->data->getData();
        $resultado = Bebida::atualizar($id, $data);
        Flight::json($resultado);
    }

    /**
     * Remove uma bebida.
     * Recebe o ID da bebida via DELETE.
     * Responde com um JSON do resultado da operacao.
     * @param int $id ID da bebida a ser removida.
     */
    public static function remover($id): void {
        $resultado = Bebida::remover($id);
        Flight::json($resultado);
    }

    /**
     * Retorna o volume total de bebidas de um tipo especifico.
     * @param string $tipo Tipo da bebida (alcolica ou nao_alcolica).
     * Responde com um JSON do volume total.
     */
    public static function volumeTotal($tipo): void {
        $volume = Bebida::volumeTotal($tipo);
        Flight::json(['volume_total' => $volume]);
    }

    /**
     * Verifica o espaco disponivel para um tipo e volume de bebida.
     * @param string $tipo Tipo da bebida.
     * @param float $litros Volume a ser verificado.
     * Responde com um JSON da disponibilidade.
     */
    public static function verificarEspaco($tipo, $litros): void {
        $resultado = Bebida::verificarEspaco($tipo, $litros);
        Flight::json(['disponivel' => $resultado]);
    }

    /**
     * Lista o historico de movimentacoes.
     * Recebe parametros de query string para ordenacao.
     * Responde com um JSON do historico.
     * @param array $params Parametros de ordenacao.
     */
    public static function listarHistorico($params = []): void { // Parametro opcional com valor padrao
        $historico = Bebida::listarHistorico($params);
        Flight::json($historico);
    }

    /**
     * Registra uma nova movimentacao no historico.
     * Recebe dados via POST.
     * Responde com um JSON do status do registro.
     */
    public static function registrarHistorico(): void {
        $data = Flight::request()->data->getData();
        $resultado = Bebida::registrarHistorico($data);
        Flight::json($resultado);
    }

    /**
     * Remove uma movimentacao do historico.
     * Recebe o ID da movimentacao via DELETE.
     * Responde com um JSON do resultado da operacao.
     * @param int $id ID da movimentacao a ser removida.
     */
    public static function removerHistorico($id): void {
        $resultado = Bebida::removerHistorico($id);
        Flight::json($resultado);
    }
}
