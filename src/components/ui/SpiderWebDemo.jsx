import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";
import darkUnica from "highcharts/themes/dark-unica";

// 테마 설정
darkUnica(Highcharts);
// polar 차트를 사용하기 위해 highcharts-more 라이브러리 추가
highchartsMore(Highcharts);

export default function SpiderWebDemo() {
  const [mock, setMock] = useState([50, 60, 11, 49, 60, 43]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMock(
        MOCK_DATA_LIST[Math.floor(Math.random() * MOCK_DATA_LIST.length)]
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [mock]);

  useEffect(() => {
    // 차트 생성 후 DOM에 추가
    const chart = Highcharts.chart("polar-container", options);
    return () => {
      // 컴포넌트가 언마운트될 때 차트 제거
      chart.destroy();
    };
  }, []);
  const options = {
    chart: {
      polar: true,
      type: "line",
      backgroundColor: "transparent",
      style: {
        width: "100%",
        height: "100%",
      },
    },
    title: {
      text: "핵심 지표별 진행 상황",
      x: -20,
      y: -20,
    },
    subtitle: {
      text: "본 차트의 내용은 실제 데이터와 무관함",
      x: 0,
      y: 2,
    },
    pane: {
      size: "95%",
    },
    xAxis: {
      categories: [
        "매매 거래량",
        "PIR 지수",
        "HAI 지수",
        "주간 매매가 변동율",
        "전세가율",
        "미분양",
      ],
      tickmarkPlacement: "on",
      lineWidth: 0,
    },
    yAxis: {
      gridLineInterpolation: "polygon",
      lineWidth: 0,
      min: 0,
    },
    tooltip: {
      shared: true,
      pointFormat:
        "<span style='color:{series.color}'>{series.name}: <b>{point.y:0f}%</b><br/>",
      // "<span style='color:{series.color}'>{series.name}: <b>{point.y:,.0f}%</b><br/>",
    },
    legend: {
      enabled: false,
      align: "right",
      verticalAlign: "top",
      y: 70,
      layout: "vertical",
    },
    series: [
      {
        name: "진행률",
        data: mock,
        pointPlacement: "on",
      },
      // {
      //   name: "Actual Spending",
      //   data: [50000, 39000, 42000, 31000, 26000, 14000],
      //   pointPlacement: "on",
      // },
    ],
  };

  return <div id='polar-container'></div>;
}

const ARR1 = [10, 47, 11, 49, 12, 43];
const ARR2 = [16, 39, 17, 38, 18, 34];
const ARR3 = [23, 31, 22, 29, 24, 26];
const ARR4 = [32, 14, 33, 12, 34, 10];
const ARR5 = [46, 19, 45, 20, 44, 22];
const ARR6 = [39, 27, 38, 29, 37, 32];
const ARR7 = [50, 15, 49, 13, 48, 11];

const MOCK_DATA_LIST = [ARR1, ARR2, ARR3, ARR4, ARR5, ARR6, ARR7];
