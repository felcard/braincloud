import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

const Cloud = ({ words }) => {
  if (!Array.isArray(words) || words.length === 0) words = [];

  const svgRef = useRef(null);

  const fonts = () => {
    const fontArr = [
      "Rancho",
      "Lakki Reddy",
      "Righteous",
      "Space Mono",
      "Rancho",
      "Lakki Reddy",
      "Righteous",
      "Space Mono",
    ];
    const fontInd = Math.floor(Math.random() * 7);
    return fontArr[fontInd];
  };

  useEffect(() => {
    const draw = (words) => {
      const layout = cloud()
        .size([window.innerWidth * 0.95, 500])
        .words(words)
        .padding(5)
        .rotate(() => (Math.random() < 0.5 ? -1 : 1) * 5)
        // Use the count property to determine the font size
        .fontSize((d) => Math.max(d.count * 10, 20))
        .on("end", (words) => {
          const svg = d3.select(svgRef.current);
          svg
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .append("g")
            .attr(
              "transform",
              `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`
            )
            .selectAll("text")
            .data(words)
            .join("text")
            .attr("font-family", () => fonts())
            .style("font-size", (d) => `${d.size}px`)
            .style("fill", (d) => d.color)
            .attr("text-anchor", "middle")
            .attr(
              "transform",
              (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`
            )
            .text((d) => d.text);
        });
      layout.start();
    };
    // Convert each word object to an object with 'text', 'size', and 'color' properties
    const wordsWithSize = words.map((word) => ({
      text: word.text,
      size: 0,
      color: `hsl(${Math.floor(Math.random() * 359)}, 100%, 60%)`,
      count: word.count,
      font: fonts(),
    }));
    draw(wordsWithSize);
  }, [words]);

  return <svg ref={svgRef} />;

  // const svgRef = useRef(null);

  // const fonts = () => {
  //   const fontArr = [
  //     "Rancho",
  //     "Lakki Reddy",
  //     "Righteous",
  //     "Space Mono",
  //     "Rancho",
  //     "Lakki Reddy",
  //     "Righteous",
  //     "Space Mono",
  //   ];
  //   const fontInd = Math.floor(Math.random() * 7);
  //   return fontArr[fontInd];
  // };
  // console.log(words);

  // useEffect(() => {
  //   // const words = [
  //   //   { text: "+++BRAINSTORM+++", size: 20},
  //   //   { text: "AMIGOS", size: 30},
  //   //   { text: "A.I.", size: 50},
  //   //   { text: "BOTANICAL", size: 20},
  //   //   { text: "PHOTOGRAPHER", size: 100},
  //   //   { text: "DEVELOPER", size: 70 },
  //   //   { text: "JAVASCRIPT", size: 50 },
  //   //   { text: "PYTHON", size: 20},
  //   //   { text: "MONGODB", size: 30},
  //   //   { text: "SOCKET.IO", size: 20 },
  //   //   { text: "JSON", size: 20 },
  //   //   { text: "TYPESCRIPT", size: 30 },
  //   //   { text: "MOUNTAINS", size: 59 },
  //   //   { text: "EARTH", size: 30 },
  //   //   { text: "PLANETS", size: 20 },
  //   //   { text: "GOTMAIL", size: 20},
  //   //   { text: "BYE", size: 20},
  //   //   { text: "MASTER", size: 20},
  //   //   { text: "GORILLA", size: 30},
  //   //   { text: "DEV.IO", size: 20 },
  //   //   { text: "VOLATILE", size: 20 },
  //   //   { text: "BRITCOIN", size: 30 },
  //   //   { text: "MUSIK", size: 59 },
  //   //   { text: "SALT", size: 30 },
  //   //   { text: "MANDOLLINA", size: 20 },
  //   //   { text: "MELLOTRON", size: 20},
  //   //   { text: "JAZZATON", size: 20},
  //   //   { text: "HACKA", size: 20},
  //   // ];

  //   const layout = cloud()
  //     .size([window.innerWidth * 0.8, window.innerHeight * 0.8])
  //     .words(words)
  //     .padding(5)
  //     .rotate(() => (Math.random() < 0.5 ? -1 : 1) * 5) //for rotation change 0
  //     .fontSize((d) => d.size * 2)
  //     .on("end", draw);

  //   layout.start();

  //   function draw(words) {
  //     const svg = d3.select(svgRef.current);
  //     //const color = d3.schemeCategory10; enable to use built-in colors

  //     svg.attr("width", layout.size()[0]).attr("height", layout.size()[1]);

  //     svg
  //       .append("g")
  //       .attr(
  //         "transform",
  //         `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`
  //       )
  //       .selectAll("text")
  //       .data(words)
  //       .join("text")
  //       .style("font-size", (d) => `${d.size}px`)
  //       .style(
  //         "fill",
  //         (_, i) => `hsl(${Math.floor(Math.random() * 359)}, 100%, 60%)`
  //       ) //the random color creator string literal is my contribution.to use built-in colors:  "fill", (_, i) => color[i % color.length]
  //       .style("font-family", fonts())
  //       .attr("text-anchor", "middle")
  //       .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
  //       .text((d) => d.text)
  //       .call(getBBox)
  //       .call(collide);

  //     function getBBox(selection) {
  //       selection.each(function (d) {
  //         d.bbox = this.getBBox();
  //       });
  //     }

  //     function collide(selection) {
  //       const nodes = selection.nodes();

  //       for (let i = 0; i < nodes.length; i++) {
  //         const node1 = nodes[i];
  //         const d1 = node1.__data__;
  //         const x1 = d1.x + layout.size()[0] / 2;
  //         const y1 = d1.y + layout.size()[1] / 2;

  //         for (let j = i + 1; j < nodes.length; j++) {
  //           const node2 = nodes[j];
  //           const d2 = node2.__data__;
  //           const x2 = d2.x + layout.size()[0] / 2;
  //           const y2 = d2.y + layout.size()[1] / 2;

  //           const dx = x2 - x1;
  //           const dy = y2 - y1;
  //           const distance = Math.sqrt(dx * dx + dy * dy);

  //           if (distance < d1.size / 2 + d2.size / 2) {
  //             const angle = Math.atan2(dy, dx);
  //             const sin = Math.sin(angle);
  //             const cos = Math.cos(angle);

  //             const x1p = 0;
  //             const y1p = 0;

  //             const x2p = dx * cos + dy * sin;
  //             const y2p = dy * cos - dx * sin;

  //             const x1pp = x1p;
  //             const y1pp = y1p - d1.size / 2 - 1;

  //             const x2pp = x2p;
  //             const y2pp = y2p + d2.size / 2 + 1;

  //             const x1f = x1pp * cos - y1pp * sin;
  //             const y1f = y1pp * cos + x1pp * sin;

  //             const x2f = x2pp * cos - y2pp * sin;
  //             const y2f = y2pp * cos + x2pp * sin;

  //             d1.x += (x2f - x1f) / 2;
  //             d1.y += (y2f - y1f) / 2;

  //             d2.x -= (x2f - x1f) / 2;
  //             d2.y -= (y2f - y1f) / 2;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }, [words]);

  // return (
  //   <div
  //     style={{
  //       width: "100vw",
  //       height: "100vh",
  //       display: "flex",
  //       alignItems: "center",
  //       justifyContent: "center",
  //       background: "rgb(70, 64, 69)",
  //     }}
  //   >
  //     <svg ref={svgRef}></svg>
  //   </div>
  // );
};

export default Cloud;
