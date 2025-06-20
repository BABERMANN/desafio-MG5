<?php
require_once 'config.php'; // Inclui a configuração do banco de dados

class Bebida {
    /**
     * Lista todas as bebidas do banco de dados.
     * @return array Um array de objetos de bebidas.
     */
    public static function listar() {
        $pdo = Database::connect();
        $sql = "SELECT * FROM bebidas";
        return $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Cadastra uma nova bebida no banco de dados.
     * Inclui validação para não misturar tipos de bebida na mesma seção e verifica espaço.
     * Registra a ação de "Adicionado" no histórico.
     * @param array $data Um array associativo com os dados da bebida (nome, tipo, volume, secao).
     * @return array O status da operação e o ID da nova bebida, ou uma mensagem de erro.
     */
    public static function cadastrar($data) {
        $pdo = Database::connect();

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

        $stmt = $pdo->prepare("INSERT INTO bebidas (nome, tipo, volume, secao) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nome, $tipo, $volume, $secao]);

        if ($stmt->rowCount() > 0) {
            self::registrarHistorico([
                'nome' => $nome,
                'tipo' => $tipo,
                'volume' => $volume,
                'secao' => $secao,
                'responsavel' => 'Usuario API',
                'acao' => 'Adicionado'
            ]);
        }

        return ['status' => 'ok', 'id' => $pdo->lastInsertId()];
    }

    /**
     * Atualiza uma bebida existente no banco de dados.
     * Inclui validação para não misturar tipos de bebida e verifica espaço ao aumentar volume.
     * Registra a ação de "Atualizado" no histórico.
     * @param int $id O ID da bebida a ser atualizada.
     * @param array $data Um array associativo com os dados da bebida a serem atualizados.
     * @return array O status da operação e uma mensagem.
     */
    public static function atualizar($id, $data) {
        $pdo = Database::connect();

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

        // VALIDAÇÃO: Regra de não misturar tipos de bebida na mesma seção
        if ($secao !== $currentBebida['secao'] || $tipo !== $currentBebida['tipo']) {
            $existingTypeInNewSecao = self::getTipoBebidaNaSecao($secao);
            if ($existingTypeInNewSecao !== null && $existingTypeInNewSecao !== $tipo) {
                return ['status' => 'error', 'message' => 'Nao e permitido misturar bebidas de tipos diferentes (alcoolicas/nao-alcoolicas) na secao de destino.'];
            }
        }

        // VALIDAÇÃO: Verificar espaço ao atualizar volume
        if ($volume > $currentBebida['volume']) { // Apenas se o volume aumentar
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
                'nome' => $nome,
                'tipo' => $tipo,
                'volume' => $volume,
                'secao' => $secao,
                'responsavel' => 'Usuario API',
                'acao' => 'Atualizado'
            ]);
        }

        return ['status' => 'ok', 'message' => 'Bebida atualizada com sucesso!'];
    }

    /**
     * Remove uma bebida do banco de dados pelo ID.
     * Registra a ação de "Removido" no histórico.
     * @param int $id O ID da bebida a ser removida.
     * @return array O status da operação e uma mensagem.
     */
    public static function remover($id) {
        $pdo = Database::connect();

        // Pega os dados da bebida ANTES de remover para registrar no histórico
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
                'nome' => $currentBebida['nome'],
                'tipo' => $currentBebida['tipo'],
                'volume' => $currentBebida['volume'],
                'secao' => $currentBebida['secao'],
                'responsavel' => 'Usuario API',
                'acao' => 'Removido'
            ]);
        }

        if ($stmt->rowCount() > 0) {
            return ['status' => 'ok', 'message' => 'Bebida removida com sucesso!'];
        } else {
            return ['status' => 'error', 'message' => 'Bebida nao encontrada ou nao pode ser removida.'];
        }
    }

    /**
     * Retorna o tipo de bebida (alcolica/nao_alcolica) que já existe em uma dada seção.
     * @param string $secao A seção a ser verificada.
     * @return string|null O tipo de bebida existente ou null se a seção estiver vazia.
     */
    public static function getTipoBebidaNaSecao($secao) {
        $pdo = Database::connect();
        $stmt = $pdo->prepare("SELECT DISTINCT tipo FROM bebidas WHERE secao = ? LIMIT 1");
        $stmt->execute([$secao]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['tipo'] ?? null;
    }

    /**
     * Calcula o volume total de bebidas de um determinado tipo.
     * @param string $tipo O tipo de bebida (alcolica ou nao_alcolica).
     * @return float O volume total.
     */
    public static function volumeTotal($tipo) {
        $pdo = Database::connect();
        $stmt = $pdo->prepare("SELECT SUM(volume) as total FROM bebidas WHERE tipo = ?");
        $stmt->execute([$tipo]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'] ?? 0;
    }

    /**
     * Verifica se há espaço disponível para adicionar um determinado volume de um tipo de bebida.
     * @param string $tipo O tipo de bebida.
     * @param float $litros O volume a ser adicionado.
     * @return bool True se houver espaço, false caso contrário.
     */
    public static function verificarEspaco($tipo, $litros) {
        $total = self::volumeTotal($tipo);
        $limite = $tipo === 'alcolica' ? 500 : 400; // Limites definidos para cada tipo
        return ($total + $litros <= $limite);
    }

    /**
     * Lista o histórico de movimentações.
     * Pode ser ordenada por data ou secao.
     * @param array $params Parâmetros de ordenação (ex: ['data' => 'asc', 'secao' => 'desc']).
     * @return array Um array de objetos de histórico.
     */
    // backend/models/Bebida.php

    /**
     * Lista o histórico de movimentações, ordenado por seção como padrão.
     * @return array Um array de objetos de histórico.
     */
    public static function listarHistorico() { // REMOVIDO o parâmetro $params
        $pdo = Database::connect();
        // A cláusula ORDER BY agora é fixa e faz a ordenação natural
        $sql = "SELECT id, data, nome, tipo, volume, secao, responsavel, acao 
                FROM historico 
                ORDER BY
                    TRIM(TRAILING '0123456789' FROM secao) ASC,
                    CAST(TRIM(LEADING 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' FROM secao) AS UNSIGNED) ASC,
                    data ASC"; // Adicionado um segundo critério de ordenação por data

        return $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Registra uma nova movimentação no histórico.
     * **NOVO: Inclui validação de tipo de bebida por seção antes de registrar.**
     * @param array $data Um array associativo com os dados da movimentação (nome, tipo, volume, secao, responsavel, acao).
     * @return array O status da operação.
     */
    public static function registrarHistorico($data) {
        $pdo = Database::connect();

        $nome = $data['nome'] ?? 'Desconhecido'; // Garante que o nome exista, caso não venha
        $tipo = $data['tipo'];
        $volume = $data['volume'];
        $secao = $data['secao'];
        $responsavel = $data['responsavel'];
        $acao = $data['acao'];

        // --- NOVA VALIDAÇÃO: Nao permitir mistura de tipos de bebida na mesma secao para registro manual ---
        // Pega o tipo existente na seção no banco de dados 'bebidas'
        $existingTypeInSecao = self::getTipoBebidaNaSecao($secao);

        // Se a seção já tem bebidas E o tipo delas é diferente do que está sendo registrado
        // E o volume sendo registrado é maior que zero (para não bloquear registros de retirada em seção vazia)
        if ($existingTypeInSecao !== null && $existingTypeInSecao !== $tipo && $volume > 0) {
            return ['status' => 'error', 'message' => 'Nao e permitido misturar bebidas de tipos diferentes (alcoolicas/nao-alcoolicas) na secao.'];
        }
        // --- FIM DA NOVA VALIDAÇÃO ---


        // As colunas esperadas: data, nome, tipo, volume, secao, responsavel, acao
        $stmt = $pdo->prepare("INSERT INTO historico (data, nome, tipo, volume, secao, responsavel, acao) VALUES (NOW(), ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$nome, $tipo, $volume, $secao, $responsavel, $acao]);
        return ['status' => 'registrado'];
    }

    /**
     * Remove uma movimentação do histórico pelo ID.
     * @param int $id O ID da movimentação a ser removida.
     * @return array O status da operação e uma mensagem.
     */
    public static function removerHistorico($id) {
        $pdo = Database::connect();
        $sql = "DELETE FROM historico WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);

        if ($stmt->rowCount() > 0) {
            return ['status' => 'ok', 'message' => 'Movimentacao de historico removida com sucesso!'];
        } else {
            return ['status' => 'error', 'message' => 'Movimentacao de historico nao encontrada ou nao pode ser removida.'];
        }
    }
}
