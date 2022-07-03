<?php print $breadcrumbnav; ?>
<p class="description">
    <?php print nl2br($data['description']) ?>
    <?php print $this->printExamples($data); ?>
</p>
<h4>
    <span class="class-attr"><?php print $data['access'] ?> class</span>
    <span class="class-name"><?php print $data['name'] ?></span>
    <?php if(strlen($data['extends']) > 0): ?>
        <span class="class-attr">extends</span>
        <a class="class-extends" href="class.<?php print $data['extends'] ?>.html"><?php print $data['extends'] ?></a>
    <?php endif; ?>
</h4>
<table>
<?php foreach($data['properties'] as $property): ?>
    <tr>
        <td>
            <?php if(strlen($property['class']) > 0): ?>
                <span class="entry-attr"><?php print $property['access'] . ' ' . $property['type'] ?></span>
                <a href="class.<?php print $property['class'] ?>.html">
                    <?php print $property['name'] ?>
                </a>
            <?php else: ?>
                <span class="entry-attr"><?php print $property['access'] ?>
                    <?php if($path = $this->classExists($property['type'],$property['namespace'])): ?>
                        <a href="class.<?php print $path ?>.html"><?php print $property['type'] ?></a>
                    <?php else: ?>
                        <?php print $property['type'] ?>
                    <?php endif; ?>
                </span>
                <?php print $property['name'] ?>
            <?php endif; ?>
        </td>
        <td><?php print nl2br($property['description']) ?></td>
    </tr>
<?php endforeach; ?>
<?php foreach($data['methods'] as $method): ?>
    <tr>
        <td>
            <span class="entry-attr"><?php print $method['access'] . ' ' . $method['type'] ?></span>
            <a href="class.<?php print $data['namespace'] ?>.<?php print $data['name'] ?>.<?php print $method['name'] ?>.html">
                <?php print $method['name'] ?>
            </a>
        </td>
        <td><?php print $method['description_fl'] ?>...</td>
    </tr>
<?php endforeach; ?>
    <?php if(count($data['properties']) == 0 && count($data['methods']) == 0): ?>
        <tr>
            <td colspan="2">This class has no properties or methods.</td>
        </tr>
    <?php endif; ?>
</table>