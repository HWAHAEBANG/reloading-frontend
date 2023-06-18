import React, { useEffect, useState, useRef } from "react";
import styles from "./Notification.module.css";
import axios from "axios";
import { MdFiberNew } from "react-icons/md";

export default function Notification() {
  const [notificationList, setNotificationList] = useState();
  const [dataUpdateLogList, setDataUpdateLogList] = useState();
  const [releaseNoteList, setReleaseNoteList] = useState();

  // 컨텐츠 토글 관련  ===============================================================================================
  // ========================================
  const [notificationPostBodyVisible, setNotificationPostBodyVisible] =
    useState([]);

  const handleClickNotificationPostHeader = (no) => {
    const changingArr = [...notificationPostBodyVisible]; // 주의사항!!!!
    changingArr[no - 1] = !changingArr[no - 1];
    setNotificationPostBodyVisible(changingArr);
  };
  // ========================================
  const [dataUpdateLogPostBodyVisible, setDataUpdateLogPostBodyVisible] =
    useState([]);

  const handleClickDataUpdateLogPostHeader = (no) => {
    const changingArr = [...dataUpdateLogPostBodyVisible]; // 주의사항!!!!
    changingArr[no - 1] = !changingArr[no - 1];
    setDataUpdateLogPostBodyVisible(changingArr);
  };
  // ========================================
  const [releaseNotePostBodyVisible, setReleaseNotePostBodyVisible] = useState(
    []
  );

  const handleClickReleaseNotePostHeader = (no) => {
    const changingArr = [...releaseNotePostBodyVisible]; // 주의사항!!!!
    changingArr[no - 1] = !changingArr[no - 1];
    setReleaseNotePostBodyVisible(changingArr);
  };
  // ========================================
  // ================================================================================================================

  // 데이터 받아오기 ==================================================================================================
  useEffect(() => {
    Promise.all([
      axios.get(`https://reloading.co.kr/api/notification/notification`, {
        withCredentials: true,
      }),
      axios.get(`https://reloading.co.kr/api/notification/dataUpdateLog`, {
        withCredentials: true,
      }),
      axios.get(`https://reloading.co.kr/api/notification/releaseNote`, {
        withCredentials: true,
      }),
    ])
      .then((responses) => {
        const notificationResponse = responses[0];
        const dataUpdateLogResponse = responses[1];
        const releaseNoteResponse = responses[2];

        //  데이터 업데이트 로그 파싱 로직 ======================================
        const logList = dataUpdateLogResponse.data.data;

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
        // =====================================================================

        // 데이터 저장
        setNotificationList(notificationResponse.data.data.reverse());
        setDataUpdateLogList(parsedDataUpdateLogList.reverse());
        setReleaseNoteList(releaseNoteResponse.data.data.reverse());

        // 테이터별 개수만큼 vidible 요소 생성
        setNotificationPostBodyVisible(
          notificationResponse.data.data.map(() => false)
        );

        setDataUpdateLogPostBodyVisible(
          parsedDataUpdateLogList.map(() => false)
        );
        setReleaseNotePostBodyVisible(
          releaseNoteResponse.data.data.map(() => false)
        );

        // 추가 작업을 수행할 수 있습니다.
        // setLoading(false);
      })
      .catch((error) => {
        // 에러 처리
        console.error(error);
        // setLoading(false);
      });
  }, []);
  // ================================================================================================================

  //글짜 길 시 흐르기 효과 ============================================================================================
  const notiTextRefs = useRef([]);
  const updateTextRefs = useRef([]);
  const releaseTextRefs = useRef([]);
  // ==========================================================
  useEffect(() => {
    if (!notificationList) return;

    if (notiTextRefs.current.length === notificationList.length) {
      notiTextRefs.current.forEach((textRef, index) => {
        const textElement = textRef;
        if (textElement && textElement.scrollWidth > textElement.clientWidth) {
          // const distance = textElement.scrollWidth - textElement.clientWidth;
          // const duration = distance * 10; // 움직이는 시간 조정 (크면 빠르게, 작으면 느리게)
          textElement.style.animation = `scrollTextAnimation${index} 10000ms linear infinite`;
          //==============
          // CSS에 애니메이션 정의
          const animationStyle = `
          @keyframes scrollTextAnimation${index} {
            0% { transform: translateX(0); }
            30% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          `;
          // 스타일 태그에 애니메이션 스타일 추가
          const styleTag = document.createElement("style");
          styleTag.innerHTML = animationStyle;
          document.head.appendChild(styleTag);
          //==============
        }
      });
    }
  }, [notificationList]);
  // ==========================================================
  // ==========================================================
  useEffect(() => {
    if (!dataUpdateLogList) return;

    if (updateTextRefs.current.length === dataUpdateLogList.length) {
      updateTextRefs.current.forEach((textRef, index) => {
        const textElement = textRef;
        if (textElement && textElement.scrollWidth > textElement.clientWidth) {
          // const distance = textElement.scrollWidth - textElement.clientWidth;
          // const duration = distance * 10; // 움직이는 시간 조정 (크면 빠르게, 작으면 느리게)
          textElement.style.animation = `scrollTextAnimation${index} 10000ms linear infinite`;
          //==============
          // CSS에 애니메이션 정의
          const animationStyle = `
          @keyframes scrollTextAnimation${index} {
            0% { transform: translateX(0); }
            30% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          `;
          // 스타일 태그에 애니메이션 스타일 추가
          const styleTag = document.createElement("style");
          styleTag.innerHTML = animationStyle;
          document.head.appendChild(styleTag);
          //==============
        }
      });
    }
  }, [dataUpdateLogList]);
  // ==========================================================
  // ==========================================================
  useEffect(() => {
    if (!releaseNoteList) return;

    if (releaseTextRefs.current.length === releaseNoteList.length) {
      releaseTextRefs.current.forEach((textRef, index) => {
        const textElement = textRef;
        if (textElement && textElement.scrollWidth > textElement.clientWidth) {
          // const distance = textElement.scrollWidth - textElement.clientWidth;
          // const duration = distance * 10; // 움직이는 시간 조정 (크면 빠르게, 작으면 느리게)
          textElement.style.animation = `scrollTextAnimation${index} 10000ms linear infinite`;
          //==============
          // CSS에 애니메이션 정의
          const animationStyle = `
          @keyframes scrollTextAnimation${index} {
            0% { transform: translateX(0); }
            30% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          `;
          // 스타일 태그에 애니메이션 스타일 추가
          const styleTag = document.createElement("style");
          styleTag.innerHTML = animationStyle;
          document.head.appendChild(styleTag);
          //==============
        }
      });
    }
  }, [releaseNoteList]);
  // ==========================================================
  //====================================================================================================
  return (
    <div className={styles.mainContainer}>
      <div className={styles.subContainer}>
        <div className={styles.topArea}>
          <div className={styles.title}>NOTIFICATION</div>
        </div>
        <div className={`${styles.contentsArea} scrollBar`}>
          <p className={styles.explainArea}>
            <span>RE:LOADING</span>은 다양한 데이터의 특성에 따라{" "}
            <span>주기적으로 업데이트</span>를 진행하여{" "}
            <span>최신성을 보장</span>
            하도록 노력하고있습니다.
            <br />
            <span>매일 02:00AM</span> 각 소스 출처로부터 최신 데이터를 확인하고
            차트에 반영합니다. 또한 몇몇 데이터의 경우 과거 데이터가 변경되기도
            하는 특성을 고려해, <span>매주 토요일 04:00AM</span> 데이터 전체를
            새로운 데이터로 교체하고 있습니다.
          </p>
          <div className={styles.boardArea}>
            <div className={styles.notificationBox}>
              <p className={styles.subTitle}>
                <img
                  src={process.env.PUBLIC_URL + "/image/favicon.png"}
                  alt='fav'
                  className={styles.favicon}
                />
                공지사항
              </p>
              <div className={`${styles.listContainer} scrollBar`}>
                <div className={styles.listContainerInner}>
                  {notificationList &&
                    notificationList.map((item) => (
                      <div key={item.no} className={styles.post}>
                        <div
                          className={styles.postHeader}
                          onClick={() =>
                            handleClickNotificationPostHeader(item.no)
                          }
                        >
                          <span>{item.no}</span>
                          <div className={styles.contentTitle}>
                            <span
                              ref={(el) =>
                                (notiTextRefs.current[item.no - 1] = el)
                              }
                            >
                              {item.title}{" "}
                              <span className={styles.newContainer}>
                                {/*박스 안커지게 하면서 위치 잡아주기 위해존재 */}
                                {item.no === notificationList.length ? ( // 가장 최근 게시물만.
                                  <MdFiberNew className={styles.new} />
                                ) : (
                                  ""
                                )}
                              </span>
                            </span>
                          </div>
                          <span>{item.author}</span>
                          <span>{item.created_at.split("T")[0]}</span>
                        </div>
                        {notificationPostBodyVisible[item.no - 1] ? (
                          <div className={`${styles.postBody} scrollBar`}>
                            <div className={styles.postBodyInner}>
                              <p
                                className={styles.notiDescripton}
                                dangerouslySetInnerHTML={{
                                  __html: item.description,
                                }}
                              ></p>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className={styles.dataUpdateBox}>
              <p className={styles.subTitle}>
                {" "}
                <img
                  src={process.env.PUBLIC_URL + "/image/favicon.png"}
                  alt='fav'
                  className={styles.favicon}
                />
                데이터 업데이트 이력
              </p>
              <div className={`${styles.listContainer} scrollBar`}>
                <div className={styles.listContainerInner}>
                  {dataUpdateLogList &&
                    dataUpdateLogList.map((item) => (
                      <div key={item.no} className={styles.post}>
                        <div
                          className={styles.postHeader}
                          onClick={() =>
                            handleClickDataUpdateLogPostHeader(item.no)
                          }
                        >
                          <span>{item.no}</span>
                          <div className={styles.contentTitle}>
                            <span
                              ref={(el) =>
                                (updateTextRefs.current[item.no - 1] = el)
                              }
                            >
                              {item.date} 업데이트
                              <span className={styles.newContainer}>
                                {/*박스 안커지게 하면서 위치 잡아주기 위해존재 */}
                                {item.no === dataUpdateLogList.length ? ( // 가장 최근 게시물만.
                                  <MdFiberNew className={styles.new} />
                                ) : (
                                  ""
                                )}
                              </span>
                            </span>
                          </div>
                          <span> 관리자</span>
                        </div>
                        {dataUpdateLogPostBodyVisible[item.no - 1] ? (
                          <div className={`${styles.postBody} scrollBar`}>
                            <div className={styles.postBodyInner}>
                              {item.message.map((item, index) => (
                                <p key={index}>- {item}</p>
                              ))}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className={styles.releaseNoteBox}>
              <p className={styles.subTitle}>
                {" "}
                <img
                  src={process.env.PUBLIC_URL + "/image/favicon.png"}
                  alt='fav'
                  className={styles.favicon}
                />
                릴리즈 노트
              </p>
              <div className={`${styles.listContainer} scrollBar`}>
                <div className={styles.listContainerInner}>
                  {releaseNoteList &&
                    releaseNoteList.map((item) => (
                      <div key={item.no} className={styles.post}>
                        <div
                          className={styles.postHeader}
                          onClick={() =>
                            handleClickReleaseNotePostHeader(item.no)
                          }
                        >
                          <span>{item.version}</span>
                          <div className={styles.contentTitle}>
                            <span
                              ref={(el) =>
                                (releaseTextRefs.current[item.no - 1] = el)
                              }
                            >
                              {item.title}
                              <span className={styles.newContainer}>
                                {/*박스 안커지게 하면서 위치 잡아주기 위해존재 */}
                                {item.no === dataUpdateLogList.length ? ( // 가장 최근 게시물만.
                                  <MdFiberNew className={styles.new} />
                                ) : (
                                  ""
                                )}
                              </span>
                            </span>
                          </div>
                          <span> {item.author}</span>
                          <span>{item.date.split("T")[0]}</span>
                        </div>
                        {releaseNotePostBodyVisible[item.no - 1] ? (
                          <div className={`${styles.postBody} scrollBar`}>
                            <div className={styles.postBodyInner}>
                              {JSON.parse(item.description).map(
                                (item, index) => (
                                  <p key={index}>{item}</p>
                                )
                              )}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
