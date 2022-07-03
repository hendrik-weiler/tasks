<?php print $breadcrumbnav; ?>
<p class="description">
    <?php print nl2br($data['description']) ?>
    <?php print $this->printExamples($data); ?>
</p>
<h4>
    <span class="class-attr"><?php print $data['access'] ?> function</span>
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
            <?php if($path = $this->classExists($data['return'],$data['namespace'])): ?>
                <a href="class.<?php print $path ?>.html"><?php print $data['return'] ?></a>
            <?php elseif(strlen($data['return'])==0): ?>
				void
			<?php else: ?>
                <?php print $data['return'] ?>
            <?php endif; ?>
        </td>
    </tr>
</table>