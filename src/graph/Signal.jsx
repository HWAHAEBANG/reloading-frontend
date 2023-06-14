import React, { useState, useEffect } from "react";
import styles from "./Signal.module.css";
import RedLamp from "../components/ui/RedLamp";
import GreenLamp from "../components/ui/GreenLamp";
import RingLoader from "react-spinners/RingLoader";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Signal({ chartsData }) {
  // loading ===========================
  const loaderBox = {
    display: "flex",
    justifyContents: "center",
    alignItems: "center",
    height: "450px",
  };

  const override = {
    display: "block",
    margin: "auto",
  };

  const [loading, setLoading] = useState(false);
  // ===================================
  const navigate = useNavigate();
  const move = () => {
    navigate("/allCharts/amountAndPrice", {
      state: {
        data: chartsData.filter((item) => item.id === "amountAndPrice")[0],
      },
    });
  };

  //======================================
  const [transactionVolumeSalesSeoul, setTransactionVolumeSalesSeoul] =
    useState();
  const [transactionVolumeJeonseSeoul, setTransactionVolumeJeonseSeoul] =
    useState();
  const [priceChangeRateData, setPriceChangeRateData] = useState({});

  useEffect(() => {
    setLoading(true);
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
      axios.get(`http://reloading.co.kr/api/allCharts/priceChangeRate`, {
        withCredentials: true,
      }),
    ])
      .then((responses) => {
        const transactionVolumeSalesSeoulResponse = responses[0];
        const transactionVolumeJeonseSeoulResponse = responses[1];
        const priceChangeRateResponse = responses[2];

        // 데이터 할당 =====================================================================

        // 서울 아파트 매매 거래량 =========================================================
        // 서울 아파트 매매 거래량 =========================================================
        setTransactionVolumeSalesSeoul({
          year: new Date(
            transactionVolumeSalesSeoulResponse.data.data.slice(-2)[0][0]
          ).getFullYear(),
          month:
            new Date(
              transactionVolumeSalesSeoulResponse.data.data.slice(-2)[0][0]
            ).getMonth() + 1, // +1 해주지 않으면 전달이 출력된다.
          value: transactionVolumeSalesSeoulResponse.data.data.slice(-2)[0][1],
        });
        // 서울 아파트 전세 거래량 =========================================================
        setTransactionVolumeJeonseSeoul({
          year: new Date(
            transactionVolumeJeonseSeoulResponse.data.data.slice(-2)[0][0]
          ).getFullYear(),
          month:
            new Date(
              transactionVolumeJeonseSeoulResponse.data.data.slice(-2)[0][0]
            ).getMonth() + 1, // +1 해주지 않으면 전달이 출력된다.
          value: transactionVolumeJeonseSeoulResponse.data.data.slice(-2)[0][1],
        });

        // 서울 아파트 주간 매매지수 증감률 =================================================
        const dataList = priceChangeRateResponse.data.data; // 보기 좋기 변수에 재할당
        let lastMinusValueIndex; // 가장 마지막 음수값이 있는 인덱스를 저장할 변수

        // 배열을 뒤에서 부터 돌면서 마지막 음수값을 찾음
        for (let i = dataList.length - 1; i >= 0; i--) {
          if (dataList[i][1] < 0) {
            lastMinusValueIndex = i;
            break; // 음수 값이 발견되면 lastMinusValueIndex에 인덱스를 할당하고 반복문 종료
          } else {
            lastMinusValueIndex = -1; // 사실상 도달할 일이 없는 else문.
          }
        }

        let lastPlusValueIndex; // 가장 마지막 양수값이 있는 인덱스를 저장할 변수

        // 배열을 뒤에서 부터 돌면서 마지막 양수값을 찾음
        for (let i = dataList.length - 1; i >= 0; i--) {
          if (dataList[i][1] > 0) {
            lastPlusValueIndex = i;
            break; // 양수 값이 발견되면 lastMinusValueIndex에 인덱스를 할당하고 반복문 종료
          } else {
            lastPlusValueIndex = -1; // 사실상 도달할 일이 없는 else문.
          }
        }

        // 상승과 하락이 몇주 연속 진행되었나를 상태에 객체로 저장 (인덱스에서 인덱스를 빼주는 개념이기 때문에 배열 길이에서 1 빼주는 것임)
        setPriceChangeRateData({
          uptrend: dataList.length - 1 - lastMinusValueIndex,
          downtrend: dataList.length - 1 - lastPlusValueIndex,
        });

        setLoading(false);
      })
      .catch((error) => {
        // 에러 처리
        console.error(error);
        setLoading(false);
      });
  }, []);

  // ======================================================================
  // 데이터 조건문 =================================================
  const [isConditionMet1, setIsConditionMet1] = useState(false);
  const [isConditionMet2, setIsConditionMet2] = useState(false);
  const [isConditionMet3, setIsConditionMet3] = useState(false);

  useEffect(() => {
    if (
      !transactionVolumeSalesSeoul ||
      !transactionVolumeJeonseSeoul ||
      !priceChangeRateData.uptrend /* 증감률 추가 */
    )
      return;
    // 매매 거래량이 10000을 초과하는가
    if (transactionVolumeSalesSeoul.value >= 10000) {
      setIsConditionMet1(true);
    } else {
      setIsConditionMet1(false);
    }

    // 매매 거개량이 전세거래량을 추월했는가?
    if (
      transactionVolumeSalesSeoul.value >= transactionVolumeJeonseSeoul.value
    ) {
      setIsConditionMet2(true);
    } else {
      setIsConditionMet2(false);
    }

    // 증감율의 상승기조가 1년 이상 지속되었는가?
    if (priceChangeRateData.uptrend >= 52) {
      setIsConditionMet3(true);
    } else {
      setIsConditionMet3(false);
    }
  }, [
    transactionVolumeSalesSeoul,
    transactionVolumeJeonseSeoul,
    priceChangeRateData.uptrend,
    priceChangeRateData.downtrend,
  ]);

  // ======================================================================
  return (
    <div className={styles.mainContainer}>
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
        <div className={styles.inner}>
          <span className={styles.title}>
            시장 반등의 증상과 현황
            <br />
            <span className={styles.label}>(기준 : 서울 아파트)</span>
          </span>

          <div className={styles.contents}>
            <div className={styles.content}>
              <p className={styles.symptom}>
                <span className={styles.counter}>증상1</span>
                <span>
                  &nbsp;&nbsp;월별 매매 거래량이 1만건 이상을 기록한다.
                </span>
              </p>
              <div className={styles.situation}>
                {isConditionMet1 ? <GreenLamp /> : <RedLamp />}
                <div className={styles.text}>
                  {isConditionMet1 ? (
                    <p className={styles.greenText}>
                      {" "}
                      현재 매매 거래량이 1만건을 돌파하였습니다.
                    </p>
                  ) : (
                    <p className={styles.redText}>
                      {" "}
                      현재 매매 거래량은 1만건 미만입니다.
                    </p>
                  )}
                  <p
                    className={
                      isConditionMet1 ? styles.greenText : styles.redText
                    }
                  >
                    <span>
                      -{" "}
                      {`${
                        transactionVolumeSalesSeoul
                          ? transactionVolumeSalesSeoul.year
                          : "" // && 쓰지않은 이유는 undefined가 UI에 출력되는 것을 방지하기 위함.
                      }년 ${
                        transactionVolumeSalesSeoul
                          ? transactionVolumeSalesSeoul.month
                          : ""
                      }월`}
                      기준{" "}
                    </span>
                    매매 거래량
                    <span>
                      {" "}
                      {transactionVolumeSalesSeoul
                        ? transactionVolumeSalesSeoul.value
                        : ""}
                      건
                    </span>
                  </p>
                  <p className={styles.recentAmountDataLink} onClick={move}>
                    {transactionVolumeSalesSeoul
                      ? transactionVolumeSalesSeoul.month + 1
                      : ""}
                    월 실시간 데이터 확인하기
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.content}>
              <p className={styles.symptom}>
                <span className={styles.counter}>증상2</span>
                <span>
                  &nbsp;&nbsp;월별 매매 거래량이 전세 거래량을 추월한다.
                </span>
              </p>
              <div className={styles.situation}>
                {isConditionMet2 ? <GreenLamp /> : <RedLamp />}
                <div className={styles.text}>
                  {isConditionMet2 ? (
                    <p className={styles.greenText}>
                      {" "}
                      현재 매매 거래량이 전세 거래량을 추월했습니다.{" "}
                    </p>
                  ) : (
                    <p className={styles.redText}>
                      {" "}
                      현재 매매 거래량 보다 전세 거래량이 우세합니다.
                    </p>
                  )}
                  <p
                    className={
                      isConditionMet2 ? styles.greenText : styles.redText
                    }
                  >
                    <span>
                      -{" "}
                      {`${
                        transactionVolumeSalesSeoul
                          ? transactionVolumeSalesSeoul.year
                          : ""
                      }년 ${
                        transactionVolumeSalesSeoul
                          ? transactionVolumeSalesSeoul.month
                          : ""
                      }월`}
                      기준{" "}
                    </span>
                    매매 거래량{" "}
                    <span>
                      {transactionVolumeSalesSeoul
                        ? transactionVolumeSalesSeoul.value
                        : ""}
                      건
                    </span>
                  </p>
                  <p
                    className={
                      isConditionMet2 ? styles.greenText : styles.redText
                    }
                  >
                    <span>
                      -{" "}
                      {`${
                        transactionVolumeJeonseSeoul
                          ? transactionVolumeJeonseSeoul.year
                          : ""
                      }년 ${
                        transactionVolumeJeonseSeoul
                          ? transactionVolumeJeonseSeoul.month
                          : ""
                      }월`}
                      기준{" "}
                    </span>
                    전세 거래량{" "}
                    <span>
                      {transactionVolumeJeonseSeoul
                        ? transactionVolumeJeonseSeoul.value
                        : ""}
                      건
                    </span>
                  </p>
                  <p className={styles.recentAmountDataLink} onClick={move}>
                    {transactionVolumeSalesSeoul
                      ? transactionVolumeSalesSeoul.month + 1
                      : ""}
                    월 실시간 데이터 확인하기
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.content}>
              <p className={styles.symptom}>
                <span className={styles.counter}>증상3</span>
                <span>&nbsp;&nbsp;주간 매매가 증감률이 1년 이상 상승세다.</span>
              </p>
              <div className={styles.situation}>
                {isConditionMet3 ? <GreenLamp /> : <RedLamp />}
                <div className={styles.text}>
                  <p
                    className={
                      isConditionMet3 ? styles.greenText : styles.redText
                    }
                  >
                    현재 상승세가{" "}
                    <span>
                      {priceChangeRateData && priceChangeRateData.uptrend}주
                    </span>
                    간 지속되고 있습니다.
                  </p>
                  <p
                    className={
                      isConditionMet3 ? styles.greenText : styles.redText
                    }
                  >
                    현재 하락세가{" "}
                    <span>
                      {priceChangeRateData && priceChangeRateData.downtrend}주
                    </span>
                    간 지속되고 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
