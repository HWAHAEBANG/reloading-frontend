import React, { useState } from "react";
import styles from "./Access.module.css";
import TypeWriterEffect from "react-typewriter-effect";
import { BsPlusLg } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Access() {
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.userInfo);

  // const [isFirstVisit, setIsFirstVisit] = useState(
  //   userInfo && userInfo.userInfo.today_visit_cnt <= 1
  // );

  setTimeout(() => {
    navigate("/");
  }, 9000);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.GrantText}>
        <TypeWriterEffect
          textStyle={{
            fontFamily: "PixelCaps",
            fontSize: "21.5px",
            lineHeight: "0px",
          }}
          startDelay={500}
          // cursorColor={"#03e9f4"}
          text='ACCESS GRANTED'
          typeSpeed={20}
          // scrollArea={myAppRef}
        />
      </div>
      {/* ====================================================================== */}
      {/* innerBOx 안에 넣으면 애니메이션 버벅거림이 있어서, 따로 뺐음 */}
      <div className={styles.avatarBox}>
        <img
          className={styles.avatar}
          src={
            (userInfo &&
              userInfo.userInfo &&
              userInfo.userInfo.profile_image) ||
            process.env.PUBLIC_URL + "/image/unknown.png"
          }
          alt='프로필 사진'
        />
      </div>
      <div className={styles.WelcomeText}>
        <div className={styles.topText}>
          <TypeWriterEffect
            textStyle={{
              fontFamily: "PixelCaps",
              fontSize: "21.5px",
              lineHeight: "0px",
            }}
            startDelay={4000}
            // cursorColor={"#03e9f4"}
            text={`HELLO, ${
              userInfo && userInfo.userInfo && userInfo.userInfo.nickname
            }`}
            typeSpeed={20}
            // scrollArea={myAppRef}
          />
        </div>
        <div className={styles.standardBox}>
          <span className={styles.cross}>
            <BsPlusLg />
          </span>
          <span className={styles.cross}>
            <BsPlusLg />
          </span>
          <span className={styles.cross}>
            <BsPlusLg />
          </span>
          <span className={styles.cross}>
            <BsPlusLg />
          </span>
          <div className={styles.grid}></div>
          <div className={styles.grid}></div>
          <div className={styles.grid}></div>
          <div className={styles.grid}></div>

          <div className={styles.outerBox}>
            <span className={styles.cross}>
              <BsPlusLg />
            </span>
            <span className={styles.cross}>
              <BsPlusLg />
            </span>
            <span className={styles.cross}>
              <BsPlusLg />
            </span>
            <span className={styles.cross}>
              <BsPlusLg />
            </span>
          </div>
          <div className={styles.subOuterBox}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={styles.innerBox}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className={styles.bottomText}>
          {userInfo &&
          userInfo.userInfo &&
          userInfo.userInfo.total_visit_cnt <= 1 ? (
            <TypeWriterEffect
              textStyle={{
                fontFamily: "PixelCaps",
                fontSize: "21.5px",
                lineHeight: "0px",
                letterSpacing: "-0.5px",
              }}
              startDelay={5000}
              text='NICE TO MEET YOU'
              typeSpeed={20}
            />
          ) : (
            <TypeWriterEffect
              textStyle={{
                fontFamily: "PixelCaps",
                fontSize: "21.5px",
                lineHeight: "0px",
              }}
              startDelay={5000}
              // cursorColor={"#03e9f4"}
              text='WELCOME BACK'
              typeSpeed={20}
              // scrollArea={myAppRef}
            />
          )}
        </div>
      </div>
    </div>
  );
}
