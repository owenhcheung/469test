
<script>
	import * as d3 from 'd3';
	import * as turf from '@turf/turf';
  import { onMount } from 'svelte';
	import * as rewind from '@mapbox/geojson-rewind';

	// importing data

	import libraries from '../data/kingpierce_libraries.csv';
	//console.log(libraries);
	import censustracts_raw from '../data/wa_censustracts.geojson?raw';
	//console.log(censustracts_raw);
	import counties_raw from '../data/wa_counties.geojson?raw';
	//console.log(counties_raw);	

	let censustracts = JSON.parse(censustracts_raw);
	let counties = JSON.parse(counties_raw);
	//console.log(counties);
	counties.features = counties.features.filter(d => (d.properties.County == "King County" || d.properties.County == "Pierce County"))
	//console.log(kingpierce)
	//let newcounties = {...counties, features: kingpierce}
	//console.log(newcounties)

	let map
	let svg;
	let w;
	let h;
	let projection;
	let library_buffer;

	let libraries_geojson = { type: "FeatureCollection", features: [] };
  libraries.forEach(function(d) {
    let feature = {
      type: "Feature",
        properties: d,
        geometry: {
          type: "Point",
          coordinates: [parseFloat(d.Long), parseFloat(d.Lat)]
        }
      };
			libraries_geojson.features.push(feature);
  });

	//console.log(libraries_geojson)

	$: onScreenChange(w,h)

	function onScreenChange(width, height) {
		svg = d3.select(map)
      .attr("width", width)
      .attr("height", height);

		projection = d3.geoMercator()
			.fitSize([width - 150, height], counties);

		//console.log(w, h);
	}

	onMount(() => {
		projection = d3.geoMercator()
			.fitSize([w - 150, h], counties);

		let path = d3.geoPath()
			.projection(projection);
		let path2 = d3.geoPath()
			.projection(projection);

		let path3 = d3.geoPath()
			.projection(projection);

  	svg = d3.select(map)
      .append("svg")
			//.attr("preserveAspectRatio", "xMinYMin meet")
      .attr("width", w)
      .attr("height", h)

		svg.selectAll("path")
			.data(counties.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("fill", "none")
			.style("stroke", "#000")
			.attr("stroke-width", 1.3)

		svg.selectAll("path")
			.data(censustracts.features)
			.enter()
			.append("path")
			.attr("d", path2)
			.style("fill", "none")
			.attr("stroke-width", 1.3)
			.style("opacity", 0.1)
  		.style("stroke", "#000");

		svg.selectAll("circle")
			.data(libraries)
			.enter().append("circle")
			.attr("cx", function(d) { return projection([d.Long, d.Lat])[0]; })
			.attr("cy", function(d) { return projection([d.Long, d.Lat])[1]; })
			.attr("r", 3)
			.style("fill", "#000");

		library_buffer = turf.buffer(libraries_geojson, 1, { units: 'miles' });
		let rewound_buffer = rewind(library_buffer, true);

		svg.selectAll(".buffer")
      .data(rewound_buffer.features)
      .enter()
			.append("path")
      .attr("class", "buffer")
      .attr("d", path3)
      .style("stroke", "#000")
      .style("stroke-width", 1.3)
      .style("fill", "#000")
			.style("fill-opacity", "20%");

	});

</script>

<div class="h-screen w-screen flex">
  <div bind:this={map} class="w-3/5 h-full p-5 flex items-center" bind:clientWidth={w} bind:clientHeight={h}>
		<!-- map -->
  </div>
  <div class="w-2/5 h-full bg-gray-200 flex items-center justify-center p-5">
    <div>
      <h2 class="text-4xl font-bold mb-4">An Understanding of the Digital Access Divide Outside of Seattle</h2>
      <p class="text-lg pb-10">by Owen Cheung, Shirley Hu, Truong Le, Jason Lim</p>
      <p class="text-lg">
				How well does the public library system serve households with limited broadband access?
			</p>
    </div>
  </div>
</div>

<!-- <style>
	.svg-container {
		display: inline-block;
		position: relative;
		width: 100%;
		padding-bottom: 100%; /* aspect ratio */
		vertical-align: top;
		overflow: hidden;
	}
	.svg-content-responsive {
		display: inline-block;
		position: absolute;
		top: 10px;
		left: 0;
	}
</style> -->