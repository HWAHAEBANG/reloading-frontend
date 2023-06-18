import { Outlet } from "react-router-dom";
import TopBar from "./components/topbar/TopBar";
import NavBar from "./components/navbar/NavBar";
import styles from "./App.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

import ImportantNotificationPopup from "./components/popups/ImportantNotificationPopup";
import DataUpdateLogPopup from "./components/popups/DataUpdateLogPopup";
import FirstVisitPopup from "./components/popups/FirstVisitPopup";
import { useSelector } from "react-redux";
import SuggestModal from "./components/popups/SuggestModal";

function App() {
  const [showNav, setShowNav] = useState(false); // for Nav Button
  const [visibleSuggestModal, setVisibleSuggestModal] = useState(false);
  //popup condition =======================================================
  /**
   * Condition Rule:사용자별 첫방문 여부와 업데이트 유무에 따라 보여줄 팝업을 다르게 설정.
   * 완전 첫 방문 : firstVisit 팝업
   * 오늘 첫 방문 : dataUpdateLog 팝업, notification 팝업.
   */
  //from redux
  const userInfo = useSelector((state) => state.userInfo);
  const [isFirstVisitToday, setIsFirstVisitToday] = useState(
    // 이건 set 필요없음.
    userInfo.userInfo.today_visit_cnt === 1
  );
  const [isFirstVisitTotal, setIsFirstVisitTotal] = useState(
    userInfo.userInfo.total_visit_cnt === 1
  );

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  const [hasTodayNotification, setHasTodayNotification] = useState();
  const [hasTodayDataUpdate, setHasTodayDataUpdate] = useState();
  useEffect(() => {
    Promise.all([
      axios.get(`https://reloading.co.kr/api/notification/notification`, {
        withCredentials: true,
      }),
      axios.get(`https://reloading.co.kr/api/notification/dataUpdateLog`, {
        withCredentials: true,
      }),
    ])
      .then((responses) => {
        const notificationResponse = responses[0];
        const dataUpdateLogResponse = responses[1];

        // 데이터 저장
        setHasTodayNotification(
          notificationResponse.data.data.some(
            (item) => item.created_at.split("T")[0] === formattedDate
          )
        );
        setHasTodayDataUpdate(
          dataUpdateLogResponse.data.data.some(
            (item) => item.created_at.split("T")[0] === formattedDate
          )
        );
      })
      .catch((error) => {
        // 에러 처리
        console.error(error);
        // setLoading(false);
      });
  }, []);

  //=======================================================================

  return (
    <div className={styles.mainContainer}>
      <NavBar
        showNav={showNav}
        setShowNav={setShowNav}
        setVisibleSuggestModal={setVisibleSuggestModal}
      />
      {/* 메뉴 늘렀을 때 사라져야하므로 */}
      <div
        className={`${styles.subContainer} ${showNav ? styles.showNavBar : ""}`}
      >
        <TopBar
          showNav={showNav}
          setShowNav={setShowNav}
          setVisibleSuggestModal={setVisibleSuggestModal}
        />
        <Outlet />
      </div>
      {/* 조건별 생성 팝업  ======================================*/}
      {/*세개의 팝업 다 띄울게 없거나, 오늘 첫 방문이 아닐 경우 배경까지 다 없앤다. */}
      {(isFirstVisitTotal || hasTodayDataUpdate || hasTodayNotification) &&
      isFirstVisitToday ? (
        <div className={styles.popupBg}>
          {hasTodayDataUpdate ? (
            <DataUpdateLogPopup onClose={setHasTodayDataUpdate} />
          ) : (
            ""
          )}
          {hasTodayNotification ? (
            <ImportantNotificationPopup onClose={setHasTodayNotification} />
          ) : (
            ""
          )}
          {isFirstVisitTotal ? (
            <FirstVisitPopup onClose={setIsFirstVisitTotal} />
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
      {/* ==========================================================*/}
      {/* 개발자에게 제안 모달  ======================================*/}
      {visibleSuggestModal ? (
        <div className={styles.popupBg}>
          <SuggestModal onClose={setVisibleSuggestModal} />
        </div>
      ) : (
        ""
      )}
      {/* ==========================================================*/}
    </div>
  );
}

export default App;
