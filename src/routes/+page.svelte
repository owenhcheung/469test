<script>
  import Map from '$lib/Map.svelte'
  import Scrolly from '$lib/Scrolly.svelte'
  let bufferRadius = 1

  let showPointsBufferLayer = false

  let value

  function togglePointsBufferLayer() {
    // showPointsBufferLayer = event.target.checked
    showPointsBufferLayer = !showPointsBufferLayer
    dispatch('togglePointsBufferLayer', showPointsBufferLayer)
  }
</script>

<div class="h-screen w-screen flex overflow-hidden">
  <Map bind:bufferRadius bind:showPointsBufferLayer />
  <div class="w-2/5 p-5 overflow-y-auto">
    <Scrolly bind:value>
      <!-- article header -->
      <div class="">
        <h2 class="text-4xl font-bold mb-4">
          An Understanding of the Digital Access Divide Outside of Seattle
        </h2>
        <p class="text-lg pb-10">
          by Owen Cheung, Shirley Hu, Truong Le, Jason Lim
        </p>
      </div>

      <!-- buttons -->
      <button class="p-5 mb-5 rounded border text-left">
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
      <div id="article">
        <p class="text-2xl mb-5">Project overview</p>

        <p class="mb-10">
          We were asked by InterConnection, an organization based in Seattle,
          Washington, to investigate the digital access divide outside of the
          city of Seattle. InterConnection aims to bridge the digital gap
          through providing devices such as computers and laptops as well as
          affordable internet options for households without them. They
          mentioned that much of the population they have focused their efforts
          on has moved outside of the immediate city of Seattle and into the
          surrounding areas such as Pierce County and some parts of south King
          County.
        </p>

        <p class="text-2xl pb-5">Research</p>

        <p class="mb-5">
          Our research investigated the digital divide outside of the city of
          Seattle. We focused our research and data collection on the
          neighboring counties of Pierce County and south of King County
          (specifically the regions bounded by Kent, Federal Way and Auburn). We
          determined several important variables that will be used to analyze
          which areas of Washington need the most support:
        </p>

        <ul class="list-disc list-inside mb-5 ml-5">
          <li>Income level</li>
          <li>Devices per household</li>
          <li>Type of internet subscription</li>
          <li>Highest level of education</li>
        </ul>

        <p class="mb-5">
          As well as other miscellaneous factors such as the locations of public
          libraries where people might go to access the internet.
        </p>

        <p class="mb-5">
          We created a composite index of the income level, percent of
          households without access to any laptop or computer and households
          without an internet subscription. The lower values mean that these
          areas have lower than average values (for example, the average income
          level per household in the county) for each of the three variables.
          Below we have included the 3 census tracts with the lowest composite
          index value.
        </p>

        <!-- pierce composite table -->
        <table class="w-full table-fixed mb-10 shadow-lg">
          <tr>
            <th class="bg-slate-100 border text-left px-8 py-4"
              >Census Tract [Pierce]</th
            >
            <th class="bg-slate-100 border text-left px-8 py-4"
              >Composite Value</th
            >
          </tr>
          <tr>
            <td class="border px-8 py-4">53053060200</td>
            <td class="border px-8 py-4">276318021.88149</td>
          </tr>
          <tr>
            <td class="border px-8 py-4">53053060300</td>
            <td class="border px-8 py-4">276318022.39296</td>
          </tr>
          <tr>
            <td class="border px-8 py-4">53053060400</td>
            <td class="border px-8 py-4">276318022.92531</td>
          </tr>
        </table>

        <!-- king composite table -->
        <table class="w-full table-fixed mb-10 shadow-lg">
          <tr>
            <th class="bg-slate-100 border text-left px-8 py-4"
              >Census Tract [King]</th
            >
            <th class="bg-slate-100 border text-left px-8 py-4"
              >Composite Value</th
            >
          </tr>
          <tr>
            <td class="border px-8 py-4">53033000101</td>
            <td class="border px-8 py-4">107790650.60848</td>
          </tr>
          <tr>
            <td class="border px-8 py-4">53033000102</td>
            <td class="border px-8 py-4">107790650.60841</td>
          </tr>
          <tr>
            <td class="border px-8 py-4">53033000201</td>
            <td class="border px-8 py-4">107790650.81245</td>
          </tr>
        </table>
      </div>
    </Scrolly>
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
