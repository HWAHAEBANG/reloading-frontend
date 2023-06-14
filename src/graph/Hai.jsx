import React, { useEffect, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";
import darkUnica from "highcharts/themes/dark-unica";
import axios from "axios";
import { FcLeft } from "react-icons/fc";
import RingLoader from "react-spinners/RingLoader";

highchartsMore(Highcharts);
solidGauge(Highcharts);
darkUnica(Highcharts);

export default function Hai() {
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
  const [haiDataSeoul, setHaiDataSeoul] = useState();
  const [housePriceIndexData, setHousePriceIndexData] = useState();
  const [baseRateKoreaResponse, setBaseRateKoreaResponse] = useState();

  // 중첩배열용
  const getAverage = (arr) => {
    const sum = arr.reduce((acc, cur) => acc + cur[1], 0);
    const avg = sum / arr.length;
    return avg;
  };

  const avg =
    haiDataSeoul &&
    haiDataSeoul.map((item) => [
      item[0],
      parseFloat(getAverage(haiDataSeoul).toFixed(1)),
    ]);
  // const average = new Array(haiDataSeoul && haiDataSeoul.length); // 데이터 개수만큼 빈 배열을 만들고
  // haiDataSeoul && average.fill(parseFloat(getAverage(haiDataSeoul).toFixed(1))); // 평균으로 다 채운다. 원본을 수정함.
  //toFixed를 하면 문자열로 변환되는 것 주의!

  useEffect(() => {
    Promise.all([
      axios.get(`https://reloading.co.kr/api/allCharts/hai`, {
        withCredentials: true,
      }),
      axios.get(`https://reloading.co.kr/api/allCharts/housePriceIndexSeoul`, {
        withCredentials: true,
      }),
      axios.get(`https://reloading.co.kr/api/allCharts/baseRateKorea`, {
        withCredentials: true,
      }),
    ])
      .then((responses) => {
        const haiResponse = responses[0];
        const housePriceIndexResponse = responses[1];
        const baseRateKoreaResponse = responses[2];

        setHaiDataSeoul(haiResponse.data.data);
        setHousePriceIndexData(housePriceIndexResponse.data.data);
        setBaseRateKoreaResponse(baseRateKoreaResponse.data.data);

        // 추가 작업을 수행할 수 있습니다.

        setLoading(false);
      })
      .catch((error) => {
        // 에러 처리
        console.error(error);
        setLoading(false);
      });
  }, []);

  // console.log("체크", baseRateKoreaResponse);

  const options = {
    chart: {
      zoomType: "xy",
      backgroundColor: "transparent",
      style: {
        // position: "absolute",
        // top: 0,
        // left: 0,
        width: "100%",
        height: "100%",
        // margin: "0",
        // height: (3 / 4) * 200 + "%",
        // backgroundColor: "red",
      },
    },
    title: {
      text: "서울 HAI (주택 구입 부담 지수)",
    },
    // subtitle: {
    //   text: "주택 구입 부담 지수",
    // },
    xAxis: { type: "datetime" },
    // [
    //   {
    //     categories: haiSeoul,
    //     crosshair: true, // 뭘까
    //   },
    // ],
    yAxis: [
      {
        // Primary yAxis
        labels: {
          // 좌축 눈금 단위
          // format: "{value}",
          style: {
            color: Highcharts.getOptions().colors[0],
          },
        },

        title: {
          // 좌측 눈금 이름
          text: "HAI, 매매 지수 (%)",
          style: {
            color: Highcharts.getOptions().colors[0],
          },
        },
        tickAmount: 7,
        max: 250,
        // tickInterval: 40,
      },
      {
        // Secondary yAxis
        title: {
          // 우측 눈금 이름
          text: "기준금리 (%)",
          style: {
            color: "#95DFFD",
          },
        },
        labels: {
          // 우축 눈금 단위
          format: "{value}", //"{value} mm"
          style: {
            color: "#95DFFD",
          },
        },
        tickAmount: 7,
        max: 6,
        opposite: true,
      },
    ],
    tooltip: {
      split: true,
      valueSuffix: " units",
    },
    legend: {
      layout: "vertical",
      align: "left",
      x: 120,
      verticalAlign: "top",
      y: 100,
      floating: true,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || // theme
        "rgba(255,255,255,0.25)",
    },
    series: [
      {
        name: "서울 HAI",
        type: "column",
        yAxis: 0,
        data: haiDataSeoul,
        tooltip: {
          valueSuffix: "%", //" mm"
        },
      },
      {
        name: "서울 HAI 장기 평균", // 지역이름 변수로 놓자
        type: "spline",
        yAxis: 0, // 이거 있으면 좌측 눈금 따라가나보다!
        data: avg,
        tooltip: {
          valueSuffix: "%", //" mm"
        },
      },
      {
        name: "서울 아파트 매매 지수", // 지역이름 변수로 놓자
        type: "spline",
        yAxis: 0,
        data: housePriceIndexData,
        // yAxis: 1, // 이거 있으면 좌측 눈금 따라가나보다!
        tooltip: {
          valueSuffix: "%",
        },
      },
      {
        name: "한국 기준 금리", // 지역이름 변수로 놓자
        type: "spline",
        data: baseRateKoreaResponse,
        yAxis: 1, // 이거 있으면 좌측 눈금 따라가나보다!
        tooltip: {
          valueSuffix: "%",
        },
        color: "#95DFFD",
      },
    ],
    plotOptions: {
      series: {
        borderWidth: 0, // 그래프 border
      },
    },
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
        <HighchartsReact
          highcharts={Highcharts}
          // constructorType={"MultipleAxes"}
          options={options}
        />
      )}
    </div>
  );
}
