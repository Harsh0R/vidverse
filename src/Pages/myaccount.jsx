import React, { useContext, useEffect, useState } from 'react';
import lighthouse from '@lighthouse-web3/sdk';
import { VidverseContext } from '../Context/VidverseContext';
import { Link } from 'react-router-dom';
import Style from "./myaccount.module.css"; // Ensure this path is correct

const MyAccount = () => {
  const { allVideo, uploadVideos, account } = useContext(VidverseContext);
  const [progress, setProgress] = useState(0);
  const [videoName, setVideoName] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [uploadedVid, setUploadedVid] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await allVideo();
        const filteredVideos = data.filter(video => video.owner.toLowerCase() === account.toLowerCase());
        setUploadedVid(filteredVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
    fetchData();
  }, [account, allVideo]);

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const progressCallback = (progressEvent) => {
      const percentageDone = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setProgress(percentageDone);
    };

    try {
      const output = await lighthouse.upload(file, 'your-api-key', false, null, progressCallback);
      await uploadVideos(videoName, videoDescription, output.data.Hash);
      setUploadedVid([...uploadedVid, {
        title: videoName,
        description: videoDescription,
        ipfsHash: output.data.Hash,
        owner: account,
      }]);
      setVideoName('');
      setVideoDescription('');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className={Style.myAccountContainer}>
      <h2 className={Style.heading}>My Account</h2>
      <div className={Style.inputGroup}>
        <input
          className={Style.formControl}
          type="text"
          placeholder="Video Name"
          value={videoName}
          onChange={(e) => setVideoName(e.target.value)}
        />
      </div>
      <div className={Style.inputGroup}>
        <input
          className={Style.formControl}
          type="text"
          placeholder="Video Description"
          value={videoDescription}
          onChange={(e) => setVideoDescription(e.target.value)}
        />
      </div>
      <div className={Style.inputGroup}>
        <input
          className={Style.formControl}
          type="file"
          onChange={uploadFile}
        />
      </div>
      <div className={Style.progressContainer}>
        <div className={Style.progressBar} style={{ width: `${progress}%` }}>{progress}%</div>
      </div>
      <div className={Style.actionButton}>
        <Link to='/livestream' className={Style.btnPrimary}>
          Start Your LiveStream
        </Link>
      </div>
      <h3 className={Style.subheading}>Uploaded Videos</h3>
      <div className={Style.listGroup}>
        {uploadedVid.map((video, index) => (
          <div key={index} className={Style.listGroupItem}>
            <div className={Style.videoDetails}>
              <h5 className={Style.videoTitle}>{video.title}</h5>
              <p className={Style.videoDescription}>{video.description}</p>
              <small className={Style.videoCID}>CID: {video.ipfsHash}</small>
            </div>
            <video className={Style.videoPlayer} controls src={`https://gateway.lighthouse.storage/ipfs/${video.ipfsHash}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAccount;
