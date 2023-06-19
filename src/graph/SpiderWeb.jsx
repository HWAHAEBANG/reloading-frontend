import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";
import darkUnica from "highcharts/themes/dark-unica";
import axios from "axios";
import RingLoader from "react-spinners/RingLoader";

// 테마 설정
// polar 차트를 사용하기 위해 highcharts-more 라이브러리 추가
// highchartsMore(Highcharts);
// highchartsMore(Highcharts);
// solidGauge(Highcharts);
// darkUnica(Highcharts);

export default function SpiderWeb() {
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

  const [jeonsePriceRatioData, setJeonsePriceRatioData] = useState();
  const [haiDataSeoul, setHaiDataSeoul] = useState();
  const [unsoldHouseData, setUnsoldHouseData] = useState();
  const [pirData, setPirData] = useState();
  const [priceChangeRateData, setPriceChangeRateData] = useState();
  const [transactionVolumeSalesSeoul, setTransactionVolumeSalesSeoul] =
    useState();

  useEffect(() => {
    Promise.all([
      axios.get(`https://reloading.co.kr/api/allCharts/jeonsePriceRatio`, {
        withCredentials: true,
      }),
      axios.get(`https://reloading.co.kr/api/allCharts/hai`, {
        withCredentials: true,
      }),
      axios.get(`https://reloading.co.kr/api/allCharts/unsoldHouse`, {
        withCredentials: true,
      }),
      axios.get(`https://reloading.co.kr/api/allCharts/pir`, {
        withCredentials: true,
      }),
      axios.get(`https://reloading.co.kr/api/allCharts/priceChangeRate`, {
        withCredentials: true,
      }),
      axios.get(
        `https://reloading.co.kr/api/allCharts/transactionVolumeSalesSeoul`,
        {
          withCredentials: true,
        }
      ),
    ])
      .then((responses) => {
        const jeonsePriceRatioResponse = responses[0];
        const haiResponse = responses[1];
        const unsoldHouseResponse = responses[2];
        const pirResponse = responses[3];
        const priceChangeRateResponse = responses[4];
        const transactionVolumeSalesSeoulResponse = responses[5];

        // 최근 12개월(52주)의 데이터 가져오기
        const recent52weekPriceChangeRate =
          priceChangeRateResponse.data.data.slice(-52);
        // 12개월 중 가장 최근 마이너스인 인덱스 저장할 변수 선언
        let lastMinusValueIndex;

        // console.log("체크", recent52weekPriceChangeRate);

        // 로식이 조금 아쉬움 가능하다면 리팩토링 시도(기능은 이상없음)=============
        for (let i = recent52weekPriceChangeRate.length - 1; i >= 0; i--) {
          if (recent52weekPriceChangeRate[i][1] < 0) {
            lastMinusValueIndex = i;
            break; // 마이너스 값이 발견되면 반복문 종료
          } else {
            lastMinusValueIndex = -1;
          }
        }
        //=====================================================================-
        // 최대값을 100, 최소값을 0으로 뒀을 때, 원하는 값의 값의 정도를 구하는 식 : (value - 최소값) / (최대값 - 최소값) * 100
        // 단순함. 백분율 구하는 식에서 분모 분자에 똑같이 최소값을 빼주면 됨.

        Math.round();
        //가장 최신 데이터의 value 요소에 접근.

        setJeonsePriceRatioData(
          // 최대 72 최소 52.8
          Math.round(
            ((jeonsePriceRatioResponse.data.data.slice(-1)[0][1] - 52.8) /
              (72 - 52.8)) *
              100
          )
        );

        setHaiDataSeoul(
          // 최대 214.6 최소 83.7
          Math.round(
            ((haiResponse.data.data.slice(-1)[0][1] - 83.7) / (214.6 - 83.7)) *
              100
          )
        );

        setUnsoldHouseData(
          // 최대 36903 최소 1183
          Math.round(
            ((unsoldHouseResponse.data.data.slice(-1)[0][1] - 1183) /
              (36903 - 1183)) *
              100
          )
        );

        setPirData(
          // 최대 24.06 최소 9.91
          Math.round(
            ((pirResponse.data.data.slice(-1)[0][1] - 9.91) / (24.06 - 9.91)) *
              100
          )
        );

        // 조금 특별한 로직 : 플러스 구간이 얼마나 유지되었는지 백분위로 표면 , 12개월 간 지속되었으면 100
        // 주의 : 인덱스값에서 인덱스값 뺴는 것이기 때문에 51에서 빼야함!
        // 데이터 단위가 월이 아닌 주라는 점 주의
        setPriceChangeRateData(
          // Math.round(((11 - lastMinusValueIndex) / 12) * 100) // 개월
          Math.round(((51 - lastMinusValueIndex) / 52) * 100) // 주
        );

        setTransactionVolumeSalesSeoul(
          // 최대 19833 최소 559
          Math.round(
            // 현재 월은 수집중이라 너무 적으므로 직전 월 데이터 사용
            ((transactionVolumeSalesSeoulResponse.data.data.slice(-2)[0][1] -
              559) /
              (19833 - 599)) *
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

  //====================================================
  // useEffect(() => {
  // 차트 생성 후 DOM에 추가
  //   const chart = Highcharts.chart("polar-container", options);
  //   return () => {
  //     // 컴포넌트가 언마운트될 때 차트 제거
  //     chart.destroy();
  //   };
  // }, []);

  const options = {
    chart: {
      polar: true,
      type: "line",
      backgroundColor: "transparent",
      style: {
        // width: "100%",
        // height: "260",
      },
    },
    title: {
      text: "핵심 지표별 진행 상황",
      x: 0,
      y: 25,
    },
    // subtitle: {
    //   text: "중심에서 멀수록 투자 적기",
    //   x: 0,
    // },
    pane: {
      size: "80%",
    },
    xAxis: {
      categories: [
        "주간 매매가 증감률 상승 기조 유지기간",
        "매매 거래량",
        "전세가율",
        "HAI지수",
        "미분양",
        "PIR지수",
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
        name: " 현재 수준",
        data: [
          priceChangeRateData,
          transactionVolumeSalesSeoul,
          jeonsePriceRatioData,
          haiDataSeoul,
          unsoldHouseData,
          pirData,
        ],
        // pointPlacement: "on",
      },

      // {
      //   name: "Actual Spending",
      //   data: [50000, 39000, 42000, 31000, 26000, 14000],
      //   pointPlacement: "on",
      // },
    ],
  };

  // return <div id='polar-container'></div>;
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
