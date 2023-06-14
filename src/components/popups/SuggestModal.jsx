import React, { useState } from "react";
import styles from "./SuggestModal.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import RingLoader from "react-spinners/RingLoader";

export default function SuggestModal({ onClose }) {
  // loading ===========================
  const override = {
    display: "block",
    margin: "auto",
  };

  const [loading, setLoading] = useState(false);
  //============================================

  const [text, setText] = useState("");
  const handleText = (e) => {
    setText(e.target.value);
  };

  const handleClose = () => {
    const result = window.confirm(
      "창을 닫으시면 작성하신 내용은 삭제됩니다. 닫으시겠습니까?"
    );
    if (result) {
      onClose(false);
      setText("");
    } else {
      return;
    }
  };

  const userInfo = useSelector((state) => state.userInfo);

  const handleSend = () => {
    const result = window.confirm("전송하시겠습니까?");
    if (result) {
      setLoading(true);
      axios
        .post("http://reloading.co.kr/api/users/sendSuggest", {
          withCredentials: true,
          data: {
            text: text, // 생략 가능하지만 혼동 방지를 위해서 비생략.
            presentUserInfo: userInfo.userInfo,
          },
        })
        .then((Response) => {
          alert("전송이 완료되었습니다. 소증한 의견 진심으로 감사드립니다.");
          setLoading(false);
          onClose(false);
          setText("");
        })
        .catch((error) => {
          alert("전송에 실패했습니다. 다시 시도해주세요.");
          setLoading(false);
        });
    } else {
      return;
    }
  };

  return (
    <div className={styles.suggestModal}>
      <div className={styles.inner}>
        <div className={styles.titleContainer}>
          <p className={styles.title}>SUGGEST</p>
          <p className={styles.koTitle}>개발자에게 제안</p>
        </div>
        <p className={styles.preScript}>
          소중한 시간을 내어 사이트를 방문에 주셔서 감사합니다.
          <br />
          사이트를 이용하시면서 <span>불편하셨던 점</span>이나,{" "}
          <span>새로 생겼으면 하시는 기능</span>이 있으시다면 하단에
          작성해주세요.
          <br />
          해당 내용은 개발자에게 전송되며, 빠른 시일 내에 이메일로 회신드리도록
          하겠습니다.
        </p>
        <div className={styles.listContainer}>
          <textarea
            className={`${styles.listContainerInner} scrollBar`}
            onChange={handleText}
            value={text}
          />
        </div>
        <p className={styles.postScript}>
          더욱 쾌적한 환경을 제공해드릴 수 있도록 최선을 다 하겠습니다.
          감사합니다.
        </p>
        <div className={styles.btnList}>
          <button className={styles.btn} onClick={handleSend}>
            {loading ? (
              // <button className={styles.confirmBtn} onClick={handleSend}>
              <RingLoader
                color='#36d7b7'
                loading={loading}
                cssOverride={override}
                size={20}
                aria-label='Loading Spinner'
                data-testid='loader'
              />
            ) : (
              // </button>
              <span>SEND</span>
            )}
          </button>
          <button className={styles.btn} onClick={handleClose}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
