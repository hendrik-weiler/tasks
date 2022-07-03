<?php print $breadcrumbnav; ?>
<p class="description">
    <?php print nl2br($data['description']) ?>
</p>
<h4>
    <span class="class-attr">function</span>
    <span class="class-name"><?php print $data['name'] ?></span>
</h4>
<table>
    <tr class="tr-head">
        <td colspan="2">Parameter</td>
    </tr>
    <?php foreach($data['params'] as $param): ?>
        <tr>
            <td>
                <?php print $param['name'] ?>
            </td>
            <td><?php print $param['description'] ?></td>
        </tr>
    <?php endforeach; ?>
    <tr class="tr-head">
        <td colspan="2">Returns</td>
    </tr>
    <tr>
        <td colspan="2">
            <?php if($this->classExists($data['return'])): ?>
                <a href="class.<?php print $data['return'] ?>.html"><?php print $data['return'] ?></a>
            <?php else: ?>
                <?php print $data['return'] ?>
            <?php endif; ?>
        </td>
    </tr>
</table>