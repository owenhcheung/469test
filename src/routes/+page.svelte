<div class="container mx-auto flex justify-center">
    <h1>test</h1>

    <svg width="100" height="100">
        <path
          fill="cornflowerblue"
          d={arcPath}
          style="transform: translate(50%, 50%)"
        />
    </svg>

    

    
</div>

<script>
    import * as d3 from "d3";

    const arcPathGenerator = d3.arc()
        .innerRadius(25)
        .outerRadius(40)
        .startAngle(0)
        .endAngle(5.5)
        .padAngle(0)
        .cornerRadius(20)
    const arcPath = arcPathGenerator()

</script>