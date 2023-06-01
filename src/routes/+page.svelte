<script>
  import Article from '../lib/Article.svelte'
  import { fade } from 'svelte/transition'
  const LoadMap = import('../lib/Map.svelte').then(({ default: C }) => C)
  let showMap = false

  let bufferRadius = 1
  let showPointsBufferLayer = false

  let showCompositeLayer = false
  let showMeanIncomeLayer = false
  let showMedianIncomeLayer = false
  let showBachLayer = false
  let showHSLayer = false
  let showComputerLayer = false
  let showInternetLayer = false
  let showBALayer = false

  let toggletable = false

  let step

  function togglePointsBufferLayer() {
    // showPointsBufferLayer = event.target.checked
    showPointsBufferLayer = !showPointsBufferLayer
    // dispatch('togglePointsBufferLayer', showPointsBufferLayer)
  }

  function toggleCompositeLayer() {
    showCompositeLayer = !showCompositeLayer
    showMeanIncomeLayer = false
    showMedianIncomeLayer = false
    showComputerLayer = false
    showInternetLayer = false
    showBALayer = false
    // dispatch('toggleCompositeLayer', showCompositeLayer)
  }

  function toggleMeanIncomeLayer() {
    showMeanIncomeLayer = !showMeanIncomeLayer
    showCompositeLayer = false
    showMedianIncomeLayer = false
    showComputerLayer = false
    showInternetLayer = false
    showBALayer = false
  }

  function toggleMedianIncomeLayer() {
    showMedianIncomeLayer = !showMedianIncomeLayer
    showCompositeLayer = false
    showMeanIncomeLayer = false
    showComputerLayer = false
    showInternetLayer = false
    showBALayer = false
  }

  function toggleComputerLayer() {
    showComputerLayer = !showComputerLayer
    showCompositeLayer = false
    showMeanIncomeLayer = false
    showMedianIncomeLayer = false
    showInternetLayer = false
    showBALayer = false
  }

  function toggleInternetLayer() {
    showInternetLayer = !showInternetLayer
    showCompositeLayer = false
    showMeanIncomeLayer = false
    showMedianIncomeLayer = false
    showComputerLayer = false
    showBALayer = false
  }

  function toggleBALayer() {
    showBALayer = !showBALayer
    showCompositeLayer = false
    showMeanIncomeLayer = false
    showMedianIncomeLayer = false
    showComputerLayer = false
    showInternetLayer = false
  }
</script>

<div class="absolute right-0 top-0 p-1 z-20 bg-yellow-300 invisible">
  {step}
</div>
<div class="h-screen w-screen flex overflow-hidden">
  <div class="w-3/5 relative">
    {#await LoadMap}
      <div
        class="flex justify-center items-center w-full h-full bg-slate-100 absolute"
        transition:fade={{ duration: 1000 }}
      >
        <div class="loader" />
      </div>
    {:then Map}
      <Map
        bind:bufferRadius
        bind:showPointsBufferLayer
        bind:showCompositeLayer
        bind:showMeanIncomeLayer
        bind:showMedianIncomeLayer
        bind:showComputerLayer
        bind:showInternetLayer
        bind:showBALayer
        {step}
      />
    {/await}
  </div>

  <div class="w-2/5 p-5 overflow-y-auto">
    <!-- article header -->
    <!-- mt-[40vh] mb-[20vh] -->

    <!-- article content -->
    <article>
      <Article bind:step />
    </article>

    <!-- buttons -->
    <div
      id="buttons"
      class="border border-dashed p-5 rounded-md border-slate-300 mb-10"
    >
      <!-- <p class="text-2xl pb-5">Layers</p> -->
      <button
        class="p-5 mb-5 mr-5 rounded border text-left"
        on:click={toggleCompositeLayer}
        class:border-black={showCompositeLayer}
      >
        <p class="text-lg">Composite index</p>
      </button>

      <button
        class="p-5 mb-5 mr-5 rounded border text-left"
        on:click={toggleMedianIncomeLayer}
        class:border-black={showMedianIncomeLayer}
      >
        <p class="text-lg">Median Income</p>
      </button>

      <button
        class="p-5 mb-5 mr-5 rounded border text-left hidden"
        on:click={toggleMeanIncomeLayer}
        class:border-black={showMeanIncomeLayer}
      >
        <p class="text-lg">Mean Income</p>
      </button>

      <button
        class="p-5 mb-5 mr-5 rounded border text-left"
        on:click={toggleComputerLayer}
        class:border-black={showComputerLayer}
      >
        <p class="text-lg">% No Computer</p>
      </button>

      <button
        class="p-5 mb-5 mr-5 rounded border text-left"
        on:click={toggleInternetLayer}
        class:border-black={showInternetLayer}
      >
        <p class="text-lg">% No Internet</p>
      </button>

      <button
        class="p-5 mb-5 mr-5 rounded border text-left"
        on:click={toggleBALayer}
        class:border-black={showBALayer}
      >
        <p class="text-lg">Bachelors Degree+</p>
      </button>

      <button
        class="p-5 w-4/5 rounded border text-left mr-5"
        on:click={togglePointsBufferLayer}
        class:border-black={showPointsBufferLayer}
      >
        <p class="text-lg pb-3">
          Public libraries +
          <span class="bg-cyan-700 bg-opacity-20 px-2 py-1 rounded-sm"
            >{bufferRadius} mile radius</span
          >
        </p>
        <input
          id="buffer-radius"
          type="range"
          min="1"
          max="5"
          bind:value={bufferRadius}
          on:mousedown={() => {
            if (!showPointsBufferLayer) showPointsBufferLayer = true
          }}
          class="w-full h-2 cursor-pointer appearance-none rounded-full bg-slate-200"
          on:click|stopPropagation
        />
      </button>
    </div>
  </div>
</div>

<style>
  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background-color: #000000;
    border-radius: 1rem;
    height: 1rem;
    width: 1rem;
  }
  .loader {
    width: 30px;
    height: 30px;
    border: 4px solid #cbd5e1;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 0.8s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
