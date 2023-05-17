<script>
	import { onMount, afterUpdate } from "svelte";
	import * as d3 from "d3";
	import * as turf from "@turf/turf";
	import { get } from "svelte/store";
	import * as rewind from "@mapbox/geojson-rewind";
	import Slider from "@bulatdashiev/svelte-slider";

	import libraries from "../data/kingpierce_libraries.csv";
	import censustracts_raw from "../data/wa_censustracts_edit.geojson?raw";
	import counties_raw from "../data/wa_counties.geojson?raw";
	import composite from "../data/kingpierce_composite.csv";

	let censustracts = JSON.parse(censustracts_raw);

	let counties = JSON.parse(counties_raw);
	counties.features = counties.features.filter(
		(feature) =>
			feature.properties.County == "King County" ||
			feature.properties.County == "Pierce County"
	);

	let map;
	let svg;
	let w;
	let h;
	let projection;
	let library_buffer;

	export let value = 1;

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
	const libraries_geojson = {
		type: "FeatureCollection",
		features: library_convert,
	};

	let redrawMap = () => {
		if (svg) {
			svg.remove();
		}

		projection = d3.geoMercator().fitSize([w - 150, h], counties);
		const path = d3.geoPath().projection(projection);

		svg = d3.select(map).append("svg").attr("width", "100%").attr("height", h);

		svg
			.selectAll("path.counties")
			.data(counties.features)
			.enter()
			.append("path")
			.attr("class", "counties")
			.attr("d", path)
			.style("fill", "none")
			.style("stroke", "#000")
			.attr("stroke-width", 1.3);

		const rewound_ct = rewind(censustracts, true);

		svg
			.selectAll("path.censustracts")
			.data(rewound_ct.features)
			.enter()
			.append("path")
			.attr("class", "censustracts")
			.attr("d", path)
			.style("fill", "none")
			.attr("stroke-width", 1.3)
			.style("opacity", 0.1)
			.style("stroke", "#000");

		library_buffer = turf.buffer(libraries_geojson, value, {
			units: "miles",
		});
		const rewound_buffer = rewind(library_buffer, true);

		svg
			.selectAll(".buffer")
			.data(rewound_buffer.features)
			.enter()
			.append("path")
			.attr("class", "buffer")
			.attr("d", path)
			.style("fill", "#fc8421")
			.style("fill-opacity", "20%");

		svg
			.selectAll("circle")
			.data(libraries)
			.enter()
			.append("circle")
			.attr("cx", (d) => projection([d.Long, d.Lat])[0])
			.attr("cy", (d) => projection([d.Long, d.Lat])[1])
			.attr("r", 3)
			.style("fill", "#000");
	};

	onMount(() => {
		redrawMap();
	});

	afterUpdate(() => {
		redrawMap();
	});
</script>

<div class="h-screen w-screen flex">
	<div
		bind:this={map}
		class="w-3/5 h-full p-5 flex items-center"
		bind:clientWidth={w}
		bind:clientHeight={h}
	>
		<!-- map -->
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
				<span class="">{value} mile</span>
				radius?
			</p>
			<input
				id="buffer-radius"
				type="range"
				min="1"
				max="5"
				bind:value
				class="w-4/5 h-2 cursor-pointer rounded-lg border-none bg-neutral-200"
			/>
		</div>
	</div>
</div>
