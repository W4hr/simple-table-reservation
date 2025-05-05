<script>
	import '../app.css';

	let { children } = $props();
</script>

{@render children()}

<footer class="bg-indigo-600 text-center py-4 px-4 text-sm text-white bg-gray-100 border-t border-gray-300">
	<p>&copy; 2025 Jakob Martin Butze. All rights reserved.</p>
	<p>
	  	Released under the <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">MIT License</a>.
	</p>
	<p>
	  	View source on <a href="https://github.com/W4hr/simple-table-reservation" target="_blank" rel="noopener noreferrer">GitHub</a>.
	</p>
</footer>
  