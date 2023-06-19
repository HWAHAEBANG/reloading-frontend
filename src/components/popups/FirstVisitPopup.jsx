import React from "react";
import styles from "./FirstVisitPopup.module.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfoAction } from "../../redux";
import axios from "axios";

export default function FirstVisitPopup({ onClose }) {
  // 더보기 버튼 클릭시 about us 페이지로 이동 ======================================================================
  const navigate = useNavigate();

  const handleNavigate = () => {
    dispatch(
      setUserInfoAction({
        ...userInfo.userInfo,
        today_visit_cnt: userInfo.userInfo.today_visit_cnt + 1,
      })
    );
    navigate("/aboutUs");
    onClose(false);
  };
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
    <div className={styles.firstVisitPopup}>
      <div className={styles.inner}>
        <p className={styles.title}>WELCOME!</p>
        <p className={styles.subTitle}>
          <span>{userInfo.userInfo.nickname}</span>님, 첫 방문을 환영합니다.
        </p>
        <br />
        <p className={styles.question}>RE:LOADING 은 어떤 곳인가요?</p>
        <br />
        <div className={styles.description}>
          <span>RE:LOADING</span> 은 부동산 시장의 상태를 진단할 수 있는 수많은
          지표들을 한 곳에 모아 차트로 보기쉽게 표현하여 부동산 시장의 분위기를
          파악할 수 있도록 돕는 웹서비스입니다.
          <br />
          <br />
          <span>RE:LOADING</span> 의 모든 데이터는 <span>각종 정부 사이트</span>{" "}
          또는 <span>공신력있는 플랫폼</span>
          들로부터 제공받음으로써 <span>높은 정확성</span>을 보장하며,{" "}
          <span>일일 단위 업데이트</span>를 통해 <span>최신성을 유지</span>
          합니다.
          <br />
          <br />
          저희의 서비스가 <span>{userInfo.userInfo.nickname}</span> 님의
          합리적인 매수 결정에 도움을 드릴 수 있길 진심으로 소망합니다.
        </div>
        <div className={styles.btnList}>
          <button className={styles.btn} onClick={handleNavigate}>
            SEE MORE
          </button>
          <button className={styles.btn} onClick={confirm}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
