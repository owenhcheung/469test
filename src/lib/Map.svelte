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

  import compinter_raw from '../data/compinter_fixed.json'

  import education_raw from '../data/education_compress4.json'
  console.log(education_raw)
  //import education_csv from '../data/education.csv'

  import { draw, fade } from 'svelte/transition'

  export let showPointsBufferLayer = false
  export let showCompositeLayer = false
  export let showMeanIncomeLayer = false
  export let showMedianIncomeLayer = false
  export let showComputerLayer = false
  export let showInternetLayer = false
  export let showBALayer = false
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
        showComputerLayer = false
        showInternetLayer = false
        showBALayer = false
        break
      case 1:
        showCompositeLayer = false
        showPointsBufferLayer = false
        showMedianIncomeLayer = false
        showMeanIncomeLayer = false
        showComputerLayer = false
        showInternetLayer = false
        showBALayer = false
        break
      case 2:
        showPointsBufferLayer = false
        showCompositeLayer = false
        showMedianIncomeLayer = false
        showMeanIncomeLayer = false
        showComputerLayer = false
        showInternetLayer = false
        showBALayer = false
        break
      case 3:
        showCompositeLayer = false
        showPointsBufferLayer = false
        showMedianIncomeLayer = true
        showMeanIncomeLayer = false
        showComputerLayer = false
        showInternetLayer = false
        showBALayer = false
        break
      case 4:
        showCompositeLayer = false
        showPointsBufferLayer = false
        showMedianIncomeLayer = false
        showMeanIncomeLayer = false
        showComputerLayer = false
        showInternetLayer = false
        showBALayer = true
        break

      case 5:
        showCompositeLayer = false
        showPointsBufferLayer = false
        showMedianIncomeLayer = false
        showMeanIncomeLayer = false
        showComputerLayer = true
        showInternetLayer = false
        showBALayer = false
        break

      case 6:
        showCompositeLayer = false
        showPointsBufferLayer = false
        showMedianIncomeLayer = false
        showMeanIncomeLayer = false
        showComputerLayer = false
        showInternetLayer = true
        showBALayer = false
        break

      case 7:
        showCompositeLayer = false
        showPointsBufferLayer = true
        showMedianIncomeLayer = false
        showMeanIncomeLayer = false
        showComputerLayer = false
        showInternetLayer = false
        showBALayer = false
        break

      case 8:
        showCompositeLayer = true
        showPointsBufferLayer = false
        showMedianIncomeLayer = false
        showMeanIncomeLayer = false
        showComputerLayer = false
        showInternetLayer = false
        showBALayer = false
        break

      default:
    }
  }

  // performing joins on csv data so theyre useful in the map

  // const csvDataMap = new Map(education_csv.map(d => [d.GEOID, d]))
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
  let compinter = []
  let ba = []

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
    compinter = rewind(compinter_raw, true).features
    ba = rewind(education_raw, true).features
  }

  //render buffers
  export let bufferRadius = 1
  $: redrawBuffer(bufferRadius)

  /**
   * redraws buffer on radius change
   * @param radius buffer radius value
   */
  function redrawBuffer(radius) {
    if (!isMounted) return //rewind functions dies on pre-render
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

  const computerValues = compinter_raw.features.map(feature => {
    return parseFloat(feature.properties.computerValue)
  })

  const internetValues = compinter_raw.features.map(feature => {
    return parseFloat(feature.properties.internetValue)
  })

  // const BAplus = education_raw.features.map(feature => {
  //   if (
  //     feature.properties.K_BA_HGR !== null &&
  //     feature.properties.P_BA_HGR === null
  //   ) {
  //     return parseInt(feature.properties.K_BA_HGR)
  //   } else if (
  //     feature.properties.K_BA_HGR === null &&
  //     feature.properties.P_BA_HGR !== null
  //   ) {
  //   }
  //   return parseInt(feature.properties.P_BA_HGR)
  // })

  const baValues = education_raw.features.map(feature => {
    return parseFloat(feature.properties.BAplusnum)
  })

  // const geoid = education_raw.features.map(feature => {
  //   return parseFloat(feature.properties.GEOID20)
  // })

  // turning these values into a csv to combine with my own censustracts data

  // const combinedData = BAplus.map((value, index) => [geoid[index], value])

  // combinedData.unshift(['GEOID', 'BAplus'])
  // const csv = combinedData.map(row => row.join(',')).join('\n')

  // console.log(csv)

  // oh boy here we go again
  // const filteredFeatures = education_raw.features.filter(feature => {
  //   const BAplus = feature.properties.BAplusnum
  //   return BAplus !== null && BAplus !== undefined && BAplus !== ''
  // })

  // const filteredMeanMedianRaw = {
  //   ...education_raw,
  //   features: filteredFeatures,
  // }

  // console.log(JSON.stringify(filteredMeanMedianRaw))

  // update json with value properties
  // const withUpdValues = education_raw.features.map((feature, index) => {
  //   const BAplusnum = BAplus[index]
  //   return {
  //     ...feature,
  //     properties: {
  //       ...feature.properties,
  //       BAplusnum: BAplusnum,
  //     },
  //   }
  // })

  // const updatedFile = {
  //   ...education_raw,
  //   features: withUpdValues,
  // }

  // console.log(JSON.stringify(updatedFile))

  // const pCompositeValues = pComposite_raw.features.map(feature => {
  //   return parseFloat(feature.properties.properties.compositeValue)
  // })

  //const choroRange = [d3.min(compositeValues), d3.max(compositeValues)]
  // const pchoroRange = [d3.min(pCompositeValues), d3.max(pCompositeValues)]

  //console.log(choroRange)
  const colorDefault = ['#6e6e6e', '#969696', '#bababa', '#dddddd', '#ffffff']
  const colorHighContrast = [
    '#2b2b2b',
    '#353d41',
    '#3a5056',
    '#3c616c',
    '#397381',
    '#308497',
    '#1995ae',
  ]
  export let isHighContrast = false
  let colorArr = colorDefault
  $: colorArr = isHighContrast ? colorHighContrast : colorDefault
  //let colorScale = d3.scaleQuantile().domain(compositeValues).range(colorArr)

  function colorScale(value, scaleValues, colorArray) {
    const scale = d3.scaleQuantile().domain(scaleValues).range(colorArray)
    return scale(value)
  }

  // const meancolorScale = d3.scaleQuantile().domain(meanValues).range(colorArr)

  // const mediancolorScale = d3
  //   .scaleQuantile()
  //   .domain(medianValues)
  //   .range(colorArr)

  // const compcolorScale = d3
  //   .scaleQuantile()
  //   .domain(computerValues)
  //   .range(colorArr)

  // const intercolorScale = d3
  //   .scaleQuantile()
  //   .domain(internetValues)
  //   .range(colorArr)

  // const bacolorScale = d3.scaleQuantile().domain(baValues).range(colorArr)

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
            fill={colorScale(
              feature.properties.properties.meanValue,
              meanValues,
              colorArr,
            )}
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
            fill={colorScale(
              feature.properties.properties.medianValue,
              medianValues,
              colorArr,
            )}
            in:fade={{ duration: 400 }}
            out:fade={{ duration: 400 }}
          />
        {/each}
      </g>
    {/if}

    {#if showComputerLayer}
      <g class="choropleth">
        {#each compinter as feature, i}
          <path
            d={path(feature)}
            fill={colorScale(
              feature.properties.computerValue,
              computerValues,
              colorArr,
            )}
            in:fade={{ duration: 400 }}
            out:fade={{ duration: 400 }}
          />
        {/each}
      </g>
    {/if}

    {#if showInternetLayer}
      <g class="choropleth">
        {#each compinter as feature, i}
          <path
            d={path(feature)}
            fill={colorScale(
              feature.properties.internetValue,
              internetValues,
              colorArr,
            )}
            in:fade={{ duration: 400 }}
            out:fade={{ duration: 400 }}
          />
        {/each}
      </g>
    {/if}

    {#if showBALayer}
      <g class="choropleth">
        {#each ba as feature, i}
          <path
            d={path(feature)}
            fill={colorScale(feature.properties.BAplusnum, baValues, colorArr)}
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
            fill={colorScale(
              feature.properties.properties.compositeValue || 0,
              compositeValues,
              colorArr,
            )}
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
