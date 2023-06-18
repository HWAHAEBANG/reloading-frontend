import React, { useEffect, useState } from "react";
import styles from "./TopicNews.module.css";
import axios from "axios";
import { formatAgo } from "../../util/date";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";
import { FiSearch } from "react-icons/fi";
import useSound from "use-sound";

const RECOMMEND_KEYWORD = [
  "부동산",
  "거래량",
  "미분양",
  "전세가율",
  "금리",
  "PIR",
  "HAI",
];

export default function TopicNews() {
  // 효과음 ==========================================================================================================
  const [toggle] = useSound("/sounds/toggle.wav", { volume: 1 });
  const [keyboard] = useSound("/sounds/keyboard.wav", { volume: 1 });
  // ================================================================================================================

  const [keyword, setKeyword] = useState("");
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [articles, setArticles] = useState([]);

  //select =============================================
  const [sortVisible, setSortVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("정확도순");
  // ===================================================

  // 메뉴 진입시 추천 키워드 중에서 램덤으로 한 개로 검색해줌 ===========================================================
  useEffect(() => {
    const randomIndex = Math.floor(
      (Math.random() * 10) % RECOMMEND_KEYWORD.length
    );
    setSelectedKeyword(RECOMMEND_KEYWORD[randomIndex]);
  }, []);
  // ================================================================================================================

  // 입력받은 키워드와 정렬 종류에 따른 뉴스 데이터 받아오기 =============================================================
  useEffect(() => {
    if (!selectedKeyword) return;
    axios
      .get(
        `https://reloading.co.kr/api/topicNews?keyword=${selectedKeyword}&selectedSort=${selectedSort}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setArticles(response.data.data);
      });
  }, [selectedKeyword, selectedSort]);
  // ================================================================================================================

  // 입력값 핸들링 ===================================================================================================
  const handleKeyword = (e) => {
    keyboard();
    setKeyword(e.target.value);
  };
  // ================================================================================================================

  // 엔터키로 검색 가능토록 함 ========================================================================================
  const handleSubmit = (e) => {
    toggle();
    if (e.type === "keyup") {
      e.code === "Enter" && setSelectedKeyword(keyword);
    } else {
      setSelectedKeyword(keyword);
    }
  };
  // ================================================================================================================

  // 정렬 선택시  ====================================================================================================
  const handleSelectSort = (e) => {
    toggle();
    setSelectedSort(e.target.innerText);
    setSortVisible((prev) => !prev);
  };
  // ================================================================================================================
  return (
    <div className={styles.mainContainer}>
      <div className={styles.subContainer}>
        <div className={styles.inner}>
          <div className={styles.topArea}>
            <div className={styles.title}>TOPIC NEWS</div>
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
                <li onClick={handleSelectSort}>
                  <div className='list'>정확도순</div>
                </li>
                <li onClick={handleSelectSort}>
                  <div className='list'>최신순</div>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.searchArea}>
            <input
              className={styles.inputBox}
              type='text'
              value={keyword}
              onChange={handleKeyword}
              onKeyUp={handleSubmit}
              placeholder='키워드를 입력해주세요.'
            />
            <button className={styles.inputBtn} onClick={handleSubmit}>
              <FiSearch />
            </button>
          </div>
          <div className={styles.sortArea}>
            <div className={styles.recommendBox}>
              <p> 추천 검색어 </p>
              {RECOMMEND_KEYWORD.map((item, index) => (
                <div
                  key={index}
                  className={`${styles.recommend} ${
                    selectedKeyword.toUpperCase() === item ? styles.active : ""
                  }`}
                  onClick={() => {
                    setSelectedKeyword(item);
                  }}
                >
                  #{item}
                </div>
              ))}
            </div>
          </div>
          <div className={`${styles.resultArea} scrollBar`}>
            <div className={styles.articlesContainer}>
              {articles.map((article, index) => (
                <a
                  key={index}
                  className={styles.articleContainer}
                  href={article.link}
                  target='_blank'
                >
                  <p
                    className={styles.articleTitle}
                    dangerouslySetInnerHTML={{ __html: article.title }}
                  ></p>
                  <p className={styles.articlePubDate}>
                    {formatAgo(article.pubDate, "ko")}
                  </p>
                  <p
                    className={styles.articleDescription}
                    dangerouslySetInnerHTML={{ __html: article.description }}
                  ></p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
