<script>
	import { onMount, afterUpdate } from "svelte";
	import * as d3 from "d3";
	import * as turf from "@turf/turf";
	import * as rewind from "@mapbox/geojson-rewind";
	import Slider from "@bulatdashiev/svelte-slider";
	import { geoMercator, geoPath } from "d3-geo";
	import libraries from "../data/kingpierce_libraries.csv";
	import censustracts_raw from "../data/wa_censustracts_edit_compress.json";
	import counties_raw from "../data/wa_counties_compress.json";
	import composite_king from "../data/king_composite.csv";
	import composite_pierce from "../data/pierce_composite.csv";
	import { draw, fade } from "svelte/transition";

	//convert data into buffer readable format
	const library_convert = libraries.map((feature) => {
		return {
			type: "Feature",
			properties: feature,
			geometry: {
				type: "Point",
				coordinates: [parseFloat(feature.Long), parseFloat(feature.Lat)],
			},
		};
	});

	//did component load?
	let isLoaded = false;

	//map width and height
	let w = 850;
	let h = 937;

	//debounce to reduce # of renders
	let debouncedDimensions = { w, h };
	let timeoutHandle;
	$: {
		clearTimeout(timeoutHandle);
		timeoutHandle = setTimeout(() => {
			debouncedDimensions = { w, h };
		}, 15);
	}

	//projection and path engine from d3. re-render when debouncedDimensions fires
	$: projection = geoMercator().fitSize(
		[debouncedDimensions.w - 150, debouncedDimensions.h],
		counties_raw
	);
	$: path = geoPath().projection(projection);

	//datapoints
	let censustracts = [];
	let counties = [];
	let buffer = [];
	let points = [];

	/**
	 * initialize d3 map. populate datapoints from files
	 */
	function initMap() {
		debouncedDimensions = { w, h };
		censustracts = rewind(censustracts_raw, true).features;
		counties = counties_raw.features;
		points = libraries;
		redrawBuffer(bufferRadius);
	}

	//render buffers
	let bufferRadius = 1;
	$: redrawBuffer(bufferRadius);

	/**
	 * redraws buffer on radius change
	 * @param radius buffer radius value
	 */
	function redrawBuffer(radius) {
		if (!isLoaded) return; //redwind functions shits on itself on pre-render
		const library_buffer = turf.buffer(
			{
				type: "FeatureCollection",
				features: library_convert,
			},
			radius,
			{
				units: "miles",
			}
		);
		buffer = rewind(library_buffer, true).features;
	}

	onMount(() => {
		isLoaded = true;
		initMap();
	});
</script>

<div class="h-screen w-screen flex">
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
			<g class="buffer">
				{#each buffer as feature, i}
					<path d={path(feature)} in:fade={{ delay: i * 15, duration: 200 }} />
				{/each}
			</g>
			<g class="">
				{#each points as point, i}
					<circle
						cx={projection([point.Long, point.Lat])[0]}
						cy={projection([point.Long, point.Lat])[1]}
						r={3}
						in:fade={{ delay: i * 15, duration: 200 }}
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
		fill: #fc8421;
		fill-opacity: 20%;
	}
</style>
