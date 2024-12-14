async function fetchDefinition(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const info = await response.json();

    if (
      info[0] &&
      info[0].meanings &&
      info[0].meanings[0] &&
      info[0].meanings[0].definitions &&
      info[0].meanings[0].definitions[0]
    ) {
      const definition = info[0].meanings[0].definitions[0].definition;
      return definition ? definition : "No definition available";
    } else {
      return "No definition available";
    }
  } catch (error) {
    console.error("Error fetching word:", error);
    return [];
  }
}

function WordCloud(
  text,
  {
    size = (group) => group.length,
    word = (d) => d,
    marginTop = 0,
    marginRight = 0,
    marginBottom = 0,
    marginLeft = 0,
    width = 640,
    height = 400,
    maxWords = 250,
    fontFamily = "sans-serif",
    fontScale = 15,
    fill = "black",
    padding = 0,
    rotate = () => (Math.random() < 0.5 ? 0 : 90),
    invalidation,
  } = {}
) {
  const words =
    typeof text === "string" ? text.split(/\W+/g) : Array.from(text);
  const data = d3
    .rollups(words, size, (w) => w)
    .sort(([, a], [, b]) => d3.descending(a, b))
    .slice(0, maxWords)
    .map(([key, size]) => ({ text: word(key), size }));

  // Create the tooltip element
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "rgba(0, 0, 0, 0.7)")
    .style("color", "#fff")
    .style("padding", "5px")
    .style("border-radius", "5px");

  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("font-family", fontFamily)
    .attr("text-anchor", "middle")
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const g = svg
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const cloud = d3.layout
    .cloud()
    .size([width, height])
    .words(data)
    .padding(padding)
    .rotate(rotate)
    .font(fontFamily)
    .fontSize((d) => Math.sqrt(d.size) * fontScale)
    .on("end", (words) => {
      words.forEach(({ size, x, y, rotate, text }) => {
        const wordElement = g
          .append("text")
          .attr("font-size", size)
          .attr("fill", fill)
          .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
          .text(text);

        wordElement
          .on("mouseover", async function (event) {
            const definition = await fetchDefinition(text);
            tooltip.style("visibility", "visible").text(definition);
            d3.select(this).attr("fill", "orange");
          })
          .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
            d3.select(this).attr("fill", fill);
          })
          .on("mousemove", function (event) {
            tooltip
              .style("top", `${event.pageY + 10}px`)
              .style("left", `${event.pageX + 10}px`);
          });
      });
    });

  cloud.start();
  invalidation && invalidation.then(() => cloud.stop());
  return svg.node();
}
