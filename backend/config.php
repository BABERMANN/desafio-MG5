<?php
class Database {
    private static $host = 'localhost';
    private static $dbname = 'estoque_bebidas';
    private static $user = 'root';
    private static $pass = '';

    public static function connect() {
        try {
            return new PDO("mysql:host=" . self::$host . ";dbname=" . self::$dbname, self::$user, self::$pass);
        } catch (PDOException $e) {
            die("Erro na conexão: " . $e->getMessage());
        }
    }
}
