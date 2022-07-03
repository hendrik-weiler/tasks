<h2>Pages</h2>
<table>
    <?php foreach($data['pages'] as $name => $pageData): ?>

        <tr>
            <td>
                <a href="page.<?php print $name; ?>.html"><?php print $pageData['meta']['title']; ?></a>
            </td>
            <td>
                <?php print $pageData['meta']['description']; ?>
            </td>
        </tr>

    <?php endforeach; ?>
</table>
<h2>Namespaces</h2>
<table>
	<?php foreach($data['namespaces'] as $namespace => $classes): ?>
		<tr>
			<td>
				<a href="namespace.<?php print $namespace ?>.html"><?php print $namespace ?></a>
			</td>
		</tr>
	<?php endforeach; ?>
</table>
<h2>Functions</h2>
<table>
<?php foreach($data['functions'] as $function): ?>
    <tr>
        <td>
            <a href="function.<?php print $function['name'] ?>.html"><?php print $function['name'] ?></a>
        </td>
        <td>
            <?php print $function['description_fl'] ?>
        </td>
    </tr>
<?php endforeach; ?>
</table>