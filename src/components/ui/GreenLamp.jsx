import React from "react";
import styles from "./GreenLamp.module.css";

export default function GreenLamp() {
  return (
    <div className={styles.signalContainer}>
      <img
        className={styles.greenSignal}
        src={process.env.PUBLIC_URL + "/image/greenLamp.png"}
        alt='청신호'
      />
    </div>
  );
}
