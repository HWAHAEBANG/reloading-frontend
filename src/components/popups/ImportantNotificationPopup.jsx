import React, { useEffect, useState } from "react";
import styles from "./ImportantNotificationPopup.module.css";
import axios from "axios";

export default function ImportantNotificationPopup({ onClose }) {
  const handleClose = () => {};

  const today = new Date().toISOString().slice(0, 10);
  console.log(today);

  const [notification, setNotification] = useState();
  useEffect(() => {
    axios
      .get(`https://reloading.co.kr/api/notification/notification`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.length === 0) {
          return;
        } else {
          setNotification(response.data.data[0]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className={styles.importantNotificationPopup}>
      <div className={styles.inner}>
        <div className={styles.titleContainer}>
          <p className={styles.title}>NOTIFICATION</p>
          <p className={styles.koTitle}>공지사항</p>
        </div>
        <div className={`${styles.listContainer} scrollBar`}>
          <div className={styles.listContainerInner}>
            <p className={styles.notiTitle}>
              {notification && notification.title}
            </p>
            <p className={styles.notiAuthor}>
              작성자 : {notification && notification.author}
            </p>
            <p className={styles.notiDate}>
              작성일시 : {notification && notification.created_at.split("T")[0]}
            </p>
            <p
              className={styles.notiDescripton}
              dangerouslySetInnerHTML={{
                __html: notification && notification.description,
              }}
            ></p>
          </div>
        </div>
        <p className={styles.postScript}>
          위 내용은 Notification 메뉴에서 다시 확인하실 수 있습니다.
        </p>
        <div className={styles.btnList}>
          <button className={styles.btn} onClick={() => onClose(false)}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
