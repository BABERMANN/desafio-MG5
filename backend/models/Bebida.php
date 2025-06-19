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

        // Pega os dados a serem cadastrados
        $nome = $data['nome'];
        $tipo = $data['tipo'];
        $volume = $data['volume'];
        $secao = $data['secao'];

        // 1. Verificar se a seção já contém bebidas de outro tipo
        $existingTypeInSecao = self::getTipoBebidaNaSecao($secao);

        if ($existingTypeInSecao !== null && $existingTypeInSecao !== $tipo) {
            return ['status' => 'error', 'message' => 'Nao e permitido misturar bebidas de tipos diferentes (alcoolicas/nao-alcoolicas) na mesma secao.'];
        }

        // 2. Verificar espaço disponível na seção para o tipo
        if (!self::verificarEspaco($tipo, $volume)) {
            return ['status' => 'error', 'message' => 'Espaco insuficiente na secao para o volume desejado.'];
        }

        // Prepara e executa a inserção da nova bebida
        $stmt = $pdo->prepare("INSERT INTO bebidas (nome, tipo, volume, secao) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nome, $tipo, $volume, $secao]);

        // --- Registrar no histórico após o cadastro ---
        if ($stmt->rowCount() > 0) { // Verifica se a inserção foi bem-sucedida
            // Prepara os dados para o histórico. 'responsavel' hardcoded para este exemplo.
            self::registrarHistorico([
                'tipo' => $tipo,
                'volume' => $volume,
                'secao' => $secao,
                'responsavel' => 'Usuario API', // Valor padrão para responsável
                'acao' => 'Adicionado' // <--- NOVA INFORMAÇÃO: AÇÃO REALIZADA
            ]);
        }
        // --- FIM NOVO ---

        return ['status' => 'ok', 'id' => $pdo->lastInsertId()];
    }

    public static function atualizar($id, $data) {
        $pdo = Database::connect();

        // Pega os dados atuais da bebida antes de atualizar (para registro no histórico e validações)
        $stmtCurrent = $pdo->prepare("SELECT nome, tipo, volume, secao FROM bebidas WHERE id = ?");
        $stmtCurrent->execute([$id]);
        $currentBebida = $stmtCurrent->fetch(PDO::FETCH_ASSOC);

        if (!$currentBebida) {
            return ['status' => 'error', 'message' => 'Bebida nao encontrada para atualizacao.'];
        }

        // Usa os novos dados ou os dados atuais se não forem fornecidos
        $nome = $data['nome'] ?? $currentBebida['nome'];
        $tipo = $data['tipo'] ?? $currentBebida['tipo'];
        $volume = $data['volume'] ?? $currentBebida['volume'];
        $secao = $data['secao'] ?? $currentBebida['secao'];

        // ** VALIDAÇÃO: Regra de não misturar tipos de bebida na mesma seção **
        if ($secao !== $currentBebida['secao'] || $tipo !== $currentBebida['tipo']) {
            $existingTypeInNewSecao = self::getTipoBebidaNaSecao($secao);

            if ($existingTypeInNewSecao !== null && $existingTypeInNewSecao !== $tipo) {
                return ['status' => 'error', 'message' => 'Nao e permitido misturar bebidas de tipos diferentes (alcoolicas/nao-alcoolicas) na secao de destino.'];
            }
        }

        // ** VALIDAÇÃO: Verificar espaço ao atualizar volume **
        if ($volume > $currentBebida['volume']) { // Apenas se o volume aumentar
            $volumeDifference = $volume - $currentBebida['volume'];
            if (!self::verificarEspaco($tipo, $volumeDifference)) {
                return ['status' => 'error', 'message' => 'Espaco insuficiente na secao para o volume adicionado.'];
            }
        }

        // Prepara e executa a atualização da bebida
        $sql = "UPDATE bebidas SET nome = ?, tipo = ?, volume = ?, secao = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$nome, $tipo, $volume, $secao, $id]);

        // --- Registrar no histórico após a atualização ---
        if ($stmt->rowCount() > 0) {
            self::registrarHistorico([
                'tipo' => $tipo,
                'volume' => $volume,
                'secao' => $secao,
                'responsavel' => 'Usuario API', // Valor padrão para responsável
                'acao' => 'Atualizado' // <--- NOVA INFORMAÇÃO: AÇÃO REALIZADA
            ]);
        }
        // --- FIM NOVO ---

        return ['status' => 'ok', 'message' => 'Bebida atualizada com sucesso!'];
    }

    public static function remover($id) {
        $pdo = Database::connect();

        // Pega os dados da bebida ANTES de remover (para registrar no histórico)
        $stmtCurrent = $pdo->prepare("SELECT nome, tipo, volume, secao FROM bebidas WHERE id = ?");
        $stmtCurrent->execute([$id]);
        $currentBebida = $stmtCurrent->fetch(PDO::FETCH_ASSOC);

        if (!$currentBebida) {
            return ['status' => 'error', 'message' => 'Bebida nao encontrada para remocao.'];
        }

        // Executa a remoção da bebida
        $sql = "DELETE FROM bebidas WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);

        // --- Registrar no histórico após a remoção ---
        if ($stmt->rowCount() > 0) {
            self::registrarHistorico([
                'tipo' => $currentBebida['tipo'],
                'volume' => $currentBebida['volume'],
                'secao' => $currentBebida['secao'],
                'responsavel' => 'Usuario API', // Valor padrão para responsável
                'acao' => 'Removido' // <--- NOVA INFORMAÇÃO: AÇÃO REALIZADA
            ]);
        }
        // --- FIM NOVO ---

        if ($stmt->rowCount() > 0) {
            return ['status' => 'ok', 'message' => 'Bebida removida com sucesso!'];
        } else {
            return ['status' => 'error', 'message' => 'Bebida nao encontrada ou nao pode ser removida.'];
        }
    }

    // --- FUNÇÃO: Para verificar tipo existente na seção ---
    public static function getTipoBebidaNaSecao($secao) {
        $pdo = Database::connect();
        $stmt = $pdo->prepare("SELECT DISTINCT tipo FROM bebidas WHERE secao = ? LIMIT 1");
        $stmt->execute([$secao]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            return $row['tipo'];
        }
        return null;
    }

    // --- FUNÇÃO: Para calcular volume total por tipo ---
    public static function volumeTotal($tipo) {
        $pdo = Database::connect();
        $stmt = $pdo->prepare("SELECT SUM(volume) as total FROM bebidas WHERE tipo = ?");
        $stmt->execute([$tipo]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'] ?? 0;
    }

    // --- FUNÇÃO: Para verificar espaço disponível ---
    public static function verificarEspaco($tipo, $litros) {
        $total = self::volumeTotal($tipo);
        $limite = $tipo === 'alcolica' ? 500 : 400; // Limites definidos
        return ($total + $litros <= $limite);
    }

    // --- FUNÇÃO: Para listar o histórico ---
    public static function listarHistorico($params) {
        $pdo = Database::connect();
        $sql = "SELECT * FROM historico";
        $order = [];

        // Adiciona ordenação se os parâmetros forem fornecidos
        if (!empty($params['data'])) $order[] = "data " . strtoupper($params['data']);
        if (!empty($params['secao'])) $order[] = "secao " . strtoupper($params['secao']);
        if ($order) $sql .= " ORDER BY " . implode(", ", $order);

        return $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    // --- FUNÇÃO: Para registrar uma movimentação no histórico ---
    public static function registrarHistorico($data) {
        $pdo = Database::connect();
        // data DATETIME, tipo ENUM, volume FLOAT, secao VARCHAR, responsavel VARCHAR, acao VARCHAR
        $stmt = $pdo->prepare("INSERT INTO historico (data, tipo, volume, secao, responsavel, acao) VALUES (NOW(), ?, ?, ?, ?, ?)");
        $stmt->execute([$data['tipo'], $data['volume'], $data['secao'], $data['responsavel'], $data['acao']]);
        return ['status' => 'registrado']; // Retorna apenas um status
    }
}
