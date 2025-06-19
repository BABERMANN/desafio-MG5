<?php return array(
    'root' => array(
        'name' => 'usurio/backend',
        'pretty_version' => 'dev-main',
        'version' => 'dev-main',
        'reference' => 'dae20b534977bbf3abecf3af79b8f0a14a991982',
        'type' => 'project',
        'install_path' => __DIR__ . '/../../',
        'aliases' => array(),
        'dev' => true,
    ),
    'versions' => array(
        'flightphp/core' => array(
            'pretty_version' => 'dev-master',
            'version' => 'dev-master',
            'reference' => '5df28007533e825b8691d089e1df7509b9d131cf',
            'type' => 'library',
            'install_path' => __DIR__ . '/../flightphp/core',
            'aliases' => array(
                0 => '9999999-dev',
            ),
            'dev_requirement' => false,
        ),
        'lightphp/lightphp' => array(
            'pretty_version' => 'dev-master',
            'version' => 'dev-master',
            'reference' => '4506cbc4898f8efe428c8af1b68b37b2e40bcfe4',
            'type' => 'library',
            'install_path' => __DIR__ . '/../lightphp/lightphp',
            'aliases' => array(
                0 => '9999999-dev',
            ),
            'dev_requirement' => false,
        ),
        'mikecao/flight' => array(
            'dev_requirement' => false,
            'replaced' => array(
                0 => '2.0.2',
            ),
        ),
        'usurio/backend' => array(
            'pretty_version' => 'dev-main',
            'version' => 'dev-main',
            'reference' => 'dae20b534977bbf3abecf3af79b8f0a14a991982',
            'type' => 'project',
            'install_path' => __DIR__ . '/../../',
            'aliases' => array(),
            'dev_requirement' => false,
        ),
    ),
);
