<script lang="ts">
    import * as Scry from "scryfall-sdk";
    import type { Set } from 'scryfall-sdk';
    import type { Card } from 'scryfall-sdk';


    let userInput = "";
    let allSets: Set[] = [];
    let filteredSets: Set[] = [];
    let selectedSet: Set[] = [];
    let errorMessage = "";
    let pack:Card[] = [];
    let selectedCard:Card | null= null;
    let isModal = false;

    let isLoading = false;

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
            .filter((set) => {
                let isEnough: Boolean = false;
                let matchesEntry: Boolean = false;
                matchesEntry = set.name.toLowerCase().includes(userInput.toLowerCase())

                isEnough = set.card_count> 15; // checks for 15 unique cards in set


                return isEnough && matchesEntry;

            }

            );


        if(filteredSets.length ==0){
            errorMessage = "No sets matched that search"; //update user on error
            selectedSet = [];
        }

        if(filteredSets.length > 0){ // clear the error
            errorMessage = "";
        }

    }


    async function randomCards(){
        userInput = ""
        pack = [];
        const cardIterable = Scry.Cards.search(`set:${selectedSet[0].code}`);
        const cards= [];
        try {
            // Collect all cards from the iterable into an array
            isLoading = true;

            for await (const card of cardIterable) {
                cards.push(card);
            }

            let length = cards.length;

            console.log("Fetched Cards:", cards);


            while (pack.length < 15) {
                const randomIndex = Math.floor(Math.random() * length);
                pack.push(cards[randomIndex]);
                console.log("Fetched Card:", cards[randomIndex]);
            }
            pack = [...pack]; //THIS LINE IS VITAL TO RELOAD PACK ARRAY
        } catch (error){
            errorMessage = "There was an error attempting to fetch that pack";
        } finally {
            isLoading = false;
        }
    }



    // Select a set from the dropdown
    function selectSet(set: Set): void {
        selectedSet[0] = set;
        userInput = set.name;
        filteredSets = []; // Hide sets after select
    }

    function showCard(card : Card){
        selectedCard = card;
        isModal = true;
    }

    function closeModal() {
        isModal = false;
    }

</script>



<div class="p-4 bg-base-200 min-h-screen">
    <h2 class="text-2xl font-bold mb-4 text-secondary">Magic: The Gathering Pack Opener</h2>

    <!-- Search Bar with Dynamic Suggestions -->
    <div class="form-control">
        <label for="setSearch" class="block mb-2 font-bold">Search for a Set:</label>

        <!-- Input Field -->
        <input
                id="setSearch"
                type="text"
                placeholder="Enter a set name..."
                class="input input-bordered mb-2"
                bind:value={userInput}
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
    <div class="py-2">
        <button
                class="btn btn-neutral w-full"
                on:click={randomCards}
                disabled={!selectedSet}
        >
            Open Pack
        </button>

    </div>


    <!-- Display Opened Pack -->
    {#if pack.length > 0}
        <h3 class="text-lg font-bold mb-5 mt-4">Your <em> {selectedSet[0].name} </em> Pack:</h3>
    {/if}
    {#if isLoading}
        <h3 class="text-lg font-bold mb-4 mt-6 text-secondary " >Your <em> {selectedSet[0].name} </em> Pack is Loading...</h3>
    {/if}
        <div class="">


            <div class="flex flex-wrap items-center justify-center gap-4 overflow-x-auto">
                {#each pack as card}

                    <button class="card w-32 h-46 rounded-lg " on:click={() => showCard(card)}>

                        <img
                                src={card.image_uris?.normal || ""}
                                alt={card.name}
                                class="rounded-b-lg rounded-t-lg"
                        />

                    </button>
                {/each}
            </div>
        </div>



    {#if isModal && selectedCard}
        <button class="modal modal-open "  on:click={closeModal} >

                <img
                        src={selectedCard.image_uris?.normal || ""}
                        alt={selectedCard.name}
                        class="w-109 object-cover card mb-4 top-100"
                />
        </button>
    {/if}

</div>
