
<script>
	import * as d3 from 'd3';
  import { onMount } from 'svelte';
	import { geoPath, geoAlbersUsa } from 'd3-geo';

	// importing data

	import libraries from '../data/kingpierce_libraries.csv';
	//console.log(libraries);
	import censustracts_raw from '../data/wa_censustracts.geojson?raw';
	//console.log(censustracts_raw);
	import counties_raw from '../data/wa_counties.geojson?raw';
	//console.log(counties_raw);	

	let censustracts = JSON.parse(counties_raw);

	let map
	let svg;
	let w;
	let h;

	let projection = d3.geoMercator()
			.fitSize([w, h], censustracts);

	$: init(w,h)

	function init(width, height) {
		svg = d3.select(map)
      //.append("svg")
      .attr("width", width)
      .attr("height", height);

		projection = d3.geoMercator()
			.fitSize([w, h], censustracts);

	}

	onMount(() => {
		projection = d3.geoMercator()
			.fitSize([w, h], censustracts);

		let path = d3.geoPath()
			.projection(projection);

  	svg = d3.select(map)
      .append("svg")
      .attr("width", w)
      .attr("height", h);

		svg.selectAll("path")
			.data(censustracts.features)
			.enter()
			.append("path")
			.attr("d", path);
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