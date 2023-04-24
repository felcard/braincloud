import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

const Test = (words) => {
  if (Object.keys(words).length === 0)
    words = [{ text: "NO WORDS", size: 80, fontFamily: "Rancho" }];
  const svgRef = useRef(null);

  useEffect(() => {
    // const words = [
    //   { text: "+++BRAINSTORM+++", size: 20, fontFamily: "Rancho" },
    //   { text: "AMIGOS", size: 30, fontFamily: "Helvetica" },
    //   { text: "A.I.", size: 50, fontFamily: "Verdana" },
    //   { text: "BOTANICAL", size: 20, fontFamily: "Rancho" },
    //   { text: "PHOTOGRAPHER", size: 100, fontFamily: "Lakki Reddy" },
    //   { text: "DEVELOPER", size: 70, fontFamily: "Georgia" },
    //   { text: "JAVASCRIPT", size: 50, fontFamily: "Rancho" },
    //   { text: "PYTHON", size: 20, fontFamily: "Lakki Reddy" },
    //   { text: "MONGODB", size: 30, fontFamily: "Lakki Reddy" },
    //   { text: "SOCKET.IO", size: 20, fontFamily: "Palatino" },
    //   { text: "JSON", size: 20, fontFamily: "Arial" },
    //   { text: "TYPESCRIPT", size: 30, fontFamily: "Rancho" },
    //   { text: "MOUNTAINS", size: 59, fontFamily: "Verdana" },
    //   { text: "EARTH", size: 30, fontFamily: "Courier" },
    //   { text: "PLANETS", size: 20, fontFamily: "Rancho" },
    //   { text: "GOTMAIL", size: 20, fontFamily: "Georgia" },
    //   { text: "BYE", size: 20, fontFamily: "Times New Roman" },
    //   { text: "MASTER", size: 20, fontFamily: "Lakki Reddy" },
    //   { text: "GORILLA", size: 30, fontFamily: "Lakki Reddy" },
    //   { text: "DEV.IO", size: 20, fontFamily: "Palatino" },
    //   { text: "VOLATILE", size: 20, fontFamily: "Arial" },
    //   { text: "BRITCOIN", size: 30, fontFamily: "Rancho" },
    //   { text: "MUSIK", size: 59, fontFamily: "Verdana" },
    //   { text: "SALT", size: 30, fontFamily: "Courier" },
    //   { text: "MANDOLLINA", size: 20, fontFamily: "Rancho" },
    //   { text: "MELLOTRON", size: 20, fontFamily: "Georgia" },
    //   { text: "JAZZATON", size: 20, fontFamily: "Times New Roman" },
    //   { text: "HACKA", size: 20, fontFamily: "Lakki Reddy" },
    // ];

    const layout = cloud()
      .size([window.innerWidth * 0.8, window.innerHeight * 0.8])
      .words(words)
      .padding(5)
      .rotate(() => (Math.random() < 0.5 ? -1 : 1) * 5) //for rotation change 0
      .fontSize((d) => d.size * 2)
      .on("end", draw);

    layout.start();

    function draw(words) {
      const svg = d3.select(svgRef.current);
      //const color = d3.schemeCategory10; enable to use built-in colors

      svg.attr("width", layout.size()[0]).attr("height", layout.size()[1]);

      svg
        .append("g")
        .attr(
          "transform",
          `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`
        )
        .selectAll("text")
        .data(words)
        .join("text")
        .style("font-size", (d) => `${d.size}px`)
        .style(
          "fill",
          (_, i) => `hsl(${Math.floor(Math.random() * 359)}, 100%, 60%)`
        ) //the random color creator string literal is my contribution.to use built-in colors:  "fill", (_, i) => color[i % color.length]
        .style("font-family", (d) => d.fontFamily)
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text((d) => d.text)
        .call(getBBox)
        .call(collide);

      function getBBox(selection) {
        selection.each(function (d) {
          d.bbox = this.getBBox();
        });
      }

      function collide(selection) {
        const nodes = selection.nodes();

        for (let i = 0; i < nodes.length; i++) {
          const node1 = nodes[i];
          const d1 = node1.__data__;
          const x1 = d1.x + layout.size()[0] / 2;
          const y1 = d1.y + layout.size()[1] / 2;

          for (let j = i + 1; j < nodes.length; j++) {
            const node2 = nodes[j];
            const d2 = node2.__data__;
            const x2 = d2.x + layout.size()[0] / 2;
            const y2 = d2.y + layout.size()[1] / 2;

            const dx = x2 - x1;
            const dy = y2 - y1;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < d1.size / 2 + d2.size / 2) {
              const angle = Math.atan2(dy, dx);
              const sin = Math.sin(angle);
              const cos = Math.cos(angle);

              const x1p = 0;
              const y1p = 0;

              const x2p = dx * cos + dy * sin;
              const y2p = dy * cos - dx * sin;

              const x1pp = x1p;
              const y1pp = y1p - d1.size / 2 - 1;

              const x2pp = x2p;
              const y2pp = y2p + d2.size / 2 + 1;

              const x1f = x1pp * cos - y1pp * sin;
              const y1f = y1pp * cos + x1pp * sin;

              const x2f = x2pp * cos - y2pp * sin;
              const y2f = y2pp * cos + x2pp * sin;

              d1.x += (x2f - x1f) / 2;
              d1.y += (y2f - y1f) / 2;

              d2.x -= (x2f - x1f) / 2;
              d2.y -= (y2f - y1f) / 2;
            }
          }
        }
      }
    }
  }, [words]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgb(70, 64, 69)",
      }}
    >
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default Test;
