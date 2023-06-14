import React, { useEffect, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";
import darkUnica from "highcharts/themes/dark-unica";
import axios from "axios";
import { MdHeight } from "react-icons/md";
import RingLoader from "react-spinners/RingLoader";

highchartsMore(Highcharts);
solidGauge(Highcharts);
darkUnica(Highcharts);

export default function Pir() {
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

  const [pirData, setPirData] = useState();
  const [housePriceIndexData, setHousePriceIndexData] = useState();
  const [jeonsePriceIndexData, setJeonsePriceIndexData] = useState();
  const [jeonsePriceRatioData, setJeonsePriceRatioData] = useState();

  // //재사용 용
  // const getAverage = (arr) => {
  //   const sum = arr.reduce((acc, cur) => acc + cur);
  //   const avg = sum / arr.length;
  //   return avg;
  // };

  /**
   * 코드 서명
   *  받아온 배열 안에 배열에 중첩되어있으므로 위의 코드는 사용할 수 없다.
   *  아래와 같이 조금 변형해줘야한다.
   *  각 배열의 두번째 값의 평균을 구하고자 함으로 cur[1]을 해줘야한다.
   * 이때 주의할 점은 초기값으로 꼭 0을 넣어줘야한다는 것이다.
   * 그렇지않으면 acc의 초기값으로 첫번쨰 요소인 배열자료형이 들어가고,
   * 배열 + 숫자 가 연산되어 NaN가 나오기 때문이다.
   */

  // 중첩배열용
  // const getAverage = (arr) => {
  //   const sum = arr.reduce((acc, cur) => acc + cur[1], 0);
  //   const avg = sum / arr.length;
  //   return avg;
  // };

  // const avg =
  //   pirData &&
  //   pirData.map((item) => [
  //     item[0],
  //     parseFloat(getAverage(pirData).toFixed(1)),
  //   ]);

  // 대박....
  useEffect(() => {
    Promise.all([
      axios.get(`https://reloading.co.kr/api/allCharts/pir`, {
        withCredentials: true,
      }),
      axios.get(`https://reloading.co.kr/api/allCharts/housePriceIndexSeoul`, {
        withCredentials: true,
      }),
      axios.get(`https://reloading.co.kr/api/allCharts/JeonsePriceIndexSeoul`, {
        withCredentials: true,
      }),
      axios.get(`https://reloading.co.kr/api/allCharts/jeonsePriceRatio`, {
        withCredentials: true,
      }),
    ])
      .then((responses) => {
        const pirResponse = responses[0];
        const housePriceIndexResponse = responses[1];
        const jeonsePriceIndexResponse = responses[2];
        const jeonsePriceRatioResponse = responses[3];

        setPirData(pirResponse.data.data.filter((item) => item !== null));
        setHousePriceIndexData(housePriceIndexResponse.data.data);
        setJeonsePriceIndexData(jeonsePriceIndexResponse.data.data);
        setJeonsePriceRatioData(jeonsePriceRatioResponse.data.data);

        setLoading(false);
      })
      .catch((error) => {
        // 에러 처리
        console.error(error);
        setLoading(false);
      });
  }, []);

  // console.log(pirData);
  //   위의 코드는 여러 개의 axios 요청을 병렬로 처리하고, 모든 요청이 완료된 후에 한 번의 상태 업데이트를 수행하는 방식입니다. 이 방법은 성능과 효율성 면에서 일반적으로 효과적입니다.
  // 병렬로 요청을 처리하기 때문에 각 요청이 독립적으로 실행되므로 전체적인 처리 시간이 단일 요청의 처리 시간보다 효율적으로 단축될 수 있습니다. 이는 네트워크 요청이 병렬로 처리되므로 여러 개의 요청이 동시에 진행되는 것을 의미합니다.
  // 또한, Promise.all()을 사용하여 모든 요청이 완료될 때까지 기다린 후 한 번의 상태 업데이트를 수행하기 때문에, 상태 업데이트를 여러 번 수행하는 것보다 성능적으로 유리할 수 있습니다. 상태 업데이트는 리렌더링을 유발하므로, 한 번의 업데이트는 리렌더링을 한 번만 발생시키기 때문에 효율적입니다.
  // 성능에 영향을 주는 요소는 네트워크 지연, 서버 응답 시간 등 다양한 요소가 있습니다. 코드 자체의 성능은 개발 환경, 네트워크 상태, 서버 성능 등에 따라 달라질 수 있습니다. 따라서 실제로 코드를 실행해보고 성능을 측정하거나, 프로파일링 도구를 사용하여 성능 향상을 위한 최적화 작업을 수행하는 것이 좋습니다.
  // 그러나 일반적으로 병렬 처리와 한 번의 상태 업데이트를 수행하는 방식은 많은 요청을 처리하고 성능을 향상시키는 데 효과적인 방법 중 하나입니다.
  //====

  // 중첩배열용
  const getAverage = (arr) => {
    const sum = arr.reduce((acc, cur) => acc + cur[1], 0);
    const avg = sum / arr.length;
    return avg;
  };

  const jeonsePriceRatioAvg =
    jeonsePriceRatioData &&
    jeonsePriceRatioData.map((item) => [
      item[0],
      parseFloat(getAverage(jeonsePriceRatioData).toFixed(1)),
    ]);

  const pirAvg =
    pirData &&
    pirData.map((item) => [
      item[0],
      parseFloat(getAverage(pirData).toFixed(1)),
    ]);

  const options = {
    chart: {
      zoomType: "xy",
      backgroundColor: "transparent",
      style: {
        width: "100%",
        height: "100%",
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            // maxWidth: 1024,
          },
          chartOptions: {
            xAxis: {
              labels: {
                step: 4, // x축 눈금 간격 조정
              },
            },
          },
        },
      ],
    },
    title: {
      text: "서울 아파트 PIR (주택 구매 능력 지표)",
    },
    // subtitle: {
    //   text: "Price to Income Ratio",
    // },
    xAxis: {
      type: "datetime",
    },
    yAxis: [
      {
        // Primary yAxis
        labels: {
          // 좌축 눈금 단위
          format: "{value}",
          style: {
            color: Highcharts.getOptions().colors[0],
          },
        },
        title: {
          // 좌측 눈금 이름
          text: "매매 / 전세 지수, 전세가율 (%)",
          style: {
            color: Highcharts.getOptions().colors[0],
          },
        },
        min: 0,
        max: 120,
        tickAmount: 7,
      },
      {
        // Secondary yAxis
        title: {
          // 우측 눈금 이름
          text: "PIR",
          style: {
            color: Highcharts.getOptions().colors[1],
          },
        },
        labels: {
          // 우축 눈금 단위
          format: "{value}", //"{value} mm"
          style: {
            color: Highcharts.getOptions().colors[1],
          },
        },
        opposite: true,
        min: 0,
        max: 30,
        tickAmount: 7,
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
      y: 50,
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
        name: "서울 아파트 전세가율",
        type: "area",
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
              Highcharts.color(Highcharts.getOptions().colors[4])
                .setOpacity(0)
                .get("rgba"),
            ],
          ],
        },

        marker: {
          fillColor: Highcharts.getOptions().colors[0], // 점의 색상 설정
        },
        lineColor: Highcharts.getOptions().colors[0], // 선 색상 설정
        yAxis: 0,
        data: jeonsePriceRatioData,
        tooltip: {
          valueSuffix: "%", //" mm"
        },
      },
      {
        name: "서울 아파트 PIR", // 아직아님
        type: "area",
        yAxis: 1,
        data: pirData,
        tooltip: {
          valueSuffix: "년", //" mm"
        },
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, Highcharts.getOptions().colors[7]],
            [
              1,
              Highcharts.color(Highcharts.getOptions().colors[1])
                .setOpacity(0)
                .get("rgba"),
            ],
          ],
        },
        marker: {
          fillColor: Highcharts.getOptions().colors[7], // 점의 색상 설정
        },
        lineColor: Highcharts.getOptions().colors[7], // 선 색상 설정
      },

      {
        name: "서울 아파트 매매 지수", // 지역이름 변수로 놓자
        type: "spline",
        data: housePriceIndexData,
        tooltip: {
          valueSuffix: "%",
        },
      },
      {
        name: "서울 아파트 전세 지수", // 지역이름 변수로 놓자
        type: "spline",
        data: jeonsePriceIndexData,
        tooltip: {
          valueSuffix: "%",
        },
      },
      {
        name: "서울 아파트 전세가율 평균",
        type: "line", // 꺾은 선 그래프 추가
        data: jeonsePriceRatioAvg,
        // yAxis: 1,
        tooltip: {
          valueSuffix: "%",
        },
      },
      {
        name: "서울 아파트 PIR 평균",
        type: "line", // 꺾은 선 그래프 추가
        data: pirAvg,
        yAxis: 1,
        tooltip: {
          valueSuffix: "년",
        },
      },
      // {
      //   name: "PIR평균", // 지역이름 변수로 놓자
      //   type: "spline",
      //   yAxis: 1, // 이거 있으면 좌측 눈금 따라가나보다!
      //   data: avg,
      //   tooltip: {
      //     valueSuffix: "", //" mm"
      //   },
      // },
    ],
    // plotOptions: {
    //   series: {
    //     borderWidth: 0,
    //   },
    // },
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
