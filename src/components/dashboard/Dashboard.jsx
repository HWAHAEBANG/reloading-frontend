import React, { useEffect, useState } from "react";
import Hai from "../../graph/Hai";
import styles from "./Dashboard.module.css";
import UnsoldHouse from "../../graph/UnsoldHouse";
import Pir from "../../graph/Pir";
import PriceChangeRate from "../../graph/PriceChangeRate";
import Gauge from "../../graph/Gauge";
import SpiderWeb from "../../graph/SpiderWeb";
import AmountAndPrice from "../../graph/AmountAndPrice";
import JeonsePriceRatio from "../../graph/JeonsePriceRatio";
import { useNavigate } from "react-router-dom";
import Signal from "../../graph/Signal";
import { useSelector } from "react-redux";
import axios from "axios";
import useSound from "use-sound";

// 현재 서울 기준으로 하였음 추후 리팩토링 필요할 수도.
export default function Dashboard() {
  // fetch data ========================================
  const userInfo = useSelector((state) => state.userInfo);

  const [chartsData, setChartsData] = useState();

  useEffect(() => {
    axios
      .get(`http://reloading.co.kr/api/allCharts`, {
        method: "GET",
        withCredentials: true,
        params: {
          userId: userInfo.userInfo.id, // 클라이언트에서 현재 로그인 중인 회원의 ID 변수를 전달
        },
      })
      .then((response) => {
        if (response.data.length === 0) {
          return;
          // setChartsData(`일치하는 정보가 없습니다.`);
        } else setChartsData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // ===================================================
  const navigate = useNavigate();

  const enter = (e) => {
    if (e.target.tagName.toLowerCase() !== "div") {
      e.currentTarget.click(); // 상위 <div> 요소 클릭 이벤트 강제 실행
      return;
    }

    navigate(`/allCharts/${e.target.id}`, {
      state: {
        data: chartsData.filter((item) => item.id === e.target.id)[0],
      },
    });
  };

  // sound ======
  const [disk] = useSound("/sounds/disk.wav", { volume: 1 });

  useEffect(() => {
    disk();
  }, []);
  // sound ======

  return (
    <div className={styles.gridContainer}>
      <div
        id='amountAndPrice'
        onClick={enter}
        // to='/allCharts/amountAndPrice'
        className={`${styles.box} ${styles.box6}`}
      >
        <AmountAndPrice />
      </div>
      <div
        id='pir'
        onClick={enter}
        // to='/allCharts/pir'
        className={`${styles.box} ${styles.box5}`}
      >
        <Pir />
      </div>
      <div
        id='hai'
        onClick={enter}
        // to='/allCharts/hai'
        className={`${styles.box} ${styles.box1}`}
      >
        <Hai />
      </div>

      {/* <div to='/allCharts' className={`${styles.box} ${styles.box4}`}>
        Box 4
      </div> */}

      <div
        id='spiderWeb'
        onClick={enter}
        // to='/allCharts/spiderWeb'
        className={`${styles.box} ${styles.box2}`}
      >
        <SpiderWeb />
      </div>
      <div
        id='signal'
        // onClick={enter}
        // to='/allCharts/signal'
        className={`${styles.box} ${styles.box7} ${styles.nonClick}`}
      >
        <Signal chartsData={chartsData} />
      </div>
      <div
        id='priceChangeRate'
        onClick={enter}
        // to='/allCharts/priceChangeRate'
        className={`${styles.box} ${styles.box8}`}
      >
        <PriceChangeRate />
      </div>
      <div
        id='unsoldHouse'
        onClick={enter}
        // to='/allCharts/unsoldHouse'
        className={`${styles.box} ${styles.box9}`}
      >
        <UnsoldHouse />
      </div>
      <div
        id='jeonsePriceRatio'
        onClick={enter}
        // to='/allCharts/jeonsePriceRatio'
        className={`${styles.box} ${styles.box10}`}
      >
        <JeonsePriceRatio />
      </div>

      <div
        id='gauge'
        onClick={enter}
        // to='/allCharts/gauge'
        className={`${styles.box} ${styles.box3}`}
      >
        <Gauge />
      </div>
    </div>
  );
}
