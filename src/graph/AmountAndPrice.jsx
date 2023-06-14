import React, { useContext, useEffect, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";
import darkUnica from "highcharts/themes/dark-unica";
import axios from "axios";
import RingLoader from "react-spinners/RingLoader";

highchartsMore(Highcharts);
solidGauge(Highcharts);
darkUnica(Highcharts);

export default function AmountAndPrice() {
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
  // const [categories, setCategories] = useState();
  // const [pirData, setPirData] = useState();
  const [transactionVolumeSalesSeoul, setTransactionVolumeSalesSeoul] =
    useState();
  const [transactionVolumeJeonseSeoul, setTransactionVolumeJeonseSeoul] =
    useState();
  const [housePriceIndexData, setHousePriceIndexData] = useState();
  const [jeonsePriceIndexData, setJeonsePriceIndexData] = useState();

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

  // 재사용 불가
  const getAverage = (arr) => {
    const sum = arr.reduce((acc, cur) => acc + cur[1], 0);
    const avg = sum / arr.length;
    return avg;
  };

  // const avg =
  //   pirData &&
  //   pirData.map((item) => [
  //     item[0],
  //     parseFloat(getAverage(pirData).toFixed(1)),
  //   ]);

  // console.log("pirData", pirData);
  // console.log("avg", avg);

  useEffect(() => {
    Promise.all([
      axios.get(
        `http://reloading.co.kr/api/allCharts/transactionVolumeSalesSeoul`,
        {
          withCredentials: true,
        }
      ),
      axios.get(
        `http://reloading.co.kr/api/allCharts/transactionVolumeJeonseSeoul`,
        {
          withCredentials: true,
        }
      ),
      axios.get(`http://reloading.co.kr/api/allCharts/housePriceIndexSeoul`, {
        withCredentials: true,
      }),
      axios.get(`http://reloading.co.kr/api/allCharts/JeonsePriceIndexSeoul`, {
        withCredentials: true,
      }),
    ])
      .then((responses) => {
        const transactionVolumeSalesSeoulResponse = responses[0];
        const transactionVolumeJeonseSeoulResponse = responses[1];
        const housePriceIndexResponse = responses[2];
        const jeonsePriceIndexResponse = responses[3];

        setTransactionVolumeSalesSeoul(
          transactionVolumeSalesSeoulResponse.data.data
        );
        setTransactionVolumeJeonseSeoul(
          transactionVolumeJeonseSeoulResponse.data.data
        );
        setHousePriceIndexData(housePriceIndexResponse.data.data);
        setJeonsePriceIndexData(jeonsePriceIndexResponse.data.data);
      })
      .catch((error) => {
        // 에러 처리
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const options = {
    chart: {
      zoomType: "xy",
      backgroundColor: "transparent",
      // width: "100%", ?
      // height: "100%", ?
    },
    title: {
      text: "서울 아파트 거래량과 가격지수",
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
          // style: {
          //   color: Highcharts.getOptions().colors[1],
          // },
        },
        title: {
          // 좌측 눈금 이름
          text: "매매 / 전세 지수 (%)",
          // style: {
          //   color: Highcharts.getOptions().colors[1],
          // },
        },
        min: 0,
        max: 120,
        tickAmount: 7,
      },
      {
        // Secondary yAxis
        title: {
          // 우측 눈금 이름
          text: "거래량 (건)",
          // style: {
          //   color: Highcharts.getOptions().colors[0],
          // },
        },
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
          // style: {
          //   color: Highcharts.getOptions().colors[0],
          // },
        },
        min: 0,
        max: 30000,
        tickAmount: 7,
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
        name: "서울 아파트 매매 거래량",
        type: "column",
        yAxis: 1,
        data: transactionVolumeSalesSeoul,
        tooltip: {
          valueSuffix: "건", //" mm"
          // ==================================
          pointFormatter: function () {
            // 4자리 이상의 수에 쉼표 추가
            if (Math.abs(this.y) >= 1000) {
              return (
                this.series.name +
                ": <b>" +
                Highcharts.numberFormat(this.y, 0, "", ",") +
                "건</b><br/>"
              );
            }
            return this.series.name + ": <b>" + this.y + "</b><br/>";
          },
          // ==================================
        },
        // color: Highcharts.getOptions().colors[2],
        color: Highcharts.color("#ec7878").setOpacity(0.7).get("rgba"),
        // color: "#ec7878",
      },
      {
        name: "서울 아파트 전세 거래량",
        type: "column",
        yAxis: 1,
        data: transactionVolumeJeonseSeoul,
        tooltip: {
          // valueSuffix: "건", //" mm"
          // ==================================
          pointFormatter: function () {
            // 4자리 이상의 수에 쉼표 추가
            if (Math.abs(this.y) >= 1000) {
              return (
                this.series.name +
                ": <b>" +
                Highcharts.numberFormat(this.y, 0, "", ",") +
                "건</b><br/>"
              );
            }
            return this.series.name + ": <b>" + this.y + "</b><br/>";
          },
          // ==================================
        },
        color: Highcharts.color(Highcharts.getOptions().colors[0])
          .setOpacity(0.7)
          .get("rgba"),
      },
      {
        name: "서울 아파트 매매 지수", // 지역이름 변수로 놓자
        type: "spline",
        yAxis: 0,
        data: housePriceIndexData,
        tooltip: {
          valueSuffix: "%",
        },
        color: "#fd3636",
        // color: Highcharts.getOptions().colors[8],
      },
      {
        name: "서울 아파트 전세 지수", // 지역이름 변수로 놓자
        type: "spline",
        yAxis: 0,
        data: jeonsePriceIndexData,
        tooltip: {
          valueSuffix: "%",
        },
        // color: Highcharts.getOptions().colors[4],
        color: "#95DFFD",
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
        <HighchartsReact
          highcharts={Highcharts}
          // constructorType={"MultipleAxes"}
          options={options}
        />
      )}
    </div>
  );
}
