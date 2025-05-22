<script>
	import Seat from "../components/Seat.svelte";
	import { blur, scale, slide } from "svelte/transition";

    // Config
    const price_display = false;
    const price_ticket = 20; // In Euro

    let { data } = $props()

    let tables = $state(data.tables.map(table => ({...table, confirmation: false})))

    let seats_selected = $derived(tables.flatMap(table => table.seats.filter(seat => seat.selected).map(seat => seat.seat_id)))
    let count_seats = $derived(seats_selected.length)

    let name = $state("")

    function selectTable(table) {
        const table_selected_seats = table.seats.filter(seat => seat.selected).length
        
        const seat_select = table_selected_seats/table.seats.filter(seat => !seat.reserved).length <= 0.5

        table.seats.forEach(seat => {
            if (!seat.reserved) seat.selected = seat_select //if more then half are selected then unselect them
        });
    }

    let nameCount_display = $state(false)
    const nameCount = $derived(
        Object.entries(
            data.tables
                .flatMap(table => table.seats)
                .reduce((accumulator, seat) => {
                    if (seat.reserved && seat.reservation_name) accumulator[seat.reservation_name] = (accumulator[seat.reservation_name] || 0) + 1
                    else accumulator["Frei"] = (accumulator["Frei"] | 0) + 1
                    return accumulator;
                    }, {}
                )
            )
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }))
    )
</script>


<div class="max-w-6xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">
        Reserviere {count_seats === 0? "ausgewählte Sitze": count_seats === 1? "einen Sitz": `${count_seats} Sitze` } unter dem Namen 
        <label for="nameInput" class="text-indigo-600">{ name ? name : "..." }</label>
    </h1>

    
    <form class="space-y-8" method="POST">
        <div class="flex flex-col flex-row gap-4 items-end justify-center flex-wrap mb-0">
            <label for="nameInput" class="flex flex-col gap-2">
                <span class="text-gray-700 font-medium">Name:</span>
                <input 
                    type="text" 
                    bind:value={ name } 
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="z.B. Max Mustermann"
                    id="nameInput"
                    name="reservation_name"
                    required
                >
            </label>
            <label for="" class="max-w-min max-h-min bg-indigo-400 overflow-hidden rounded-lg flex whitespace-nowrap items-center text-white">
                <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300 ease-in-out shadow-md hover:cursor-pointer">
                    Reservieren
                </button>
                {#if price_display}
                    <span class="mx-2">
                        { count_seats * price_ticket },00 €
                    </span>
                {/if}
            </label>
            
            <lable
                class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300 ease-in-out shadow-md hover:cursor-pointer w-80 justify-between"
                onclick={() => nameCount_display = !nameCount_display}
            >
                <span>{nameCount_display ? 'Reservierungsliste ausblenden' : 'Reservierungsliste anzeigen'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform {nameCount_display ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
                <input type="checkbox" bind:checked={nameCount_display} hidden>
            </lable>
        </div>
        <div class="h-2 mb-0"></div>
        {#if nameCount_display}
            <div class="h-2 mb-0" transition:slide></div>
        {/if}
        <div class="flex items-center justify-center">
            {#if nameCount_display}
                <div transition:slide class="m-0 p-0">
                    <div class="overflow-hidden bg-white rounded-lg shadow-md lg:w-150 sm:max-w-full">
                        <div class="bg-indigo-400 px-4 py-3">
                            <h2 class="text-lg font-bold text-white">Reservierungen nach Namen</h2>
                        </div>
                        <div class="divide-y divide-gray-200 max-h-100 overflow-scroll">
                            {#each nameCount as person}
                                {#if person.name === "Frei"}
                                    <div class="flex items-center justify-between px-8 py-3 bg-green-50 hover:bg-green-100 duration-200">
                                        <span class="font-medium text-green-800">Freie Sitze</span>
                                        <div class="flex items-center justify-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                                            {person.count} {person.count === 1 ? 'Sitz' : 'Sitze'}
                                        </div>
                                    </div>
                                {:else}
                                    <div class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 duration-200">
                                        <div class="flex items-center">
                                            <span class="flex items-center justify-center w-10 h-10 mr-3 text-sm font-medium text-white bg-indigo-400 rounded-full">{person.name.split(" ").map(subname => subname.charAt(0)).slice(0,2).join("")}</span>
                                            <span class="font-medium text-gray-800">{person.name}</span>
                                        </div>
                                        <div class="flex items-center justify-center px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
                                            {person.count} {person.count === 1 ? 'Sitz' : 'Sitze'}
                                        </div>
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    </div>
                </div>
            {/if}
        </div>

        <div class="mt-2 flex gap-8 flex-wrap justify-center">
            {#each tables as table (table.table_id)}
                <div class="mb-6 max-w-min">
                    <div class="flex justify-center mb-4">
                        {#each table.seats as seat, index (seat.seat_id)}
                            {#if index%2==0}
                                <Seat
                                    reservation_name={seat.reservation_name}
                                    reserved={seat.reserved}
                                    bind:selected={seat.selected}
                                    id={seat.seat_id}
                                />
                            {/if}
                        {/each}
                    </div>
                    <div class="relative w-full h-24">
                        <button
                            class="w-full h-full bg-gray-200 rounded-lg shadow-md flex justify-center items-center text-gray-700 font-bold text-lg opacity-60 z-20"
                            type="button"
                            onclick={() => table.confirmation = true}
                        >
                            Tisch #{table.table_id}
                        </button>
                    
                        {#if table.confirmation && table.seats.filter(seat => seat.reserved == 0).length}
                            <div class="absolute inset-0 bg-gray-50 bg-opacity-90 flex flex-col justify-center items-center rounded-lg z-30" transition:scale>
                                <span class="mb-2 text-sm text-center rounded-lg text-gray-500 font-bold">
                                    {#if table.seats.filter(seat => seat.selected).length/table.seats.filter(seat=>!seat.reserved).length <= 0.5}
                                        Tisch #{table.table_id} reservieren?
                                    {:else}
                                        Tisch #{table.table_id} freigeben?
                                    {/if}
                                </span>
                                <button
                                    class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-bold text-sm"
                                    onclick={() => {
                                        selectTable(table);
                                        table.confirmation = false;
                                    }}
                                    type="button"
                                >
                                    Ja
                                </button>
                            </div>
                        {/if}
                    </div>
                    
                    <div class="flex justify-center mt-4">
                        {#each table.seats as seat, index (seat.seat_id)}
                            {#if index%2==1}
                                <Seat
                                    reservation_name={seat.reservation_name}
                                    reserved={seat.reserved}
                                    bind:selected={seat.selected}
                                    id={seat.seat_id}
                                />
                            {/if}
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </form>
</div>