import React from "react";
import YouTube from "react-youtube";

const VideoPlayer = ({ chartsData }) => {
  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      start: chartsData.startSecond, // chartsData에서 시작 시간 가져오기
    },
  };

  return (
    // <div className={styles.youtubeSection}>
    //   {chartsData.youtubeUrl && (
    <YouTube
      videoId={chartsData.youtubeUrl}
      opts={opts}
      onReady={(event) => event.target.playVideo()}
    />
    //   )}
    // </div>
  );
};

export default VideoPlayer;
