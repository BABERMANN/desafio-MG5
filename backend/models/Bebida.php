<?php
require_once 'config.php';

class Bebida {
    public static function listar() {
        $pdo = Database::connect();
        $sql = "SELECT * FROM bebidas";
        return $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function cadastrar($data) {
        $pdo = Database::connect();
        $stmt = $pdo->prepare("INSERT INTO bebidas (nome, tipo, volume, secao) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['nome'], $data['tipo'], $data['volume'], $data['secao']]);
        return ['status' => 'ok', 'id' => $pdo->lastInsertId()];
    }

    public static function volumeTotal($tipo) {
        $pdo = Database::connect();
        $stmt = $pdo->prepare("SELECT SUM(volume) as total FROM bebidas WHERE tipo = ?");
        $stmt->execute([$tipo]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'] ?? 0;
    }

    public static function verificarEspaco($tipo, $litros) {
        $total = self::volumeTotal($tipo);
        $limite = $tipo === 'alcolica' ? 500 : 400;
        return ($total + $litros <= $limite);
    }

    public static function listarHistorico($params) {
        $pdo = Database::connect();
        $sql = "SELECT * FROM historico";
        $order = [];

        if (!empty($params['data'])) $order[] = "data " . strtoupper($params['data']);
        if (!empty($params['secao'])) $order[] = "secao " . strtoupper($params['secao']);
        if ($order) $sql .= " ORDER BY " . implode(", ", $order);

        return $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function registrarHistorico($data) {
        $pdo = Database::connect();
        $stmt = $pdo->prepare("INSERT INTO historico (data, tipo, volume, secao, responsavel) VALUES (NOW(), ?, ?, ?, ?)");
        $stmt->execute([$data['tipo'], $data['volume'], $data['secao'], $data['responsavel']]);
        return ['status' => 'registrado'];
    }
}
