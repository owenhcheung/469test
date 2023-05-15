<script>
	import * as d3 from "d3";
	import * as turf from "@turf/turf";
	import { onMount } from "svelte";
	import * as rewind from "@mapbox/geojson-rewind";

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

	onMount(() => {
		projection = d3.geoMercator().fitSize([w - 150, h], counties);
		const path = d3.geoPath().projection(projection);

		svg = d3
			.select(map)
			.append("svg")
			//.attr("preserveAspectRatio", "xMinYMin meet")
			.attr("width", w)
			.attr("height", h);

		svg
			.selectAll("path")
			.data(counties.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("fill", "none")
			.style("stroke", "#000")
			.attr("stroke-width", 1.3);

		svg
			.selectAll("path")
			.data(censustracts.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("fill", "none")
			.attr("stroke-width", 1.3)
			.style("opacity", 0.1)
			.style("stroke", "#000");

		library_buffer = turf.buffer(libraries_geojson, 1, { units: "miles" });
		const rewound_buffer = rewind(library_buffer, true);

		svg
			.selectAll(".buffer")
			.data(rewound_buffer.features)
			.enter()
			.append("path")
			.attr("class", "buffer")
			.attr("d", path)
			//.style("stroke", "#000")
			//.style("stroke-width", 1.3)
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
			<p class="text-lg">
				How well does the public library system serve households with limited
				broadband access?
			</p>
		</div>
	</div>
</div>
