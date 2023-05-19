<script>
  import { onMount } from 'svelte'
  import { createEventDispatcher } from 'svelte'
  import * as d3 from 'd3'
  import * as turf from '@turf/turf'
  import * as rewind from '@mapbox/geojson-rewind'
  import { geoMercator, geoPath } from 'd3-geo'
  import libraries from '../data/kingpierce_libraries.csv'
  import censustracts_raw from '../data/wa_censustracts_edit_compress.json'
  import counties_raw from '../data/wa_counties_compress.json'
  import composite from '../data/kingpierce_composite.csv'
  import { draw, fade } from 'svelte/transition'

  //convert data into buffer readable format
  const library_convert = libraries.map(feature => {
    return {
      type: 'Feature',
      properties: feature,
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(feature.Long), parseFloat(feature.Lat)],
      },
    }
  })

  //did component load?
  let isLoaded = false

  //map width and height
  let w = 850
  let h = 937

  //debounce to reduce # of renders
  let debouncedDimensions = { w, h }
  let timeoutHandle
  $: {
    clearTimeout(timeoutHandle)
    timeoutHandle = setTimeout(() => {
      debouncedDimensions = { w, h }
    }, 15)
  }

  //projection and path engine from d3. re-render when debouncedDimensions fires
  $: projection = geoMercator().fitSize(
    [debouncedDimensions.w - 150, debouncedDimensions.h],
    counties_raw,
  )
  $: path = geoPath().projection(projection)

  //datapoints
  let censustracts = []
  let counties = []
  let buffer = []
  let points = []

  /**
   * initialize d3 map. populate datapoints from files
   */
  function initMap() {
    debouncedDimensions = { w, h }
    censustracts = rewind(censustracts_raw, true).features
    counties = counties_raw.features
    points = libraries
    redrawBuffer(bufferRadius)
  }

  //render buffers
  let bufferRadius = 1
  $: redrawBuffer(bufferRadius)

  /**
   * redraws buffer on radius change
   * @param radius buffer radius value
   */
  function redrawBuffer(radius) {
    if (!isLoaded) return //redwind functions shits on itself on pre-render
    const library_buffer = turf.buffer(
      {
        type: 'FeatureCollection',
        features: library_convert,
      },
      radius,
      {
        units: 'miles',
      },
    )
    buffer = rewind(library_buffer, true).features
  }

  onMount(() => {
    isLoaded = true
    initMap()
  })

  let showPointsBufferLayer = false

  function togglePointsBufferLayer() {
    // showPointsBufferLayer = event.target.checked
    showPointsBufferLayer = !showPointsBufferLayer
    dispatch('togglePointsBufferLayer', showPointsBufferLayer)
  }
</script>

<div class="h-screen w-screen flex overflow-hidden">
  <div
    class="w-3/5 h-full p-5 flex items-center"
    bind:clientWidth={w}
    bind:clientHeight={h}
  >
    <svg width={w} height={h}>
      <g class="censustracts" in:fade={{ delay: 100, duration: 400 }}>
        {#each censustracts as feature, i}
          <path d={path(feature)} />
        {/each}
      </g>

      <g class="counties">
        {#each counties as feature, i}
          <path
            d={path(feature)}
            in:draw={{ delay: i * 1000, duration: 2000 }}
          />
        {/each}
      </g>

      {#if showPointsBufferLayer}
        <g class="buffer">
          {#each buffer as feature, i}
            <path
              d={path(feature)}
              in:fade={{ delay: i * 15, duration: 200 }}
              out:fade={{ duration: 200 }}
            />
          {/each}
        </g>
        <g class="">
          {#each points as point, i}
            <circle
              cx={projection([point.Long, point.Lat])[0]}
              cy={projection([point.Long, point.Lat])[1]}
              r={3}
              in:fade={{ delay: i * 15, duration: 200 }}
              out:fade={{ duration: 200 }}
            />
          {/each}
        </g>
      {/if}
    </svg>
  </div>

  <div class="w-2/5 flex items-center justify-center p-5 overflow-y-auto">
    <div>
      <!-- article header -->
      <div class="mt-[90em]">
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
    </div>
  </div>
</div>

<style>
  .censustracts {
    fill: none;
    stroke-width: 1.3px;
    opacity: 0.1;
    stroke: #000;
  }
  .counties {
    fill: none;
    stroke: #000;
    stroke-width: 1.3px;
  }
  .buffer {
    fill: #0e7490;
    fill-opacity: 20%;
  }
  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background-color: #000000;
    border-radius: 1rem;
    height: 1rem;
    width: 1rem;
  }
</style>
