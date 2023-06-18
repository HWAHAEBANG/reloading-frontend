import React, { useState } from "react";
import styles from "./ChartCard.module.css";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useSound from "use-sound";
import axios from "axios";

export default function ChartCard({
  data,
  data: { id, thumbnail, title, subTitle, view_count: viewCount },
}) {
  // 효과음 ==========================================================================================================
  const [toggle] = useSound("/sounds/toggle.wav", { volume: 1 });
  // ================================================================================================================

  // 클릭시 조회수 카운트 업 ==========================================================================================
  const navigate = useNavigate();
  const enter = () => {
    navigate(`/allCharts/${id}`, { state: { data: data } });

    axios
      .put(`https://reloading.co.kr/api/allCharts/viewCount`, {
        method: "PUT",
        withCredentials: true,
        data: {
          chartId: id,
        },
      })
      .then((response) => {})
      .catch((error) => {
        console.log("에러코드", error.response.status, error.response.data);
      });
  };
  // ================================================================================================================

  // 하트 아이콘(나의 차트) 관련 이벤트 ================================================================================
  const userInfo = useSelector((state) => state.userInfo);

  // 받아온 데이터에 따라 하트 아이콘 종류 결정
  const [heart, setHeart] = useState(data.isFavorite ? true : false);
  // 나의 차트 설정 =====================================
  const heartOn = (e) => {
    e.stopPropagation();
    if (userInfo.userInfo.id) {
      axios
        .post(`https://reloading.co.kr/api/myCharts/add`, {
          method: "POST",
          withCredentials: true,
          data: {
            userId: userInfo.userInfo.id,
            chartId: id,
          },
        })
        .then((response) => {
          setHeart(true);
          toggle();
        })
        .catch((error) => {
          console.log("에러코드", error.response.status, error.response.data);
        });
    } else {
      alert.error("My charts 에 추가하시려면 로그인을 해주세요. 😘");
    }
  };
  // ===================================================
  // 나의 차트 취소 =====================================
  const heartOff = (e) => {
    e.stopPropagation();
    if (userInfo.userInfo.id) {
      // 어차피 로그인 안하면 누를 수가 없긴 함. 혹시몰라서 조건문 처리(추후 삭제 고려)
      axios
        // delete 메서드로 작성했을 시 서버 콘솔에 다음과 같은 애러 뜸. 추후 다시 시도 요망
        // Cannot destructure property 'userId' of 'req.body.data' as it is undefined.
        .post(`api/myCharts/delete`, {
          method: "POST",
          withCredentials: true,
          data: {
            userId: userInfo.userInfo.id,
            chartId: id,
          },
        })
        .then((response) => {
          setHeart(false);
          toggle();
        })
        .catch((error) => {
          console.log("에러코드", error.response.status, error.response.data);
        });
    } else {
      alert.error("My charts 에 삭제하시려면 로그인을 해주세요. 😘");
    }
  };
  // ===================================================
  // ================================================================================================================

  // 랜덤한 애니메이션 효과를 주기 위한 랜덤값 생성기
  const randomIndex = Math.floor((Math.random() * 10) % 5);

  return (
    // 에니메이션을 랜덤하고 다양하게 주기위한 로직. //JSX에서는 switch문 사용 불가.
    <div
      onClick={enter}
      className={
        randomIndex === 0
          ? `${styles.maincontainer0}`
          : randomIndex === 1
          ? `${styles.maincontainer1}`
          : randomIndex === 2
          ? `${styles.maincontainer2}`
          : randomIndex === 3
          ? `${styles.maincontainer3}`
          : `${styles.maincontainer4}`
      }
    >
      {/* 여기 */}
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <div className={styles.topArea}>
        <p className={styles.viewCount}>{viewCount && viewCount} Views</p>
        {heart ? (
          <AiFillHeart onClick={heartOff} />
        ) : (
          <AiOutlineHeart onClick={heartOn} />
        )}
      </div>
      <div className={styles.chartImgArea}>
        <img src={`${process.env.PUBLIC_URL} ${thumbnail}`} alt='' />
      </div>
      <div className={styles.textArea}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>{title}</div>
        </div>
        <p className={styles.description}>{subTitle}</p>
      </div>
    </div>
  );
}
