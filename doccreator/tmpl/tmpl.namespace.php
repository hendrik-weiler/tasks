<?php print $breadcrumbnav; ?>
<h4>
	<span class="class-attr">namespace</span>
	<span class="class-name"><?php print $data['name'] ?></span>
</h4>
<table>
	<?php foreach($data['classes'] as $class): ?>
		<tr>
			<td>
				<a href="class.<?php print $data['name'] ?>.<?php print $class['name'] ?>.html">
					<?php print $class['name'] ?>
				</a>
			</td>
			<td><?php print $class['description_fl'] ?>...</td>
		</tr>
	<?php endforeach; ?>
	<?php if(count($data['classes']) == 0): ?>
		<tr>
			<td colspan="2">This class has no properties or methods.</td>
		</tr>
	<?php endif; ?>
</table>