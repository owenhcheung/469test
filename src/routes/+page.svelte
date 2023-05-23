<script>
  import Map from '$lib/Map.svelte'
  import Scrolly from '$lib/Scrolly.svelte'
  import Article from '../lib/Article.svelte'
  let bufferRadius = 1

  let showPointsBufferLayer = false
  let showCompositeLayer = false

  let step

  function togglePointsBufferLayer() {
    // showPointsBufferLayer = event.target.checked
    showPointsBufferLayer = !showPointsBufferLayer
    // dispatch('togglePointsBufferLayer', showPointsBufferLayer)
  }

  function toggleCompositeLayer() {
    showCompositeLayer = !showCompositeLayer
    // dispatch('toggleCompositeLayer', showCompositeLayer)
    console.log(showCompositeLayer)
  }
</script>

<div class="h-screen w-screen flex overflow-hidden">
  <div
    style="position: absolute; top:15px; right: 15px; background: yellow; z-index: 15;"
  >
    {step}
  </div>
  <Map
    bind:bufferRadius
    bind:showPointsBufferLayer
    bind:showCompositeLayer
    {step}
  />
  <div class="w-2/5 px-5 py-20 overflow-y-auto">
    <!-- article header -->
    <!-- mt-[40vh] mb-[20vh] -->
    <div class="">
      <h2 class="text-4xl font-bold mb-4">
        An Understanding of the Digital Access Divide Outside of Seattle
      </h2>
      <p class="text-lg pb-10">
        by Owen Cheung, Shirley Hu, Truong Le, Jason Lim
      </p>
    </div>

    <!-- buttons -->
    <button
      class="p-5 mb-5 rounded border text-left"
      on:click={toggleCompositeLayer}
      class:border-black={showCompositeLayer}
    >
      <p class="text-lg">
        Composite index <a
          href="#index-ex"
          class="bg-lime-100"
          on:click|stopPropagation>[learn more]</a
        >
      </p>
    </button>

    <button
      class="p-5 w-4/5 rounded border text-left mb-10"
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
        class="w-full h-2 cursor-pointer appearance-none rounded-full bg-slate-200"
        on:click|stopPropagation
      />
    </button>

    <!-- article content -->
    <article>
      <Article bind:step />
    </article>
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
</style>
