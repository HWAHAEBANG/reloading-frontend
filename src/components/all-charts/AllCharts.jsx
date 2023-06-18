import React, { useEffect, useState } from "react";
import styles from "./AllCharts.module.css";
import ChartCard from "../chart-card/ChartCard";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";
import { FiSearch } from "react-icons/fi";
// import { mockData } from "../../data/mockdata";
import axios from "axios";
import { useSelector } from "react-redux";
import useSound from "use-sound";

export default function AllCharts() {
  // 효과음 =========================================================================================================
  const [keyboard] = useSound("/sounds/keyboard.wav", { volume: 1 });
  const [grow] = useSound("/sounds/grow.wav", { volume: 1 });
  const [toggle] = useSound("/sounds/toggle.wav", { volume: 1 });

  useEffect(() => {
    grow();
  }, []);
  // ===============================================================================================================

  // 모든 차트 뎉이터 받아오기 =========================================================================================
  const userInfo = useSelector((state) => state.userInfo);

  const [chartsData, setChartsData] = useState();
  useEffect(() => {
    axios
      .get(`https://reloading.co.kr/api/allCharts`, {
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
  // =================================================================================================================

  // 정렬기능 ========================================================================================================= // 블로그 포스팅
  //select =============================================
  const [sortVisible, setSortVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("조회수순");
  // ===================================================
  const sortList = ["조회수순", "최신순", "이름순"];
  // select ============================================
  const handleSelectSort = (e) => {
    toggle();
    setSelectedSort(e.target.innerText);
    setSortVisible((prev) => !prev);
  };
  // ===================================================

  const sortSwitch = (chartsData, selectedSort) => {
    let sortedData = [...chartsData]; // 원본 배열 복사

    switch (selectedSort) {
      case "조회수순":
        sortedData.sort((a, b) => b.view_count - a.view_count);
        break;
      case "최신순":
        sortedData.sort(
          (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
        );
        break;
      case "이름순":
        sortedData.sort((a, b) => (a.title > b.title ? 1 : -1));
        break;
      default:
    }

    return sortedData; // 정렬된 배열 반환
  };
  // ================================================================================================================

  // 검색 기능 ======================================================================================================= // 블로그 포스팅
  const [keyword, setKeyword] = useState("");
  const handleKeyword = (e) => {
    keyboard();
    setKeyword(e.target.value);
  };
  // ===================================================
  const [filteredChartsData, setFilteredChartsData] = useState(chartsData); //?

  useEffect(() => {
    if (!chartsData) return;
    keyword
      ? setFilteredChartsData(
          sortSwitch(
            chartsData.filter((data) =>
              data.title
                .toLowerCase()
                .replace(/\s/g, "")
                .includes(keyword.toLowerCase().replace(/\s/g, ""))
            ),
            selectedSort
          )
        )
      : setFilteredChartsData(sortSwitch(chartsData, selectedSort));
  }, [chartsData, keyword, selectedSort]);

  // ================================================================================================================
  return (
    <div className={styles.mainContainer}>
      <div className={styles.subContainer}>
        <div className={styles.topArea}>
          <div className={styles.title}>ALL CHARTS</div>
          <div className={styles.searchSection}>
            <input
              className={styles.inputBox}
              type='text'
              value={keyword}
              onChange={handleKeyword}
              // onKeyUp={handleSubmit} // 자동 검색으로 변경 완료
              placeholder='키워드를 입력해주세요.'
            />
            <button
              className={styles.inputBtn}
              // onClick={handleSubmit}
            >
              <FiSearch />
            </button>
            <div className='selectBox'>
              <div
                className='pl on'
                onClick={() => setSortVisible((prev) => !prev)}
              >
                {selectedSort}
                {sortVisible ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
              </div>
              <ul
                className={sortVisible ? "listbox  visible" : "listbox"}
                id='listbox'
              >
                {sortList.map((item, index) => (
                  <li key={index} onClick={handleSelectSort}>
                    <div className='list'>{item}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className={`${styles.inner} scrollBar`}>
          <div
            className={
              filteredChartsData && filteredChartsData.length < 5 // 그리드의 한계를 보완하기 위함
                ? styles.under5ea
                : styles.wholeContentsArea
            }
          >
            {filteredChartsData &&
              filteredChartsData.map((data) => (
                <ChartCard key={data.id} data={data} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
