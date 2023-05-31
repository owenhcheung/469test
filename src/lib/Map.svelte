<script>
  import { onMount } from 'svelte'
  import * as d3 from 'd3'

  import * as turf from '@turf/turf'
  import rewind from '@mapbox/geojson-rewind'
  import { geoMercator, geoPath } from 'd3-geo'

  import libraries from '../data/kingpierce_libraries.csv'
  import censustracts_raw from '../data/wa_censustracts_edit_compress.json'
  import counties_raw from '../data/wa_counties_compress.json'
  //import composite from '../data/kingpierce_composite.csv'
  //import composite_k from '../data/king_composite.csv'
  //import composite_p from '../data/pierce_composite.csv'
  //import kComposite_raw from '../data/KcompositeCT.json'
  import fixedcomposite_raw from '../data/fixed_compositeCT.json'

  //import composite_fixed from '../data/composite_fixed_x.csv'

  // import meanmedian_csv from '../data/meanmedian.csv'
  // console.log(meanmedian_csv)
  import meanmedian_raw from '../data/meanmedian_fixed2.json'

  import education_raw from '../data/education_compress.json'

  import { draw, fade } from 'svelte/transition'

  export let showPointsBufferLayer = false
  export let showCompositeLayer = false
  export let showMeanIncomeLayer = false
  export let showMedianIncomeLayer = false
  export let step

  // scrolly change on number
  $: onStepChange(step)

  function onStepChange(currentStep) {
    switch (currentStep) {
      case 0:
        showCompositeLayer = false
        showPointsBufferLayer = false
        showMedianIncomeLayer = false
        showMeanIncomeLayer = false
        break
      case 2:
        showPointsBufferLayer = true
        showCompositeLayer = false
        showMedianIncomeLayer = false
        showMeanIncomeLayer = false
        break
      case 3:
        showCompositeLayer = true
        showPointsBufferLayer = false
        showMedianIncomeLayer = false
        showMeanIncomeLayer = false
        break

      default:
    }
  }

  // performing joins on csv data so theyre useful in the map

  // const csvDataMap = new Map(meanmedian_csv.map(d => [d.GEOID, d]))
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

  //did component mount?
  let isMounted = false

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
  let comp = []
  let censustracts = []
  let counties = []
  let buffer = []
  let points = []
  let meanmedian = []

  /**
   * initialize d3 map. populate datapoints from files
   */
  function initMap() {
    debouncedDimensions = { w, h }
    censustracts = rewind(censustracts_raw, true).features
    counties = counties_raw.features
    points = libraries
    redrawBuffer(bufferRadius)
    comp = rewind(fixedcomposite_raw, true).features
    meanmedian = rewind(meanmedian_raw, true).features
  }

  //render buffers
  export let bufferRadius = 1
  $: redrawBuffer(bufferRadius)

  /**
   * redraws buffer on radius change
   * @param radius buffer radius value
   */
  function redrawBuffer(radius) {
    if (!isMounted) return //redwind functions shits on itself on pre-render
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

  const compositeValues = fixedcomposite_raw.features.map(feature => {
    return parseFloat(feature.properties.properties.compositeValue)
  })

  const meanValues = meanmedian_raw.features.map(feature => {
    return feature.properties.properties.meanValue
  })

  const medianValues = meanmedian_raw.features.map(feature => {
    return feature.properties.properties.medianValue
  })

  const BAplus = education_raw.features.map(feature => {
    if (
      feature.properties.K_BA_HGR !== null &&
      feature.properties.P_BA_HGR === null
    ) {
      return parseInt(feature.properties.K_BA_HGR)
    } else if (
      feature.properties.K_BA_HGR === null &&
      feature.properties.P_BA_HGR !== null
    ) {
    }
    return parseInt(feature.properties.P_BA_HGR)
  })

  const HSplus = education_raw.features.map(feature => {
    if (
      feature.properties.K_HS_HGR !== null &&
      feature.properties.P_HS_HGR === null
    ) {
      return parseInt(feature.properties.K_HS_HGR)
    } else if (
      feature.properties.K_HS_HGR === null &&
      feature.properties.P_HS_HGR !== null
    ) {
    }
    return parseInt(feature.properties.P_HS_HGR)
  })

  // turning these values into a csv to combine with my own censustracts data

  // const combinedData = meanValues.map((mean, index) => [
  //   geoid[index],
  //   mean,
  //   medianValues[index],
  // ])

  // combinedData.unshift(['GEOID', 'meanValue', 'medianValue'])
  // const csv = combinedData.map(row => row.join(',')).join('\n')

  // console.log(csv)

  // oh boy here we go again
  // const filteredFeatures = meanmedian_raw.features.filter(feature => {
  //   const meanValue = feature.properties.properties.meanValue
  //   const medianValue = feature.properties.properties.medianValue
  //   return (
  //     meanValue !== null &&
  //     meanValue !== undefined &&
  //     meanValue !== '' &&
  //     medianValue !== null &&
  //     medianValue !== undefined &&
  //     medianValue !== ''
  //   )
  // })

  // const filteredMeanMedianRaw = {
  //   ...meanmedian_raw,
  //   features: filteredFeatures,
  // }

  // console.log(JSON.stringify(filteredMeanMedianRaw))

  // update json with value properties
  // const withUpdValues = education_raw.features.map(
  //   (feature, index) => {
  //     const baPlus = meanValues[index]
  //     const medianValue = medianValues[index]
  //     return {
  //       ...feature,
  //       properties: {
  //         ...feature.properties,
  //         meanValue: meanValue,
  //         medianValue: medianValue,
  //       },
  //     }
  //   },
  // )

  // const updatedMeanMedianRaw = {
  //   ...meanmedian_raw,
  //   features: meanmedianWithMeanValues,
  // }

  // console.log(JSON.stringify(updatedMeanMedianRaw))

  // const pCompositeValues = pComposite_raw.features.map(feature => {
  //   return parseFloat(feature.properties.properties.compositeValue)
  // })

  //const choroRange = [d3.min(compositeValues), d3.max(compositeValues)]
  // const pchoroRange = [d3.min(pCompositeValues), d3.max(pCompositeValues)]

  //console.log(choroRange)

  const colorScale = d3
    .scaleQuantile()
    .domain(compositeValues)
    .range(['#f1f5f9', '#cbd5e1', '#64748b', '#334155', '#0f172a'])

  const meancolorScale = d3
    .scaleQuantile()
    .domain(meanValues)
    .range(['#f1f5f9', '#cbd5e1', '#64748b', '#334155', '#0f172a'])

  const mediancolorScale = d3
    .scaleQuantile()
    .domain(medianValues)
    .range(['#f1f5f9', '#cbd5e1', '#64748b', '#334155', '#0f172a'])

  // const pcolorScale = d3
  //   .scaleLinear()
  //   .domain(pchoroRange)
  //   .range(['#64748b', '#eff6ff'])

  onMount(() => {
    isMounted = true
    initMap()
  })
</script>

<div
  class="w-full h-full p-5 flex items-center"
  bind:clientWidth={w}
  bind:clientHeight={h}
>
  <svg width={w} height={h}>
    <g class="censustracts" in:fade={{ delay: 100, duration: 500 }}>
      {#each censustracts as feature, i}
        <path d={path(feature)} />
      {/each}
    </g>

    {#if showMeanIncomeLayer}
      <g class="choropleth">
        {#each meanmedian as feature, i}
          <path
            d={path(feature)}
            fill={meancolorScale(feature.properties.properties.meanValue)}
            in:fade={{ duration: 400 }}
            out:fade={{ duration: 400 }}
          />
        {/each}
      </g>
    {/if}

    {#if showMedianIncomeLayer}
      <g class="choropleth">
        {#each meanmedian as feature, i}
          <path
            d={path(feature)}
            fill={mediancolorScale(feature.properties.properties.medianValue)}
            in:fade={{ duration: 400 }}
            out:fade={{ duration: 400 }}
          />
        {/each}
      </g>
    {/if}

    {#if showCompositeLayer}
      <g class="choropleth">
        {#each comp as feature, i}
          <path
            d={path(feature)}
            fill={colorScale(feature.properties.properties.compositeValue || 0)}
            in:fade={{ duration: 400 }}
            out:fade={{ duration: 400 }}
          />
        {/each}
      </g>
      <!-- <g class="composite">
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
    </g> -->
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
  .choropleth {
    opacity: 80%;
    stroke: #000;
    stroke-width: 0.8px;
    stroke-opacity: 70%;
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
    fill: #db2777;
    fill-opacity: 40%;
  }
</style>
