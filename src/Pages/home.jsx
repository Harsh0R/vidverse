import React, { useContext, useEffect, useState } from 'react';
import { VidverseContext } from '../Context/VidverseContext';
import { checkIfWalletConnected } from '../Utils/apiFeatures';
import Webplayer from '../Components/ForLiveStream/Webplayer';
import VideoCard from '../Components/VideoCard/VideoCard';
import { LivepeerConfig } from "@livepeer/react";
import styles from "./Home.module.css";

const Home = () => {
  const [contentToShow, setContentToShow] = useState('videos');
  const { allVideo, tipVideoOwner, hasValideAllowance, increaseAllowance, livepeerCli } = useContext(VidverseContext);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (contentToShow === 'videos') {
          const data = await allVideo();
          setVideos(data);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
    fetchData();
  }, [contentToShow, allVideo]);

  const handleTip = async (vidID, tipAmount) => {
    try {
      const owner = await checkIfWalletConnected();
      const hasAllowance = await hasValideAllowance(owner, tipAmount);
      if (!hasAllowance) {
        await increaseAllowance(tipAmount);
      } else {
        await tipVideoOwner(vidID, tipAmount);
      }
    } catch (error) {
      console.error('Error tipping video owner:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.listgroup}>
          <button className={`${styles.listgroupitem} ${contentToShow === 'videos' ? styles.active : ''}`} onClick={() => setContentToShow('videos')}>
            Videos
          </button>
          <button className={`${styles.listgroupitem} ${contentToShow === 'livestream' ? styles.active : ''}`} onClick={() => setContentToShow('livestream')}>
            LiveStream
          </button>
        </div>
      </div>
      <div className={styles.content}>
        {contentToShow === 'videos' ? (
          <div className={styles.videoGrid}>
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <div key={index} className={styles.videoCard}>
                  <VideoCard video={video} handleTip={handleTip} />
                </div>
              ))
            ) : (
              <p className={styles.noVideos}>No videos available.</p>
            )}
          </div>
        ) : (
          <LivepeerConfig client={livepeerCli}>
            <Webplayer />
          </LivepeerConfig>
        )}
      </div>
    </div>
  );
};

export default Home;
