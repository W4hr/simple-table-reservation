<script>
	import { quadInOut } from "svelte/easing";
	import { blur, fly, scale, slide } from "svelte/transition";

    let { reserved, reservation_name, selected = $bindable(), id, color = "indigo" } = $props()

    let nameHover = $state(false)
</script>

<div class="mx-2 my-1">
    <input
        type="checkbox"
        class="peer hidden"
        disabled={reserved}
        bind:checked={selected}
        id="checkbox-{id}"
        name="seat-{id}"
    />
   
    <label
        for="checkbox-{id}"
        class="flex items-center justify-center h-12 w-12 rounded-full bg-gray-200 text-gray-700 font-bold shadow-md relative z-48
               peer-checked:bg-indigo-600 peer-checked:text-white transition-all duration-300
               hover:bg-indigo-400 hover:scale-105 cursor-pointer
               {reserved ? 'bg-indigo-400 text-white hover:bg-indigo-400 hover:cursor-not-allowed' : ''}"
        onmouseenter={() => nameHover = true}
        onmouseleave={() => nameHover = false}
    >
        {#if reservation_name}
            <span class="text-lg">{reservation_name.split(" ").map(subname => subname.charAt(0)).join("")}</span>
            {#if nameHover}
                <div class="absolute left-1/2 top-12.5 -translate-x-1/2 w-0 h-0 z-50
                    border-l-[10px] border-l-transparent 
                    border-r-[10px] border-r-transparent 
                    border-b-[10px] border-b-indigo-400"
                    transition:blur={{ duration: 500, easing: quadInOut }}>
                </div>
                <div class="text-xs rounded-md text-gray-700 shadow-md absolute top-14 text-white text-center px-2 py-1 bg-indigo-400 whitespace-nowrap z-50" transition:blur={{ duration: 500, easing: quadInOut }}>
                    <p>#{id}</p>
                    {reservation_name}
                </div>
            {/if}
        {:else}
            <span class="text-sm opacity-60">#{id}</span>
        {/if}
    </label>
</div>