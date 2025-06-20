<?php
require_once 'config.php';

// Este arquivo lida com toda a lógica de banco de dados para as bebidas.
class Bebida {
    // Busca todas as bebidas que estão no banco de dados.
    public static function listar() {
        $pdo = Database::connect();
        $sql = "SELECT * FROM bebidas";
        return $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    // Tenta cadastrar uma bebida nova, mas antes confere as regras do negócio.
    public static function cadastrar($data) {
        $pdo = Database::connect();
        $nome = $data['nome'];
        $tipo = $data['tipo'];
        $volume = $data['volume'];
        $secao = $data['secao'];

        // Checagem 1: não deixa misturar os tipos de bebida na mesma seção.
        $existingTypeInSecao = self::getTipoBebidaNaSecao($secao);
        if ($existingTypeInSecao !== null && $existingTypeInSecao !== $tipo) {
            return ['status' => 'error', 'message' => 'Nao e permitido misturar bebidas de tipos diferentes na mesma secao.'];
        }

        // Checagem 2: vê se o volume a ser adicionado ainda cabe no estoque.
        if (!self::verificarEspaco($tipo, $volume)) {
            return ['status' => 'error', 'message' => 'Espaco insuficiente na secao para o volume desejado.'];
        }

        $stmt = $pdo->prepare("INSERT INTO bebidas (nome, tipo, volume, secao) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nome, $tipo, $volume, $secao]);

        // Se deu tudo certo, registra a ação no histórico.
        if ($stmt->rowCount() > 0) {
            self::registrarHistorico([
                'nome' => $nome,
                'tipo' => $tipo,
                'volume' => $volume,
                'secao' => $secao,
                'responsavel' => $data['responsavel'] ?? 'Nao informado', // Pega o responsável do formulário
                'acao' => 'Adicionado'
            ]);
        }

        return ['status' => 'ok', 'id' => $pdo->lastInsertId()];
    }

    // Atualiza os dados de uma bebida que já existe, validando as mesmas regras.
    public static function atualizar($id, $data) {
        $pdo = Database::connect();
        $stmtCurrent = $pdo->prepare("SELECT nome, tipo, volume, secao FROM bebidas WHERE id = ?");
        $stmtCurrent->execute([$id]);
        $currentBebida = $stmtCurrent->fetch(PDO::FETCH_ASSOC);

        if (!$currentBebida) {
            return ['status' => 'error', 'message' => 'Bebida nao encontrada para atualizacao.'];
        }
        
        $nome = $data['nome'] ?? $currentBebida['nome'];
        $tipo = $data['tipo'] ?? $currentBebida['tipo'];
        $volume = $data['volume'] ?? $currentBebida['volume'];
        $secao = $data['secao'] ?? $currentBebida['secao'];

        if ($secao !== $currentBebida['secao'] || $tipo !== $currentBebida['tipo']) {
            $existingTypeInNewSecao = self::getTipoBebidaNaSecao($secao);
            if ($existingTypeInNewSecao !== null && $existingTypeInNewSecao !== $tipo) {
                return ['status' => 'error', 'message' => 'Nao e permitido misturar tipos de bebida na secao de destino.'];
            }
        }

        if ($volume > $currentBebida['volume']) {
            $volumeDifference = $volume - $currentBebida['volume'];
            if (!self::verificarEspaco($tipo, $volumeDifference)) {
                return ['status' => 'error', 'message' => 'Espaco insuficiente na secao para o volume adicionado.'];
            }
        }

        $sql = "UPDATE bebidas SET nome = ?, tipo = ?, volume = ?, secao = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$nome, $tipo, $volume, $secao, $id]);

        if ($stmt->rowCount() > 0) {
            self::registrarHistorico([
                'nome' => $nome, 'tipo' => $tipo, 'volume' => $volume,
                'secao' => $secao, 'responsavel' => $data['responsavel'] ?? 'Nao informado', 'acao' => 'Atualizado'
            ]);
        }

        return ['status' => 'ok', 'message' => 'Bebida atualizada com sucesso!'];
    }

    // Remove uma bebida do estoque.
    public static function remover($id, $data) {
        $pdo = Database::connect();
        // Pega os dados da bebida antes, para registrar a saída no histórico.
        $stmtCurrent = $pdo->prepare("SELECT nome, tipo, volume, secao FROM bebidas WHERE id = ?");
        $stmtCurrent->execute([$id]);
        $currentBebida = $stmtCurrent->fetch(PDO::FETCH_ASSOC);

        if (!$currentBebida) {
            return ['status' => 'error', 'message' => 'Bebida nao encontrada para remocao.'];
        }

        $sql = "DELETE FROM bebidas WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);

        if ($stmt->rowCount() > 0) {
            self::registrarHistorico([
                'nome' => $currentBebida['nome'], 'tipo' => $currentBebida['tipo'], 'volume' => $currentBebida['volume'],
                'secao' => $currentBebida['secao'], 'responsavel' => $data['responsavel'] ?? 'Nao informado', 'acao' => 'Removido'
            ]);
            return ['status' => 'ok', 'message' => 'Bebida removida com sucesso!'];
        }
        
        return ['status' => 'error', 'message' => 'Nao achei essa bebida para remover.'];
    }

    // Dá uma olhada na seção pra ver se já tem alguma bebida lá.
    public static function getTipoBebidaNaSecao($secao) {
        $pdo = Database::connect();
        $stmt = $pdo->prepare("SELECT DISTINCT tipo FROM bebidas WHERE secao = ? LIMIT 1");
        $stmt->execute([$secao]);
        return $stmt->fetch(PDO::FETCH_ASSOC)['tipo'] ?? null;
    }

    // Calcula o total de litros de um tipo de bebida.
    public static function volumeTotal($tipo) {
        $pdo = Database::connect();
        $stmt = $pdo->prepare("SELECT SUM(volume) as total FROM bebidas WHERE tipo = ?");
        $stmt->execute([$tipo]);
        return $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
    }

    // Confere se a quantidade de litros cabe no limite do estoque.
    public static function verificarEspaco($tipo, $litros) {
        $total = self::volumeTotal($tipo);
        $limite = $tipo === 'alcolica' ? 500 : 400;
        return ($total + $litros <= $limite);
    }

    // Busca o histórico de movimentações, aplicando ordenação se for pedido.
    public static function listarHistorico($params = []) {
        $pdo = Database::connect();
        $sql = "SELECT id, data, nome, tipo, volume, secao, responsavel, acao FROM historico";
        $orderParts = [];

        if (!empty($params['data']) && in_array(strtoupper($params['data']), ['ASC', 'DESC'])) {
            $orderParts[] = "data " . strtoupper($params['data']);
        }
        if (!empty($params['secao']) && in_array(strtoupper($params['secao']), ['ASC', 'DESC'])) {
            $direction = strtoupper($params['secao']);
            $orderParts[] = "TRIM(TRAILING '0123456789' FROM secao) {$direction}, CAST(TRIM(LEADING 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' FROM secao) AS UNSIGNED) {$direction}";
        }

        if (!empty($orderParts)) {
            $sql .= " ORDER BY " . implode(", ", $orderParts);
        } else {
            // Se não pedir nada, o padrão é pela data mais recente.
            $sql .= " ORDER BY data DESC";
        }

        return $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    // Salva uma nova ação na tabela de histórico.
    public static function registrarHistorico($data) {
        $pdo = Database::connect();
        $nome = $data['nome'] ?? 'Desconhecido';
        $tipo = $data['tipo'];
        $volume = $data['volume'];
        $secao = $data['secao'];
        $responsavel = $data['responsavel'];
        $acao = $data['acao'];

        $existingTypeInSecao = self::getTipoBebidaNaSecao($secao);
        if ($existingTypeInSecao !== null && $existingTypeInSecao !== $tipo && $volume > 0) {
            return ['status' => 'error', 'message' => 'Nao e permitido misturar bebidas de tipos diferentes na mesma secao.'];
        }

        $stmt = $pdo->prepare("INSERT INTO historico (data, nome, tipo, volume, secao, responsavel, acao) VALUES (NOW(), ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$nome, $tipo, $volume, $secao, $responsavel, $acao]);
        return ['status' => 'registrado'];
    }

    // Apaga um registro da tabela de histórico.
    public static function removerHistorico($id) {
        $pdo = Database::connect();
        $sql = "DELETE FROM historico WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);

        if ($stmt->rowCount() > 0) {
            return ['status' => 'ok', 'message' => 'Movimentacao de historico removida com sucesso!'];
        }
        
        return ['status' => 'error', 'message' => 'Movimentacao de historico nao encontrada.'];
    }
}