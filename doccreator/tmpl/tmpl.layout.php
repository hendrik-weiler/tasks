<!DOCTYPE html>
<html>
<head>
    <title>Documentation</title>
    <meta charset="utf-8">
    <meta http-equiv='cache-control' content='no-cache'>
    <meta http-equiv='expires' content='0'>
    <meta http-equiv='pragma' content='no-cache'>
    <link rel="stylesheet" href="style.css">
    <script src="script.js"></script>
    <script src="search.data.js"></script>
</head>
<body>
    <template id="searchEntry">
        <a href="$link" class="searchResult">
            <h4>$name</h4>
            <p>$description</p>
        </a>
    </template>
    <div class="container">
        <div class="header">
            <div class="col1">
                <h1>Tasks Documentation v.<?php print $this->version ?></h1>
            </div>
            <div class="col2">
                <input id="search" type="search" placeholder="Search for classes, properties, methods and pages...">
            </div>
        </div>
        <div class="content">
            <div class="search-results"></div>
            <div class="content-inner">
                <?php print $content ?>
            </div>
        </div>
        <div class="footer">
           <?php print date('Y',time()) ?> © Hendrik Weiler | <?php print date('Y/d/m H:i:s',time()) ?>
        </div>
    </div>
</body>
</html>