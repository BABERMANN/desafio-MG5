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

        // --- NOVA LÓGICA DE VERIFICAÇÃO DE SEÇÃO ---
        $nome = $data['nome'];
        $tipo = $data['tipo'];
        $volume = $data['volume'];
        $secao = $data['secao'];

        // 1. Verificar se a seção já contém bebidas de outro tipo
        $existingTypeInSecao = self::getTipoBebidaNaSecao($secao);

        if ($existingTypeInSecao !== null && $existingTypeInSecao !== $tipo) {
            // A seção já tem um tipo diferente de bebida, então não pode misturar
            return ['status' => 'error', 'message' => 'Nao e permitido misturar bebidas de tipos diferentes (alcoolicas/nao-alcoolicas) na mesma secao.'];
        }

        // 2. Verificar espaço disponível na seção para o tipo
        if (!self::verificarEspaco($tipo, $volume)) {
            return ['status' => 'error', 'message' => 'Espaco insuficiente na secao para o volume desejado.'];
        }
        // --- FIM DA NOVA LÓGICA DE VERIFICAÇÃO DE SEÇÃO ---


        $stmt = $pdo->prepare("INSERT INTO bebidas (nome, tipo, volume, secao) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nome, $tipo, $volume, $secao]); // Usar as variáveis definidas acima
        return ['status' => 'ok', 'id' => $pdo->lastInsertId()];
    }

    // --- NOVA FUNÇÃO ADICIONADA: PARA VERIFICAR TIPO EXISTENTE NA SEÇÃO ---
    public static function getTipoBebidaNaSecao($secao) {
        $pdo = Database::connect();
        // Busca um registro na seção para ver qual tipo de bebida já existe nela
        $stmt = $pdo->prepare("SELECT DISTINCT tipo FROM bebidas WHERE secao = ? LIMIT 1");
        $stmt->execute([$secao]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            return $row['tipo']; // Retorna o tipo existente (alcolica ou nao_alcolica)
        }
        return null; // A seção está vazia ou não existe
    }
    // --- FIM DA NOVA FUNÇÃO ---

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
    // Dentro da classe Bebida em models/Bebida.php
public static function remover($id) {
    $pdo = Database::connect();
    $sql = "DELETE FROM bebidas WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);

    // Verifica se alguma linha foi afetada (se a bebida foi realmente removida)
    if ($stmt->rowCount() > 0) {
        return ['status' => 'ok', 'message' => 'Bebida removida com sucesso!'];
    } else {
        return ['status' => 'error', 'message' => 'Bebida nao encontrada ou nao pode ser removida.'];
    }
}
}