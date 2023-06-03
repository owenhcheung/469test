<script>
  //import Article from '../lib/Article.svelte'
  import Scrolly from '../lib/Scrolly.svelte'
  import { fade } from 'svelte/transition'
  const LoadMap = import('../lib/Map.svelte').then(({ default: C }) => C)
  let showMap = false

  let bufferRadius = 1
  let showPointsBufferLayer = false

  let showCompositeLayer = false
  let showMeanIncomeLayer = false
  let showMedianIncomeLayer = false
  let showBachLayer = false
  let showHSLayer = false
  let showComputerLayer = false
  let showInternetLayer = false
  let showBALayer = false
  let isHighContrast = false
  let toggletable = false

  let step

  function togglePointsBufferLayer() {
    // showPointsBufferLayer = event.target.checked
    showPointsBufferLayer = !showPointsBufferLayer
    // dispatch('togglePointsBufferLayer', showPointsBufferLayer)
  }

  function toggleCompositeLayer() {
    showCompositeLayer = !showCompositeLayer
    showMeanIncomeLayer = false
    showMedianIncomeLayer = false
    showComputerLayer = false
    showInternetLayer = false
    showBALayer = false
    // dispatch('toggleCompositeLayer', showCompositeLayer)
  }

  function toggleMeanIncomeLayer() {
    showMeanIncomeLayer = !showMeanIncomeLayer
    showCompositeLayer = false
    showMedianIncomeLayer = false
    showComputerLayer = false
    showInternetLayer = false
    showBALayer = false
  }

  function toggleMedianIncomeLayer() {
    showMedianIncomeLayer = !showMedianIncomeLayer
    showCompositeLayer = false
    showMeanIncomeLayer = false
    showComputerLayer = false
    showInternetLayer = false
    showBALayer = false
  }

  function toggleComputerLayer() {
    showComputerLayer = !showComputerLayer
    showCompositeLayer = false
    showMeanIncomeLayer = false
    showMedianIncomeLayer = false
    showInternetLayer = false
    showBALayer = false
  }

  function toggleInternetLayer() {
    showInternetLayer = !showInternetLayer
    showCompositeLayer = false
    showMeanIncomeLayer = false
    showMedianIncomeLayer = false
    showComputerLayer = false
    showBALayer = false
  }

  function toggleBALayer() {
    showBALayer = !showBALayer
    showCompositeLayer = false
    showMeanIncomeLayer = false
    showMedianIncomeLayer = false
    showComputerLayer = false
    showInternetLayer = false
  }
</script>

<div class="h-screen w-screen flex overflow-hidden">
  <div class="w-3/5 relative">
    {#await LoadMap}
      <div
        class="flex justify-center items-center w-full h-full bg-slate-100 absolute"
        transition:fade={{ duration: 1000 }}
      >
        <div class="loader" />
      </div>
    {:then Map}
      <Map
        bind:bufferRadius
        bind:showPointsBufferLayer
        bind:showCompositeLayer
        bind:showMeanIncomeLayer
        bind:showMedianIncomeLayer
        bind:showComputerLayer
        bind:showInternetLayer
        bind:showBALayer
        bind:isHighContrast
        {step}
      />
    {/await}
  </div>

  <div class="w-2/5 p-5 overflow-y-auto">
    <!-- article header -->
    <!-- mt-[40vh] mb-[20vh] -->

    <!-- article content -->
    <!-- <article>
      <Article bind:step />
    </article> -->

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
            ><span class="bg-lime-300">Skip to Playground-></span></a
          >
        </div>
      </section>

      <section class="mt-40 mb-20">
        <p class="text-2xl mb-5">Project overview</p>
        <p class="mb-5 max-w-prose">
          <a
            href="https://interconnection.org/"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-sky-300">InterConnection</a
          >, is a 501(c)3 non-profit organization based in Seattle, WA focused
          on making information + communication technology accessible to
          underserved communities.
        </p>
        <p class="mb-20 max-w-prose">
          For this project, we were tasked by InterConnection to investigate the
          <a
            href="https://www.britannica.com/topic/digital-divide"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-purple-300">digital access divide</a
          > outside of Seattle. They aim to bridge the digital divide by providing
          devices such as computers + laptops as well as affordable internet options
          for households that lack those resources. InterConnection believes that
          much of the population that was previously served by the organization have
          moved outside of the immediate vicinity of Seattle and into surrounding
          areas.
        </p>
        <p class="text-xl max-w-prose mb-20">
          So the question is... <span
            class="italic underline underline-offset-2 decoration-2">where</span
          >?
        </p>
        <p class="max-w-prose">
          To answer this, we collected + compiled data -> created visualizations
          highlighting areas more heavily impacted by the digital access divide.
          We hope this might help InterConnection gain better insight into
          exactly where their target communities have moved to.
        </p>
      </section>

      <div class="flex justify-center">
        <hr class="w-1/3 h-[1px] border-t-0 bg-black" />
      </div>

      <section class="mt-20">
        <p class="text-2xl pb-5">Research</p>

        <p class="max-w-prose">
          Through our research, we determined several important variables used
          to pinpoint underserved communities in Pierce and King County:
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
          > by the Pew Research Center, individuals with an income of 100K or more
          a year were almost 50% more likely to have access to a desktop/laptop and
          internet, compared to somebody with a lower income (0 - 30K a year).
        </p>
        <p class="mb-5 max-w-prose">
          We identified a large gap in median income levels within the Southern
          part of King County/Central to Southwest Pierce County. Specifically,
          we see these gaps in the SeaTac, Kent, Auburn, Federal Way, Tacoma,
          Lakewood, and Steilacoom regions.
        </p>
      </section>

      <section
        class="my-20 border rounded p-5"
        class:border-black={showBALayer}
      >
        <p class="text-xl pb-5">Education</p>

        <p class="mb-5 max-w-prose">
          In terms of education, we reason that an individual with access to
          higher education is more likely to have the digital literacy and
          resources to have sufficient broadband/devices at home compared to
          those without.
        </p>
        <p class="mb-5 max-w-prose">
          We identified a gap in areas where people pursued higher education
          specifically in our areas of focus; Pierce + South King County.
        </p>
      </section>

      <section
        class="my-20 border rounded p-5"
        class:border-black={showComputerLayer}
      >
        <p class="text-xl pb-5">Computer Access</p>

        <p class="mb-5 max-w-prose">
          We looked into the percentage of households in each census tract
          without any kind of computer access at home. The average percentage of
          households without a computer in Washington state was 4.19% in 2021.
        </p>
        <p class="mb-5 max-w-prose">
          Note darker regions south of Seattle and east of Tacoma.
        </p>
      </section>

      <section
        class="my-20 border rounded p-5"
        class:border-black={showInternetLayer}
      >
        <p class="text-xl pb-5">Internet Access</p>

        <p class="mb-5 max-w-prose">
          Similarly, we also looked into the percentage of households without
          any internet access as of 2021. For comparison, the average percentage
          of households without access to any computer for Washington state was
          5.99%. Thus, any higher values would be areas of interest for
          outreach. The darker census tracts are important to focus on, with
          some areas having nearly 15% of the total number of households without
          internet access.
        </p>
      </section>

      <section class="my-20">
        <p class="mb-20 max-w-prose">
          We also explored options for locations that people might choose to
          access public wifi. <span class:text-pink-500={showPointsBufferLayer}
            >Here are all the public libary locations within King and Pierce
            County with a {bufferRadius} mile radius.</span
          >
        </p>

        <p class="text-xl max-w-prose mb-20">
          But how can we synthesize this information?
        </p>
      </section>

      <section class="mb-20">
        <p id="index-ex" class="mb-5 max-w-prose">
          A composite index is a tool that allows us to combine multiple
          variables into a single metric to help us determine which areas
          experience inaccessibility to digital devices and the internet.
        </p>
        <p id="index-ex" class="mb-10 max-w-prose">
          We created a composite index of the <b
            >income level, percent of households without access to any laptop or
            computer and households without an internet subscription</b
          >. The values mean that these areas have lower than average values
          (for example, the average income level per household in the county)
          for each of the three variables. Below we have included the 10 census
          tracts in
          <u>ascending order</u> with the lowest composite index values. The data
          we used to calculate these values are from the U.S. Census Bureau for the
          year 2021.
        </p>

        <!-- pierce composite table -->
        <table class="w-full table-fixed mb-10">
          <tr>
            <th class="bg-slate-100 border text-left px-8 py-4"
              >Census Tract (Pierce)</th
            >
            <th class="bg-slate-100 border text-left px-8 py-4"
              >Approx. Location</th
            >
            <th class="bg-slate-100 border text-left px-8 py-4"
              >Composite Value</th
            >
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
              >Area bordered by N 17th Street and N Pearl Street, west of Silas
              High School (Tacoma)</td
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
              >West of McChord Field, east of Ponders Corner neighborhood
              (Lakewood)</td
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
        <table class="w-full table-fixed">
          <tr>
            <th class="bg-slate-100 border text-left px-8 py-4"
              >Census Tract (King)</th
            >
            <th class="bg-slate-100 border text-left px-8 py-4"
              >Approx. Location</th
            >
            <th class="bg-slate-100 border text-left px-8 py-4"
              >Composite Value</th
            >
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
            <td class="border px-8 py-4"
              >West of West Valley Highway (Auburn)</td
            >
            <td class="border px-8 py-4">-2.699</td>
          </tr>
          <tr>
            <td class="border px-8 py-4">53033030501</td>
            <td class="border px-8 py-4"
              >Area surrounding Christopher (Auburn)</td
            >
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
              >Immediately east of the Seattle-Tacoma International Airport
              (SeaTac)</td
            >
            <td class="border px-8 py-4">-2.332</td>
          </tr>
          <tr>
            <td class="border px-8 py-4">53033029206</td>
            <td class="border px-8 py-4"
              >O'Brien region, north of Kent (Kent)</td
            >
            <td class="border px-8 py-4">-2.291</td>
          </tr>
        </table>
      </section>
    </Scrolly>

    <div class="flex justify-center">
      <hr class="w-1/3 h-[1px] border-t-0 bg-black" />
    </div>

    <!-- buttons -->
    <p class="text-2xl pb-5 mt-20">Playground</p>
    <div
      id="buttons"
      class="border border-dashed p-5 rounded-md border-slate-300 mb-10"
    >
      <div class="flex align-middle mb-10">
        <p class="text-lg mr-3">High Contrast Colors</p>
        <input
          type="checkbox"
          id="switch"
          bind:checked={isHighContrast}
        /><label for="switch">Toggle</label>
      </div>
      <!-- <p class="text-2xl pb-5">Layers</p> -->
      <button
        class="p-5 mb-5 mr-5 rounded border text-left"
        on:click={toggleCompositeLayer}
        class:border-black={showCompositeLayer}
      >
        <p class="text-lg">Composite index</p>
      </button>

      <button
        class="p-5 mb-5 mr-5 rounded border text-left"
        on:click={toggleMedianIncomeLayer}
        class:border-black={showMedianIncomeLayer}
      >
        <p class="text-lg">Median Income</p>
      </button>

      <button
        class="p-5 mb-5 mr-5 rounded border text-left hidden"
        on:click={toggleMeanIncomeLayer}
        class:border-black={showMeanIncomeLayer}
      >
        <p class="text-lg">Mean Income</p>
      </button>

      <button
        class="p-5 mb-5 mr-5 rounded border text-left"
        on:click={toggleComputerLayer}
        class:border-black={showComputerLayer}
      >
        <p class="text-lg">% No Computer</p>
      </button>

      <button
        class="p-5 mb-5 mr-5 rounded border text-left"
        on:click={toggleInternetLayer}
        class:border-black={showInternetLayer}
      >
        <p class="text-lg">% No Internet</p>
      </button>

      <button
        class="p-5 mb-5 mr-5 rounded border text-left"
        on:click={toggleBALayer}
        class:border-black={showBALayer}
      >
        <p class="text-lg">Bachelors Degree+</p>
      </button>

      <button
        class="p-5 w-4/5 rounded border text-left mr-5"
        on:click={togglePointsBufferLayer}
        class:border-black={showPointsBufferLayer}
      >
        <p class="text-lg pb-3">
          Public libraries +
          <span class="bg-cyan-700 bg-opacity-20 px-2 py-1 rounded-sm"
            >{bufferRadius} mile radius</span
          >
        </p>
        <input
          id="buffer-radius"
          type="range"
          min="1"
          max="5"
          bind:value={bufferRadius}
          on:mousedown={() => {
            if (!showPointsBufferLayer) showPointsBufferLayer = true
          }}
          class="w-full h-2 cursor-pointer appearance-none rounded-full bg-slate-200"
          on:click|stopPropagation
        />
      </button>
    </div>
  </div>
</div>

<style>
  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background-color: #000000;
    border-radius: 1rem;
    height: 1rem;
    width: 1rem;
  }
  .loader {
    width: 30px;
    height: 30px;
    border: 4px solid #cbd5e1;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 0.8s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  input[type='checkbox'] {
    height: 0;
    width: 0;
    visibility: hidden;
  }

  label {
    cursor: pointer;
    text-indent: -9999px;
    width: 48px;
    height: 26px;
    background: #000;
    display: block;
    border-radius: 100px;
    position: relative;
  }

  label:after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 22px;
    height: 22px;
    background: #fff;
    border-radius: 50%;
    transition: 0.3s;
  }

  /* input:checked + label {
    background: #000;
  } */

  input:checked + label:after {
    left: calc(100% - 2px);
    transform: translateX(-100%);
  }

  .title {
    margin-top: 35vh;
    margin-bottom: 20vh;
  }
</style>
