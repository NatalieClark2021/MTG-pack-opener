<script lang="ts">
    import * as Scry from "scryfall-sdk";

    let searchQuery = ""; // Set search query
    let allSets = []; // All available sets
    let filteredSets = []; // Sets filtered by search query
    let selectedSet = null; // Selected set
    let errorMessage = "";
    let pack = []; // The opened pack of 7 cards
    let selectedCard = null;
    let isModal = false;

    // Fetch all sets on component mount
    import { onMount } from "svelte";

    onMount(async () => {
        try {
            allSets = await Scry.Sets.all();
            filteredSets = allSets;
        } catch (error) {

            console.error("Error fetching sets:", error);
            errorMessage = "Error";
        }
    });

    // Filter sets dynamically as the user types
    function filterSets() {
        filteredSets = allSets
            .filter((set) =>
                set.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 10); // Limit to 10 results
    }


    async function randomCard(){
        errorMessage = "";
        pack = [];
        const cardIterable = Scry.Cards.search(`set:${selectedSet.code}`);
        const cards= [];

        // Collect all cards from the iterable into an array
        for await (const card of cardIterable) {
            cards.push(card);
        }

        let length =cards.length;

        console.log("Fetched Cards:", cards);


        while(pack.length <15){
            const randomIndex = Math.floor(Math.random() * length);
            pack.push(cards[randomIndex]);
            console.log("Fetched Card:", cards[randomIndex]);
        }
        pack = [...pack]; //THIS LINE

    }
    // Open a pack from the selected set


    // Select a set from the dropdown
    function selectSet(set) {
        selectedSet = set;
        searchQuery = set.name;
        filteredSets = []; // Hide suggestions once a set is selected
    }

    function showCard(card){
        selectedCard = card;
        isModal = true;
    }

    function closeModal() {
        isModal = false;
    }

</script>

<div class="p-4 bg-base-200 min-h-screen">
    <h2 class="text-2xl font-bold mb-4">Magic: The Gathering Pack Opener</h2>

    <!-- Search Bar with Dynamic Suggestions -->
    <div class="form-control">
        <label for="setSearch" class="block mb-2 font-bold">Search for a Set:</label>

        <!-- Input Field -->
        <input
                id="setSearch"
                type="text"
                placeholder="Enter set name..."
                class="input input-bordered mb-2"
                bind:value={searchQuery}
                on:input={filterSets}
        />

        <!-- Dropdown Suggestions -->
        {#if filteredSets.length > 0}
            <div
                    class="bg-base-100 shadow-md rounded-lg overflow-y-auto"
                    style="max-height: 200px;"
            >
            <ul class="menu p-2">
                {#each filteredSets as set}
                    <li>
                        <button
                                class="text-left w-full"
                                on:click={() => selectSet(set)}
                        >
                            {set.name}
                        </button>
                    </li>
                {/each}
            </ul>
            </div>
        {/if}
    </div>

    <!-- Display Error Message -->
    {#if errorMessage}
        <div class="text-red-500 mb-4">{errorMessage}</div>
    {/if}

    <!-- Open Pack Button -->
    <button
            class="btn btn-primary w-full"
            on:click={randomCard}
            disabled={!selectedSet}
    >
        Open Pack
    </button>

    <!-- Display Opened Pack -->
    {#if pack.length > 0}
        <div class="mt-8">
            <h3 class="text-lg font-bold mb-4">Your Pack:</h3>
            <div class="flex flex-wrap gap-4 overflow-x-auto">
                {#each pack as card}

                    <button class="card w-32 h-46 rounded-lg " on:click={() => showCard(card)}>
                    <div class="card w-32 h-46 rounded-lg ">
                        <img
                                src={card.image_uris?.normal || ""}
                                alt={card.name}
                                class="rounded-b-lg rounded-t-lg"
                        />

                    </div>
                    </button>
                {/each}
            </div>
        </div>
    {/if}


    {#if isModal && selectedCard}
        <button class="modal modal-open "  on:click={closeModal} >
            <div class="modal-box bg-transparent bg-flex flex-col items-center justify-content">

                <img
                        src={selectedCard.image_uris?.normal || ""}
                        alt={selectedCard.name}
                        class="w-109 object-cover rounded-lg mb-4 top-100"
                />
            </div>
        </button>
    {/if}

</div>
