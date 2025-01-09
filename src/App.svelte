<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import Input from "./lib/Input.svelte";
  import Magic from "./lib/Magic.svelte";
  import * as Scry from "scryfall-sdk";
  import type { Card } from 'scryfall-sdk';

  let isModal = true;
  let isCalled = false;

  let card: Card | null = null;

  async function randomCard(){
    try {
      return Scry.Cards.random();
    }catch(error){
      console.log("Error fetching card, " + error);
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
        <h1 class="font-bold text-2xl text-secondary py-2">Is this your card?</h1>


        <div class=" w-full flex flex-col items-center">
          {#if !isCalled}
            {#await randomCard() then fetchedCard}
              {card = fetchedCard}
              {isCalled = true}
            {/await}
          {/if}

          {#if card}

            <img src={card.image_uris?.normal} alt={card.name} class="mt-4 card w-64" />
          {:else}
            <p>Loading card...</p>
          {/if}
            <div class="form-control flex flex-col items-center justify-center ">
              <p class="pt-6 pb-2">Just kidding. Only MTG fans allowed forward... Are you a fan?</p>
              <div class="modal-action  space-x-10">
                <button class="btn w-24 btn-accent " on:click={() => userHandler(true)}>Yes</button>
                <button class="btn w-24 btn-primary " on:click={() => userHandler(false)}>No</button>


              </div>
            </div>
        </div>


      </div>
    </div>
  {/if}

  <!-- Main Content -->
  <div class="card w-10/12 mx-auto">
    <div class="navbar bg-base-100">
    </div>
    <Magic />
  </div>
</main>

<style>

  .read-the-docs {
    color: #9088;
  }
</style>
