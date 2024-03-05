import React from "react";
import styles from "./VideoCard.module.css";

const VideoCard = ({ video, handleTip }) => {
  const CID = video.ipfsHash
    ? `${video.ipfsHash.slice(0, 4)}...${video.ipfsHash.slice(-4)}`
    : "";
  const makerAdd = video.owner
    ? `${video.owner.slice(0, 4)}...${video.owner.slice(-4)}`
    : "";

  return <div className={styles.card}>
    <div className={styles.row}>
      <div className={styles.colMd4}>
        <video
          className={styles.imgFluid}
          width="100%"
          height="100%"
          controls
          src={`https://gateway.lighthouse.storage/ipfs/${video.ipfsHash}`}
          type="video/mp4"
        />
      </div>
      <div className={styles.colMd8}>
        <div className={styles.cardBody}>
          <h5 className={styles.cardTitle}>{video.title}</h5>
          <p className={styles.cardText}>{video.description}</p>
          <p className={styles.cardText}>
            <small className={styles.textMuted}>CID: {CID}</small>
          </p>
          <p className={styles.cardText}>
            <small className={styles.textMuted}>Owner: {makerAdd}</small>
          </p>
          <p className={styles.cardText}>Tip Amount: {video.tipAmount}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const tipAmount = e.target.elements.tipAmount.value;
              handleTip(video.id, tipAmount);
            }}
          >
            <div className={styles.inputGroup}>
              <input
                type="number"
                className={styles.formControl}
                name="tipAmount"
                placeholder="Tip Amount"
              />
              <button className={styles.btn} type="submit">
                Give Tip
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>;
};
export default VideoCard;
