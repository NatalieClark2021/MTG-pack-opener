<script>
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
            console.log("Fetching all sets from Scryfall...");
            allSets = await Scry.Sets.all();
            filteredSets = allSets; // Initialize filtered sets
            console.log(`Fetched ${allSets.length} sets.`);
        } catch (error) {
            console.error("Error fetching sets:", error);
            errorMessage = "Error fetching sets.";
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

    // Open a pack from the selected set
    async function openPack() {
        errorMessage = "";
        pack = [];

        if (!selectedSet) {
            errorMessage = "Please select a set.";
            console.log("Error: No set selected.");
            return;
        }

        try {
            console.log(`Opening pack for set code: ${selectedSet.code}...`);

            // Collect all cards from the set into an array
            const cardIterable = Scry.Cards.search(`set:${selectedSet.code}`);
            const cards = [];
            for await (const card of cardIterable) {
                cards.push(card);
            }
            console.log(`Fetched ${cards.length} cards for set ${selectedSet.code}:`, cards);

            if (cards.length < 15) {
                errorMessage = "Not enough cards in the set to generate a pack.";
                console.log("Error: Not enough cards in the set.");
                return;
            }

            // Randomly select 7 unique cards
            const shuffled = cards.sort(() => 0.5 - Math.random());
            pack = shuffled.slice(0, 15); //
            console.log("Selected pack cards:", pack);
        } catch (error) {
            console.error("Error fetching cards for the pack:", error);
            errorMessage = "Error opening the pack. Please try again.";
        }
    }

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
            on:click={openPack}
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

    <!-- MODAL area -->

</div>
