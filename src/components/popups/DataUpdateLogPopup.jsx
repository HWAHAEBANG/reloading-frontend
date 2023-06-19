import React, { useEffect, useState } from "react";
import styles from "./DataUpdateLogPopup.module.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfoAction } from "../../redux";

export default function DataUpdateLogPopup({ onClose }) {
  // 오늘 날짜를 YYYY-MM=DD 형태로 파싱=================================================================================
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  // ================================================================================================================

  // 업데이트 이력 데이터를 가져와서 오늘 날짜에 해당하는 것만 상태에 담기 ================================================
  const [dataUpdateLog, setDataUpdateLog] = useState();
  useEffect(() => {
    axios
      .get(`https://reloading.co.kr/api/notification/dataUpdateLog`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.length === 0) {
          return;
        } else {
          //  데이터 업데이트 로그 파싱 로직 =====================================
          const logList = response.data.data;

          let insertNo = 0;
          const parsedDataUpdateLogList = logList.reduce((acc, cur) => {
            const dateIndex = acc.findIndex(
              (item) => item.date === cur.created_at.split("T")[0]
            );
            if (dateIndex === -1) {
              insertNo++;
              acc.push({
                no: insertNo,
                date: cur.created_at.split("T")[0],
                message: [cur.message],
              });
            } else {
              acc[dateIndex].message.push(cur.message);
            }
            return acc;
          }, []);
          setDataUpdateLog(
            parsedDataUpdateLogList.filter(
              (item) => item.date === formattedDate
            )
          );
          // ===================================================================
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  // ================================================================================================================

  // 오늘 더이상 보지 않기 위해 실행. DB애눈 번영안됨. ================================================================
  // 이게 없을 경우 첫 방문시 새로고침 할때마다 모달이 뜸.
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);

  const confirm = () => {
    // getAccessToken();
    dispatch(
      setUserInfoAction({
        ...userInfo.userInfo,
        today_visit_cnt: userInfo.userInfo.today_visit_cnt + 1,
      })
    );
    onClose(false);
  };
  // ================================================================================================================

  return (
    <div className={styles.dataUpdateLogPopup}>
      <div className={styles.inner}>
        <div className={styles.titleContainer}>
          <p className={styles.title}>DATA UPDATED</p>
          <p className={styles.koTitle}>데이터 업데이트 이력</p>
        </div>
        <p className={styles.subTitle}>
          <span></span>금일 ({dataUpdateLog && dataUpdateLog[0].date}) 다음{" "}
          {dataUpdateLog && dataUpdateLog[0].message.length}건 변동사항이 차트에
          반영되었습니다.
        </p>
        <div className={`${styles.listContainer} scrollBar`}>
          <div className={styles.listContainerInner}>
            {dataUpdateLog &&
              dataUpdateLog[0].message.map((item, index) => (
                <p key={index}>- {item}</p>
              ))}
          </div>
        </div>
        <p className={styles.postScript}>
          위 내용은 Notification 메뉴에서 다시 확인하실 수 있습니다.
        </p>
        <div className={styles.btnList}>
          <button className={styles.btn} onClick={confirm}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
