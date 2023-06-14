import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";
import darkUnica from "highcharts/themes/dark-unica";
import "./unsoldHouse.css";
import axios from "axios";
import RingLoader from "react-spinners/RingLoader";

highchartsMore(Highcharts);
solidGauge(Highcharts);
darkUnica(Highcharts);

export default function UnsoldHouse() {
  // loading ===========================
  const loaderBox = {
    display: "flex",
    justifyContents: "center",
    alignItems: "center",
    height: "400px",
  };

  const override = {
    display: "block",
    margin: "auto",
  };

  const [loading, setLoading] = useState(true);
  // ===================================
  const [unsoldHouseData, setUnsoldHouseData] = useState();
  const [housePriceIndexData, setHousePriceIndexData] = useState();
  const [rentalPriceIndexData, setRentalPriceIndexData] = useState();

  useEffect(() => {
    Promise.all([
      axios.get(`http://reloading.co.kr/api/allCharts/unsoldHouse`, {
        withCredentials: true,
      }),
      axios.get(
        `http://reloading.co.kr/api/allCharts/housePriceIndexAroundSeoul`,
        {
          withCredentials: true,
        }
      ),
      axios.get(
        `http://reloading.co.kr/api/allCharts/JeonsePriceIndexAroundSeoul`,
        {
          withCredentials: true,
        }
      ),
    ])
      .then((responses) => {
        const unsoldHouseResponse = responses[0];
        const housePriceIndexResponse = responses[1];
        const rentalPriceIndexResponse = responses[2];

        setUnsoldHouseData(unsoldHouseResponse.data.data);
        setHousePriceIndexData(housePriceIndexResponse.data.data);
        setRentalPriceIndexData(rentalPriceIndexResponse.data.data);

        // 추가 작업을 수행할 수 있습니다.

        setLoading(false);
      })
      .catch((error) => {
        // 에러 처리
        console.error(error);
        setLoading(false);
      });
  }, []);

  const getAverage = (arr) => {
    const sum = arr.reduce((acc, cur) => acc + cur[1], 0);
    const avg = sum / arr.length;
    return avg;
  };

  const standard =
    unsoldHouseData && unsoldHouseData.map((item) => [item[0], 15000]);

  const options = {
    chart: {
      zoomType: "x",
      backgroundColor: "transparent",
      // height: "90%", // 필요없음. 아니 없어야됨
      // width: "100%",
    },
    title: {
      text: "수도권 미분양 물량 추이",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: [
      {
        title: {
          text: "매매 / 전세 지수 (%)",
        },
        tickAmount: 10,
        max: 120,
      },
      {
        title: {
          text: "미분양 물량 (호)",
          style: {
            color: Highcharts.getOptions().colors[0],
          },
        },
        tickAmount: 10,
        max: 45000,
        opposite: true,

        labels: {
          // 우축 눈금 단위
          // format: "{value}", //"{value} mm"
          //==============================================
          formatter: function () {
            // 4자리 이상의 수에 쉼표 추가
            if (Math.abs(this.value) >= 1000) {
              return Highcharts.numberFormat(this.value, 0, "", ",");
            }
            return this.value;
          },
          //==============================================
          style: {
            color: Highcharts.getOptions().colors[0],
          },
        },
      },
    ],
    // tooltip: {
    //   shared: true,
    // },
    tooltip: {
      split: true,
      valueSuffix: " units",
    },
    legend: {
      layout: "vertical",
      align: "left",
      x: 70,
      verticalAlign: "top",
      y: 40,
      floating: true,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || // theme
        "rgba(255,255,255,0.25)",
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [
              1,
              Highcharts.color(Highcharts.getOptions().colors[0])
                .setOpacity(0)
                .get("rgba"),
            ],
          ],
        },
        marker: {
          radius: 2,
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        threshold: null,
      },
      line: {
        lineWidth: 1,
      },
    },
    series: [
      {
        type: "area",
        name: "수도권 미분양 물량",
        yAxis: 1,
        data: unsoldHouseData,
        tooltip: {
          // valueSuffix: "호",
          // ==================================
          pointFormatter: function () {
            // 4자리 이상의 수에 쉼표 추가
            if (Math.abs(this.y) >= 1000) {
              return (
                this.series.name +
                ": <b>" +
                Highcharts.numberFormat(this.y, 0, "", ",") +
                "호</b><br/>"
              );
            }
            return this.series.name + ": <b>" + this.y + "</b><br/>";
          },
          // ==================================
        },
      },
      {
        type: "line",
        name: "미분양 너나위님 기준",
        yAxis: 1,
        data: standard,
        tooltip: {
          // valueSuffix: "호",
          // ==================================
          pointFormatter: function () {
            // 4자리 이상의 수에 쉼표 추가
            if (Math.abs(this.y) >= 1000) {
              return (
                this.series.name +
                ": <b>" +
                Highcharts.numberFormat(this.y, 0, "", ",") +
                "호</b><br/>"
              );
            }
            return this.series.name + ": <b>" + this.y + "</b><br/>";
          },
          // ==================================
        },
        color: Highcharts.getOptions().colors[2],
      },
      {
        type: "line",
        name: "수도권 아파트 매매지수",
        yAxis: 0,
        data: housePriceIndexData,
        tooltip: {
          valueSuffix: "%",
        },
        color: Highcharts.getOptions().colors[3],
      },
      {
        type: "line",
        name: "수도권 아파트 전세지수",
        yAxis: 0,
        data: rentalPriceIndexData,
        tooltip: {
          valueSuffix: "%",
        },
        color: Highcharts.getOptions().colors[1],
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
    </div>
  );
}
