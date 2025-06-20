<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit9c51fa73cd2ffa78903a5f69c246e6c9
{
    public static $files = array (
        '4cdafd4a5191caf078235e7dd119fdaf' => __DIR__ . '/..' . '/flightphp/core/flight/autoload.php',
    );

    public static $prefixLengthsPsr4 = array (
        'L' => 
        array (
            'LightPHP\\' => 9,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'LightPHP\\' => 
        array (
            0 => __DIR__ . '/..' . '/lightphp/lightphp/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit9c51fa73cd2ffa78903a5f69c246e6c9::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit9c51fa73cd2ffa78903a5f69c246e6c9::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit9c51fa73cd2ffa78903a5f69c246e6c9::$classMap;

        }, null, ClassLoader::class);
    }
}
