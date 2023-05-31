<script>
  import Scrolly from './Scrolly.svelte'
  export let step
</script>

<Scrolly bind:value={step} class="snap-y">
  <section class="title flex justify-center items-center">
    <div class="">
      <h2 class="text-4xl font-bold mb-4">
        An Understanding of the Digital Access Divide Outside of Seattle
      </h2>
      <p class="text-lg mb-10">
        by Owen Cheung, Shirley Hu, Truong Le, Jason Lim
      </p>

      <a href="#buttons"><span class="bg-lime-300">Skip this→</span></a>
    </div>
  </section>

  <section class="my-60">
    <p class="text-2xl mb-5">Project overview</p>

    <p class="mb-10">
      We were asked by InterConnection, an organization based in Seattle,
      Washington, to investigate the digital access divide outside of the city
      of Seattle. InterConnection aims to bridge the digital gap through
      providing devices such as computers and laptops as well as affordable
      internet options for households without them. They mentioned that much of
      the population they have focused their efforts on has moved outside of the
      immediate city of Seattle and into the surrounding areas such as Pierce
      County and some parts of south King County.
    </p>
  </section>
  <section class="my-60">
    <p class="text-2xl pb-5">Research</p>

    <p class="mb-5">
      Our research investigated the digital divide outside of the city of
      Seattle. We focused our research and data collection on the neighboring
      counties of Pierce County and south of King County (specifically the
      regions bounded by Kent, Federal Way and Auburn). We determined several
      important variables that will be used to analyze which areas of Washington
      need the most support:
    </p>
    <ul class="list-disc list-inside mb-5 ml-5">
      <li>Income level</li>
      <li>Devices per household</li>
      <li>Type of internet subscription</li>
      <li>Highest level of education</li>
    </ul>
    <p class="mb-5">
      As well as other miscellaneous factors such as the locations of <span
        class="bg-pink-300">public libraries</span
      > where people might go to access the internet.
    </p>
  </section>
  <section class="my-60">
    <p id="index-ex" class="mb-5">
      A composite index is a tool that allows us to combine multiple variables
      into a single metric to help us determine which areas experience
      inaccessibility to digital devices and the internet. 2021.
    </p>
    <p id="index-ex" class="mb-10">
      We created a composite index of the <b
        >income level, percent of households without access to any laptop or
        computer and households without an internet subscription</b
      >. The values mean that these areas have lower than average values (for
      example, the average income level per household in the county) for each of
      the three variables. Below we have included the 10 census tracts in
      <u>ascending order</u> with the lowest composite index values. The data we
      used to calculate these values are from the U.S. Census Bureau for the year
      2021.
    </p>

    <!-- pierce composite table -->
    <table class="w-full table-fixed mb-10 shadow-lg">
      <tr>
        <th class="bg-slate-100 border text-left px-8 py-4"
          >Census Tract (Pierce)</th
        >
        <th class="bg-slate-100 border text-left px-8 py-4">Composite Value</th>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053061601</td>
        <td class="border px-8 py-4">-2.719</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053061501</td>
        <td class="border px-8 py-4">-2.324</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053061002</td>
        <td class="border px-8 py-4">-2.293</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053940006</td>
        <td class="border px-8 py-4">-1.964</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053060907</td>
        <td class="border px-8 py-4">-1.914</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053061400</td>
        <td class="border px-8 py-4">-1.860</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053071901</td>
        <td class="border px-8 py-4">-1.851</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053063401</td>
        <td class="border px-8 py-4">-1.844</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053071806</td>
        <td class="border px-8 py-4">-1.775</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053071207</td>
        <td class="border px-8 py-4">-1.545</td>
      </tr>
    </table>

    <!-- king composite table -->
    <table class="w-full table-fixed mb-10 shadow-lg">
      <tr>
        <th class="bg-slate-100 border text-left px-8 py-4"
          >Census Tract (King)</th
        >
        <th class="bg-slate-100 border text-left px-8 py-4">Composite Value</th>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033009100</td>
        <td class="border px-8 py-4">-3.172</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033011001</td>
        <td class="border px-8 py-4">-2.825</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033030405</td>
        <td class="border px-8 py-4">-2.699</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033030501</td>
        <td class="border px-8 py-4">-2.683</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033029203</td>
        <td class="border px-8 py-4">-2.654</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033009200</td>
        <td class="border px-8 py-4">-2.626</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033023202</td>
        <td class="border px-8 py-4">-2.559</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033005304</td>
        <td class="border px-8 py-4">-2.492</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033028403</td>
        <td class="border px-8 py-4">-2.332</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033029206</td>
        <td class="border px-8 py-4">-2.291</td>
      </tr>
    </table>
  </section>
</Scrolly>

<style>
  .title {
    margin-top: 40vh;
    margin-bottom: 20vh;
  }
</style>
