import React from "react";
import styles from "./RedLamp.module.css";

export default function RedLamp() {
  return (
    <div className={styles.signalContainer}>
      <img
        className={styles.redSignal}
        src={process.env.PUBLIC_URL + "/image/redLamp.png"}
        alt='적신호'
      />
    </div>
  );
}
