<script>
  import { onMount, afterUpdate } from 'svelte'
  import * as d3 from 'd3'
  import * as turf from '@turf/turf'
  import * as rewind from '@mapbox/geojson-rewind'
  import Slider from '@bulatdashiev/svelte-slider'
  import { geoMercator, geoPath } from 'd3-geo'
  import debounce from '$lib/debounce'
  import libraries from '../data/kingpierce_libraries.csv'
  import censustracts_raw from '../data/wa_censustracts_edit_compress.json'
  import counties_raw from '../data/wa_counties_compress.json'
  import composite_king from '../data/king_composite.csv'
  import composite_pierce from '../data/pierce_composite.csv'
  import { draw, fade } from 'svelte/transition'

  const countiesData = counties_raw
  //   countiesData.features = countiesData.features.filter(
  //     feature =>
  //       feature.properties.County == 'King County' ||
  //       feature.properties.County == 'Pierce County',
  //   )
  //   console.log(JSON.stringify(countiesData))
  let censustracts = []
  let counties = []

  let map
  let svg
  let w = 850
  let h = 937
  let rewound_buffer
  let bufferRadius = 1
  let isLoaded = false
  let debouncedDimensions = { w, h }

  let timeoutHandle
  $: {
    clearTimeout(timeoutHandle)
    timeoutHandle = setTimeout(() => {
      debouncedDimensions = { w, h }
    }, 10)
  }

  $: projection = geoMercator().fitSize(
    [debouncedDimensions.w - 150, debouncedDimensions.h],
    countiesData,
  )
  $: path = geoPath().projection(projection)

  $: redrawBuffer(bufferRadius)

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
  const libraries_geojson = {
    type: 'FeatureCollection',
    features: library_convert,
  }
  function initMap() {
    counties = countiesData.features
    censustracts = rewind(censustracts_raw, true).features
    debouncedDimensions = { w, h }
    console.log(w, h)
    isLoaded = true
    const library_buffer = turf.buffer(libraries_geojson, bufferRadius, {
      units: 'miles',
    })
    rewound_buffer = rewind(library_buffer, true)

    // svg
    //   .selectAll('.buffer')
    //   .data(rewound_buffer.features)
    //   .enter()
    //   .append('path')
    //   .attr('class', 'buffer')
    //   .attr('d', path)

    // svg
    //   .selectAll('circle')
    //   .data(libraries)
    //   .enter()
    //   .append('circle')
    //   .attr('cx', d => projection([d.Long, d.Lat])[0])
    //   .attr('cy', d => projection([d.Long, d.Lat])[1])
    //   .attr('r', 3)
    //   .style('fill', '#000')
  }

  function resizeMap() {
    return
    if (svg == null || projection == null) return

    svg.attr('width', w - 150).attr('height', h)
    projection.fitSize([w - 150, h], counties)

    const path = d3.geoPath().projection(projection)

    svg.selectAll('path.counties').attr('d', path)

    svg.selectAll('path.censustracts').attr('d', path)

    svg.selectAll('.buffer').attr('d', path)

    svg
      .selectAll('circle')
      .attr('cx', d => projection([d.Long, d.Lat])[0])
      .attr('cy', d => projection([d.Long, d.Lat])[1])
  }

  function redrawBuffer(value) {
    return
    if (rewound_buffer == null) return
    svg.selectAll('.buffer').remove()
    const path = d3.geoPath().projection(projection)

    const library_buffer = turf.buffer(libraries_geojson, value, {
      units: 'miles',
    })
    rewound_buffer = rewind(library_buffer, true)
    //svg.selectAll(".buffer").selectAll("path").attr("d", path);
    svg
      .selectAll('.buffer')
      .data(rewound_buffer.features)
      .enter()
      .append('path')
      .attr('class', 'buffer')
      .attr('d', path)
  }

  onMount(() => {
    initMap()
  })
</script>

<div class="h-screen w-screen flex">
  <div
    bind:this={map}
    class="w-3/5 h-full p-5 flex items-center"
    bind:clientWidth={w}
    bind:clientHeight={h}
  >
    <svg width={w} height={h} bind:this={svg}>
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
    </svg>
  </div>
  <div class="w-2/5 h-full bg-gray-200 flex items-center justify-center p-5">
    <div>
      <h2 class="text-4xl font-bold mb-4">
        An Understanding of the Digital Access Divide Outside of Seattle
      </h2>
      <p class="text-lg pb-10">
        by Owen Cheung, Shirley Hu, Truong Le, Jason Lim
      </p>
      <p class="text-lg pb-10">
        How well does the public library system serve households with limited
        broadband access within a
        <span class="">{bufferRadius} mile</span>
        radius?
      </p>
      <input
        id="buffer-radius"
        type="range"
        min="1"
        max="5"
        bind:value={bufferRadius}
        class="w-4/5 h-2 cursor-pointer rounded-lg border-none bg-neutral-200"
      />
    </div>
  </div>
</div>

<style>
  :global(.censustracts) {
    fill: none;
    stroke-width: 1.3px;
    opacity: 0.1;
    stroke: #000;
  }
  :global(.counties) {
    fill: none;
    stroke: #000;
    stroke-width: 1.3px;
  }
  :global(.buffer) {
    fill: #fc8421;
    fill-opacity: 20%;
  }
</style>
