<?php

require_once 'doccreator/Doc.php';

$config = json_decode(file_get_contents('build.json'),true);

$decDoc = new Doc(array(
    'sourceDir' => 'src/js',
    'buildDir' => 'docs',
    'version' => $config['version']
));
$decDoc->build();

print 'Docs generated.' . PHP_EOL;