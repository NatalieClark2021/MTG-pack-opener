<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import Input from "./lib/Input.svelte";
  import Magic from "./lib/Magic.svelte";
  import * as Scry from "scryfall-sdk";

  let isModal = true;
  let isCalled = false;
  type Card = {
    name: string;
    image_uris?: {
      normal: string;
    };
  } | null;

  let card: Card = null;



  async function ranCard() {
    try {
      console.log("Fetching a random card...");

      // Fetch a random card using the Scryfall API
      const response = await fetch("https://api.scryfall.com/cards/random");
      if (!response.ok) {
        throw new Error("Failed to fetch a random card.");
      }

      const card = await response.json();
      console.log("Random card fetched:", card);

      // Return the card object
      return card;
    } catch (error) {
      console.error("Error fetching random card:", error);
      return null;
    }
  }

  function userHandler(isFan: boolean){
    if(isFan){
      isModal = false;
    } else{
      alert("lammmme (no losers allowed) ");
    }
  }
</script>

<main>
  <!-- Modal -->
  {#if isModal}
    <div class="modal modal-open">
      <div class="modal-box  flex flex-col items-center justify-center">
        <h1 class="font-bold text-2xl text-secondary">Is this your card?</h1>
        <p class="py-3">Just kidding. Only MTG fans allowed forward... Are you a fan?</p>

        <div class=" w-full flex flex-col items-center">
          {#if !isCalled}
            {#await ranCard() then fetchedCard}
              {card = fetchedCard}
              {isCalled = true}
            {/await}
          {/if}

          {#if card}

            <img src={card.image_uris?.normal} alt={card.name} class="mt-4 card w-64" />
          {:else}
            <p>Loading card...</p>
          {/if}
            <div class="form-control  hero-content  ">
              <div class="modal-action  space-x-10">
                <button class="btn w-24 btn-primary" on:click={() => userHandler(false)}>No</button>
                <button class="btn w-24 btn-accent" on:click={() => userHandler(true)}>Yes</button>

              </div>
            </div>
        </div>


      </div>
    </div>
  {/if}

  <!-- Main Content -->
  <div class="card w-10/12 mx-auto">
    <div class="navbar bg-base-100">
      <h1 class="prose text-4xl leading-tight text-primary-content">Warmup MTG</h1>
    </div>
    <Magic />
  </div>
</main>

<style>

  .read-the-docs {
    color: #9088;
  }
</style>
