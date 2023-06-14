import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import RingLoader from "react-spinners/RingLoader";
import axios from "axios";

export default function Gauge() {
  // loading ===========================
  const loaderBox = {
    display: "flex",
    justifyContents: "center",
    alignItems: "center",
    height: "250px",
  };

  const override = {
    display: "block",
    margin: "auto",
  };

  const [loading, setLoading] = useState(false);
  // ===================================

  // ===================================

  const [haiDataSeoul, setHaiDataSeoul] = useState();

  const [pirData, setPirData] = useState();

  const [transactionVolumeSalesSeoul, setTransactionVolumeSalesSeoul] =
    useState();

  const [housePriceIndexData, setHousePriceIndexData] = useState();

  useEffect(() => {
    Promise.all([
      axios.get(`https://reloading.co.kr/api/allCharts/hai`, {
        withCredentials: true,
      }),

      axios.get(`https://reloading.co.kr/api/allCharts/pir`, {
        withCredentials: true,
      }),

      axios.get(
        `https://reloading.co.kr/api/allCharts/transactionVolumeSalesSeoul`,
        {
          withCredentials: true,
        }
      ),

      axios.get(`https://reloading.co.kr/api/allCharts/housePriceIndexSeoul`, {
        withCredentials: true,
      }),
    ])

      .then((responses) => {
        const haiResponse = responses[0];

        const pirResponse = responses[1];

        const transactionVolumeSalesSeoulResponse = responses[2];

        const housePriceIndexResponse = responses[3];

        // 가장 최신 데이터와 3개월 전 데이터를 비교
        // 증감률 = ((현재 값 - 이전 값) / 이전 값) * 100

        setHaiDataSeoul(
          Math.round(
            ((haiResponse.data.data.slice(-1)[0][1] -
              haiResponse.data.data.slice(-7, -6)[0][1]) /
              haiResponse.data.data.slice(-7, -6)[0][1]) *
              100
          )
        );

        setPirData(
          Math.round(
            ((pirResponse.data.data.slice(-1)[0][1] -
              pirResponse.data.data.slice(-7, -6)[0][1]) /
              pirResponse.data.data.slice(-7, -6)[0][1]) *
              100
          )
        );

        setTransactionVolumeSalesSeoul(
          Math.round(
            ((transactionVolumeSalesSeoulResponse.data.data.slice(-1)[0][1] -
              transactionVolumeSalesSeoulResponse.data.data.slice(
                -7,
                -6
              )[0][1]) /
              transactionVolumeSalesSeoulResponse.data.data.slice(
                -7,
                -6
              )[0][1]) *
              100
          )
        );

        setHousePriceIndexData(
          Math.round(
            ((housePriceIndexResponse.data.data.slice(-1)[0][1] -
              housePriceIndexResponse.data.data.slice(-7, -6)[0][1]) /
              housePriceIndexResponse.data.data.slice(-7, -6)[0][1]) *
              100
          )
        );

        setLoading(false);
      })
      .catch((error) => {
        // 에러 처리
        console.error(error);
        setLoading(false);
      });
  }, []);

  console.log("hai", haiDataSeoul);
  console.log("pir", pirData);
  console.log("양", transactionVolumeSalesSeoul);
  console.log("지수", housePriceIndexData);

  //====================================================

  const options = {
    chart: {
      type: "gauge",
      backgroundColor: "transparent",
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: "330px",
    },
    title: {
      text: "시장 과열 측정 미터기",
      floating: true,
      x: 0, // x값을 설정하여 가로 방향으로 이동시킵니다.
      y: 50, // y값을 설정하여 세로 방향으로 이동시킵니다.
    },
    pane: {
      center: ["50%", "75%"], // 하 찾았다.
      startAngle: -100,
      endAngle: 100,
      background: [
        {
          borderWidth: 0,
          backgroundColor: "transparent",
          outerRadius: "109%",
          innerRadius: "107%",
        },
        {
          borderWidth: 0,
          backgroundColor: "transparent",
          outerRadius: "107%",
          innerRadius: "105%",
        },
        {
          borderWidth: 0,
          backgroundColor: "transparent",
          outerRadius: "79%",
          innerRadius: "77%",
        },
      ],
      size: "90%",
    },

    // 차트 데이터 설정
    yAxis: {
      min: 0,
      max: 100,
      lineColor: "#FFF",
      tickColor: "#FFF",
      minorTickColor: "#FFF",
      offset: -25,
      lineWidth: 2,
      labels: {
        distance: -20,
        rotation: "auto",
        style: {
          color: "#FFF",
        },
      },
      tickLength: 5,
      minorTickLength: 5,
      endOnTick: false,
      plotBands: [
        {
          from: 0,
          to: 20,
          color: "#4282ef", // blue
          thickness: 20,
        },
        {
          from: 20,
          to: 40,
          color: "#42c4ef", // sky
          thickness: 20,
        },
        {
          from: 40,
          to: 60,
          color: "#55BF3B", // green
          thickness: 20,
        },
        {
          from: 60,
          to: 80,
          color: "#DDDF0D", // yellow
          thickness: 20,
        },
        {
          from: 80,
          to: 100,
          color: "#DF5353", // red
          thickness: 20,
        },
      ],
    },

    series: [
      {
        name: "시장 분위기",
        data: [30],
        tooltip: {
          valueSuffix: "%",
        },
        // 차트 색상 설정
        dial: {
          backgroundColor: "#666",
          baseLength: "80%",
          baseWidth: 2,
          radius: "100%",
          rearLength: "0%",
          topWidth: 1,
          borderColor: "#DDD",
          borderWidth: 1,
          pivotRadius: 5,
          pivotBackgroundColor: "#FFF",
          pivotBorderColor: "#000",
          pivotBorderWidth: 2,
        },
        pivot: {
          backgroundColor: "#DDD",
          radius: 6,
        },
        dataLabels: {
          enabled: false,
        },
      },
    ],
  };

  return (
    <div>
      {loading ? (
        <div style={loaderBox}>
          <RingLoader
            color='#36d7b7'
            loading={loading}
            cssOverride={override}
            size={200}
            aria-label='Loading Spinner'
            data-testid='loader'
          />
        </div>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
      <div style={block}>COMMING SOON</div>
    </div>
  );
}

const block = {
  position: "absolute",
  top: "130px",
  width: "100%",
  height: "60px",
  background: "rgb(255, 180, 0)",
  color: "#191B1C",
  textAlign: "center",
  fontSize: "30px",
  lineHeight: "60px",
  fontWeight: "900",
  filter: "blur(1px) opacity(0.7)",
  // backdropFilter: "blur(10px)",
};
// const options = {
//   chart: {
//     type: "gauge",
//     plotBackgroundColor: null,
//     plotBackgroundImage: null,
//     plotBorderWidth: 0,
//     plotShadow: false,
//     backgroundColor: "transparent",
//     style: {
//       width: "100%",
//       height: "100%",
//     },
//   },

//   title: {
//     text: "시장 과열 척도",
//   },

//   pane: {
//     startAngle: -90,
//     endAngle: 89.9,
//     background: null,
//     center: ["50%", "75%"],
//     size: "80%",
//   },

//   // the value axis
//   yAxis: {
//     min: 0,
//     max: 100,
//     tickPixelInterval: 45,
//     tickPosition: "inside",
//     tickColor: Highcharts.defaultOptions.chart.backgroundColor || "#FFFFFF",
//     tickLength: 20,
//     tickWidth: 2,
//     minorTickInterval: null,
//     labels: {
//       distance: 20,
//       style: {
//         fontSize: "14px",
//       },
//     },
// plotBands: [
//   {
//     from: 0,
//     to: 20,
//     color: "#4282ef", // blue
//     thickness: 20,
//   },
//   {
//     from: 20,
//     to: 40,
//     color: "#42c4ef", // sky
//     thickness: 20,
//   },
//   {
//     from: 40,
//     to: 60,
//     color: "#55BF3B", // green
//     thickness: 20,
//   },
//   {
//     from: 60,
//     to: 80,
//     color: "#DDDF0D", // yellow
//     thickness: 20,
//   },
//   {
//     from: 80,
//     to: 100,
//     color: "#DF5353", // red
//     thickness: 20,
//   },
// ],
// },

//   series: [
//     {
//       name: "Speed",
//       data: [20],
//       tooltip: {
//         valueSuffix: "", // km/h
//       },
//       dataLabels: {
//         format: "{y}", //km/ha
//         borderWidth: 0,
//         color:
//           (Highcharts.defaultOptions.title &&
//             Highcharts.defaultOptions.title.style &&
//             Highcharts.defaultOptions.title.style.color) ||
//           "#333333",
//         style: {
//           fontSize: "16px",
//         },
//       },
//       dial: {
//         radius: "80%",
//         backgroundColor: "gray",
//         baseWidth: 12,
//         baseLength: "0%",
//         rearLength: "0%",
//       },
//       pivot: {
//         backgroundColor: "gray",
//         radius: 6,
//       },
//     },
//   ],
// };
