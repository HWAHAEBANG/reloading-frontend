import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import RingLoader from "react-spinners/RingLoader";

export default function PriceChangeRate() {
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
  const [priceChangeRateData, setPriceChangeRateData] = useState();

  // console.log(priceChangeRateData);

  useEffect(() => {
    Promise.all([
      axios.get(`https://reloading.co.kr/api/allCharts/priceChangeRate`, {
        withCredentials: true,
      }),
    ])
      .then((responses) => {
        const priceChangeRateResponse = responses[0];

        setPriceChangeRateData(priceChangeRateResponse.data.data);

        // 추가 작업을 수행할 수 있습니다.

        setLoading(false);
      })
      .catch((error) => {
        // 에러 처리
        console.error(error);
        setLoading(false);
      });
  }, []);

  const options = {
    chart: {
      zoomType: "xy",
      type: "column",
      backgroundColor: "transparent",
    },
    title: {
      text: "서울 아파트 주간 매매가 증감률",
    },
    xAxis: {
      type: "datetime",
      // categories: ["Apples", "Oranges", "Pears", "Grapes", "Bananas"],
    },
    yAxis: {
      // Primary yAxis
      labels: {
        // 좌축 눈금 단위
        format: "{value}", //%
        // style: {
        //   color: Highcharts.getOptions().colors[0],
        // },
      },

      title: {
        enabled: true,
        text: "주간 매매가 증감률 (%)",
      },
      tickAmount: 12,
      max: 1.4,
      // tickInterval: 40,
    },
    tooltip: {
      split: true,
      valueSuffix: " units",
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: "주간 매매가 증감률",
        type: "area",
        data: priceChangeRateData,
        tooltip: {
          valueSuffix: "%",
        },
      },
    ],
    plotOptions: {
      series: {
        borderWidth: 0,
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
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </div>
  );
}
