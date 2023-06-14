import React, { useEffect } from "react";
import styles from "./InputPw.module.css";
import TypeWriterEffect from "react-typewriter-effect";
import { useNavigate } from "react-router-dom";
import useSound from "use-sound";

export default function InputPw() {
  const navigate = useNavigate();

  const valueCheck = (e) => {
    e.key === "Enter" && navigate("/pass");
  };

  const [playActive] = useSound("/sounds/faidin.mp3", { volume: 1 });

  useEffect(() => {
    playActive();
  }, []);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div>
          <TypeWriterEffect
            textStyle={{
              fontFamily: "PixelCaps",
              fontSize: "21.5px",
            }}
            startDelay={500}
            cursorColor={"#03e9f4"}
            text='ENTER PASSWORD'
            typeSpeed={20}
            // scrollArea={myAppRef}
          />
        </div>
        <div className={styles.outLine}>
          <div className={styles.inputContainer}>
            <input type='password' autoFocus onKeyDown={valueCheck} />
            <div className={styles.block2}></div>
          </div>
          <div className={styles.block1}></div>
        </div>
      </div>
    </div>
  );
}
