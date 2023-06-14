// // Background.jsx
// import React, { useEffect, useRef } from "react";
// import styles from "./Background.module.css";
// import Particle from "./Particle";

// export default function Background() {
//   const particlesRef = useRef(null);

//   useEffect(() => {
//     const particles = particlesRef.current;
//     const main = document.getElementById("main");

//     function handleResize() {
//       const np = document.documentElement.clientWidth / 29;
//       const newParticles = [];
//       for (let i = 0; i < np; i++) {
//         newParticles.push(<Particle key={i} />);
//       }
//       setParticles(newParticles);
//     }

//     handleResize();
//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   return (
//     <div>
//       <div className={styles.blur}></div>
//       <div className={styles.main} id='main'>
//         <h1 className={styles.title}> PARTICLES</h1>
//       </div>
//       <div className={styles.particles} id='particles' ref={particlesRef}>
//         {particles}
//       </div>
//     </div>
//   );
// }
