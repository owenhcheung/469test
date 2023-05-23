<script>
  import { onMount } from 'svelte'
  import * as d3 from 'd3'

  import * as turf from '@turf/turf'
  import * as rewind from '@mapbox/geojson-rewind'
  import { geoMercator, geoPath } from 'd3-geo'

  import libraries from '../data/kingpierce_libraries.csv'
  import censustracts_raw from '../data/wa_censustracts_edit_compress.json'
  import counties_raw from '../data/wa_counties_compress.json'
  //import composite from '../data/kingpierce_composite.csv'
  //import composite_k from '../data/king_composite.csv'
  //import composite_p from '../data/pierce_composite.csv'
  import kComposite_raw from '../data/KcompositeCT.json'
  import pComposite_raw from '../data/PcompositeCT.json'

  import { draw, fade } from 'svelte/transition'

  export let showPointsBufferLayer = false
  export let showCompositeLayer = false
  //export let step

  // performing joins on csv data so theyre useful in the map
  // const csvDataMap = new Map(composite_p.map(d => [d.GEOID, d]))
  // const joinedData = censustracts_raw.features
  //   .filter(feature => csvDataMap.has(feature.properties.GEOID))
  //   .map(feature => ({
  //     ...feature,
  //     properties: {
  //       ...feature.properties,
  //       ...csvDataMap.get(feature.properties.GEOID),
  //     },
  //   }))

  // const featureCollection = {
  //   type: 'FeatureCollection',
  //   features: [],
  // }

  // joinedData.forEach(row => {
  //   const { geometry, ...properties } = row
  //   const feature = {
  //     type: 'Feature',
  //     geometry,
  //     properties,
  //   }
  //   featureCollection.features.push(feature)
  // })

  // // print the resulting feature collection
  // console.log(JSON.stringify(featureCollection))

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
  let kcomp = []
  let pcomp = []
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
    kcomp = rewind(kComposite_raw, true).features
    pcomp = rewind(pComposite_raw, true).features
  }

  //render buffers
  export let bufferRadius = 1
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

  const kCompositeValues = kComposite_raw.features.map(feature => {
    return parseFloat(feature.properties.properties.compositeValue)
  })

  const pCompositeValues = pComposite_raw.features.map(feature => {
    return parseFloat(feature.properties.properties.compositeValue)
  })

  const kchoroRange = [d3.min(kCompositeValues), d3.max(kCompositeValues)]
  const pchoroRange = [d3.min(pCompositeValues), d3.max(pCompositeValues)]

  const kcolorScale = d3
    .scaleLinear()
    .domain(kchoroRange)
    .range(['#fff', '#d4d4d4'])

  const pcolorScale = d3
    .scaleLinear()
    .domain(pchoroRange)
    .range(['#fff', '#d4d4d4'])

  onMount(() => {
    isLoaded = true
    initMap()
  })
</script>

<div
  class="w-3/5 h-full p-5 flex items-center"
  bind:clientWidth={w}
  bind:clientHeight={h}
>
  <svg width={w} height={h}>
    <g class="censustracts" in:fade={{ delay: 100, duration: 100 }}>
      {#each censustracts as feature, i}
        <path d={path(feature)} />
      {/each}
    </g>

    {#if showCompositeLayer}
      <g class="composite">
        {#each kcomp as feature, i}
          <path
            d={path(feature)}
            fill={kcolorScale(
              feature.properties.properties.compositeValue || 0,
            )}
            in:fade={{ duration: 200 }}
            out:fade={{ duration: 200 }}
          />
        {/each}
      </g>
      <g class="composite">
        {#each pcomp as feature, i}
          <path
            d={path(feature)}
            fill={pcolorScale(
              feature.properties.properties.compositeValue || 0,
            )}
            in:fade={{ duration: 200 }}
            out:fade={{ duration: 200 }}
          />
        {/each}
      </g>
    {/if}

    <g class="counties">
      {#each counties as feature, i}
        <path d={path(feature)} in:draw={{ delay: i * 1000, duration: 2000 }} />
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

<style>
  .composite {
    opacity: 50%;
    stroke: #000;
    stroke-width: 0.8px;
    stroke-opacity: 50%;
  }
  .censustracts {
    fill: none;
    stroke-width: 0.8px;
    /* opacity: 0.1; */
    stroke: #d6d6d6;
  }
  .counties {
    fill: none;
    stroke: #000;
    stroke-width: 1px;
  }
  .buffer {
    fill: #0e7490;
    fill-opacity: 20%;
  }
</style>
