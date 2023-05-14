
<script>
	import * as d3 from 'd3';
  import { onMount } from 'svelte';
	import { draw } from 'svelte/transition';

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

	$: onScreenChange(w,h)

	function onScreenChange(width, height) {
		svg = d3.select(map)
      .attr("width", width)
      .attr("height", height);

		projection = d3.geoMercator()
			.fitSize([width - 150, height], counties);

		console.log(w, h);
	}

	onMount(() => {
		projection = d3.geoMercator()
			.fitSize([w - 150, h], counties);

		let path = d3.geoPath()
			.projection(projection);
		let path2 = d3.geoPath()
			.projection(projection);

  	svg = d3.select(map)
      .append("svg")
			//.attr("preserveAspectRatio", "xMinYMin meet")
      .attr("width", w)
      .attr("height", h);

			svg.selectAll("path")
			.data(counties.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("fill", "transparent")
			.style("stroke", "#000")
			.attr("stroke-width", 1.3)

		svg.selectAll("path")
			.data(censustracts.features)
			.enter()
			.append("path")
			.attr("d", path2)
			.style("fill", "transparent")
			.attr("stroke-width", 1.3)
			.style("opacity", 0.1)
  		.style("stroke", "#000");

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
      <p class="text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </div>
  </div>
</div>

<style>
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
</style>