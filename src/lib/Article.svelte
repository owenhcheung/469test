<script>
  import Scrolly from './Scrolly.svelte'
  export let step
  export let showMedianIncomeLayer
  export let showComputerLayer
  export let showInternetLayer
  export let showBALayer
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

      <p>
        <b>
          <a
            href="https://docs.google.com/presentation/d/1oyxXDbeUVrtLWODAWpIjtDSSj7NTdetf5fP8_rhkbX4/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer">Project Slide Deck</a
          >
        </b>
        |
        <b>
          <a
            href="https://docs.google.com/document/d/1sxy0_-VRlGmgmS90CSNflDL9IYobjSiHRnQtQ5AtcD4/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer">Full Report</a
          >
        </b>
      </p>
      <a href="#buttons"
        ><span class="bg-lime-300">Skip to playground-></span></a
      >
    </div>
  </section>

  <section class="my-40">
    <p class="text-2xl mb-5">Project overview</p>
    <p class="mb-5 max-w-prose">
      <a
        href="https://interconnection.org/"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-sky-300">InterConnection</a
      >, is a 501(c)3 non-profit organization based in Seattle, WA focused on
      making information + communication technology accessible to underserved
      communities.
    </p>
    <p class="mb-20 max-w-prose">
      For this project, we were tasked by InterConnection to investigate the
      <a
        href="https://www.britannica.com/topic/digital-divide"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-purple-300">digital access divide</a
      > outside of Seattle. They aim to bridge the digital divide by providing devices
      such as computers + laptops as well as affordable internet options for households
      that lack those resources. InterConnection believes that much of the population
      that was previously served by the organization have moved outside of the immediate
      vicinity of Seattle and into surrounding areas.
    </p>
    <p class="text-xl max-w-prose mb-20">
      So the question is... <span
        class="italic underline underline-offset-2 decoration-2">where</span
      >?
    </p>
    <p class="max-w-prose">
      To answer this, we collected + compiled data -> created visualizations
      highlighting areas more heavily impacted by the digital access divide. We
      hope this might help InterConnection gain better insight into exactly
      where their target communities have moved to.
    </p>
  </section>

  <section class="mt-40">
    <p class="text-2xl pb-5">Research</p>

    <p class="max-w-prose">
      Through our research, we determined several important variables used to
      pinpoint locations in Pierce and King County most in need of support:
    </p>
    <!-- <ul class="list-disc list-inside mb-5 ml-5">
      <li>Income level</li>
      <li>Devices per household</li>
      <li>Type of internet subscription</li>
      <li>Highest level of education</li>
    </ul>
    <p class="mb-5 max-w-prose">
      As well as other miscellaneous factors such as the locations of <span
        class="bg-pink-300">public libraries</span
      > where people might go to access the internet.
    </p> -->
  </section>

  <section
    class="my-20 border rounded p-5"
    class:border-black={showMedianIncomeLayer}
  >
    <p class="text-xl pb-5">Income</p>

    <p class="mb-5 max-w-prose">
      According to <a
        href="https://www.pewresearch.org/short-reads/2021/06/22/digital-divide-persists-even-as-americans-with-lower-incomes-make-gains-in-tech-adoption/"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-orange-300">this study</a
      > by the Pew Research Center, individuals with an income of 100K or more a
      year were almost 50% more likely to have access to a desktop/laptop and internet,
      compared to somebody with a lower income (0 - 30K a year).
    </p>
    <p class="max-w-prose">
      We identified a large gap in median income levels within the Southern part
      of King County/Central to Southwest Pierce County. Specifically, we see
      these gaps in the SeaTac, Kent, Auburn, Federal Way, Tacoma, Lakewood, and
      Steilacoom regions.
    </p>
  </section>

  <section class="my-20 border rounded p-5" class:border-black={showBALayer}>
    <p class="text-xl pb-5">Education</p>

    <p class="mb-5 max-w-prose">
      In terms of education, we reason that an individual with access to higher
      education is more likely to have the digital literacy and resources to
      have sufficient broadband/devices at home compared to those without.
    </p>
    <p class="mb-5 max-w-prose">
      We identified a gap in areas where people pursued higher education
      specifically in our areas of focus; Pierce + South King County.
    </p>
  </section>

  <section class="my-40">
    <p id="index-ex" class="mb-5 max-w-prose">
      A composite index is a tool that allows us to combine multiple variables
      into a single metric to help us determine which areas experience
      inaccessibility to digital devices and the internet. 2021.
    </p>
    <p id="index-ex" class="mb-10 max-w-prose">
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
        <th class="bg-slate-100 border text-left px-8 py-4">Approx. Location</th
        >
        <th class="bg-slate-100 border text-left px-8 py-4">Composite Value</th>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053061601</td>
        <td class="border px-8 py-4"
          >Just south of the Stadium district (Tacoma)</td
        >
        <td class="border px-8 py-4">-2.719</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053061501</td>
        <td class="border px-8 py-4"
          >Area surrounding Wright Park in Tacoma, west of the port</td
        >
        <td class="border px-8 py-4">-2.324</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053061002</td>
        <td class="border px-8 py-4"
          >Encompassing Tacoma Community College, slightly north of Fircrest
          (Tacoma)</td
        >
        <td class="border px-8 py-4">-2.293</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053940006</td>
        <td class="border px-8 py-4"
          >Near the neighborhood of Salishan and Swan Creek Park (Tacoma)</td
        >
        <td class="border px-8 py-4">-1.964</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053060907</td>
        <td class="border px-8 py-4"
          >Area bordered by N 17th Street and N Pearl Street, west of Silas High
          School (Tacoma)</td
        >
        <td class="border px-8 py-4">-1.914</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053061400</td>
        <td class="border px-8 py-4">G Street Neighborhood (Tacoma)</td>
        <td class="border px-8 py-4">-1.860</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053071901</td>
        <td class="border px-8 py-4"
          >Area near St. Clare Hospital and Clover Park (Lakewood)</td
        >
        <td class="border px-8 py-4">-1.851</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053063401</td>
        <td class="border px-8 py-4">Fern Hill neighborhood (Tacoma)</td>
        <td class="border px-8 py-4">-1.844</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053071806</td>
        <td class="border px-8 py-4"
          >West of McChord Field, east of Ponders Corner neighborhood (Lakewood)</td
        >
        <td class="border px-8 py-4">-1.775</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53053071207</td>
        <td class="border px-8 py-4">Pierce College area (Puyallup)</td>
        <td class="border px-8 py-4">-1.545</td>
      </tr>
    </table>

    <!-- king composite table -->
    <table class="w-full table-fixed shadow-lg">
      <tr>
        <th class="bg-slate-100 border text-left px-8 py-4"
          >Census Tract (King)</th
        >
        <th class="bg-slate-100 border text-left px-8 py-4">Approx. Location</th
        >
        <th class="bg-slate-100 border text-left px-8 py-4">Composite Value</th>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033009100</td>
        <td class="border px-8 py-4">International district (Seattle)</td>
        <td class="border px-8 py-4">-3.172</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033011001</td>
        <td class="border px-8 py-4">New Holly neighborhood (Seattle)</td>
        <td class="border px-8 py-4">-2.825</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033030405</td>
        <td class="border px-8 py-4">West of West Valley Highway (Auburn)</td>
        <td class="border px-8 py-4">-2.699</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033030501</td>
        <td class="border px-8 py-4">Area surrounding Christopher (Auburn)</td>
        <td class="border px-8 py-4">-2.683</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033029203</td>
        <td class="border px-8 py-4">Near the ShoWare Center (Kent)</td>
        <td class="border px-8 py-4">-2.654</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033009200</td>
        <td class="border px-8 py-4"
          >Seattle area, west of International District</td
        >
        <td class="border px-8 py-4">-2.626</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033023202</td>
        <td class="border px-8 py-4">Near Crossroads Park (Bellevue)</td>
        <td class="border px-8 py-4">-2.559</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033005304</td>
        <td class="border px-8 py-4">University District (Seattle)</td>
        <td class="border px-8 py-4">-2.492</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033028403</td>
        <td class="border px-8 py-4"
          >Immediately east of the Seattle-Tacoma International Airport (SeaTac)</td
        >
        <td class="border px-8 py-4">-2.332</td>
      </tr>
      <tr>
        <td class="border px-8 py-4">53033029206</td>
        <td class="border px-8 py-4">O'Brien region, north of Kent (Kent)</td>
        <td class="border px-8 py-4">-2.291</td>
      </tr>
    </table>
  </section>
</Scrolly>

<style>
  .title {
    margin-top: 35vh;
    margin-bottom: 20vh;
  }
</style>
