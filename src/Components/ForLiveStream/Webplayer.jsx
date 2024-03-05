import React, { useState } from "react";
import { Player } from "@livepeer/react";
import ChatBox from "../ChatBox/ChatBox";

const Webplayer = () => {
  const [playbackId, setPlaybackId] = useState("");
  const [streamName, setStreamName] = useState("");
  const [flag, setFlag] = useState(false)

  const handlefunc = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // Check if both playbackId and streamName are not empty
    if (playbackId && streamName) {
      // Implement your logic here, such as fetching the stream data
      // For now, let's just console.log the values
      setFlag(true)
      console.log("Playback ID:", playbackId);
      console.log("Stream Name:", streamName);
    } else {
      // If either playbackId or streamName is empty, show an error message or handle it as per your requirements
      console.error("Please enter both Playback ID and Stream Name");
    }
  };

  return (
    <div>
      <form onSubmit={handlefunc}>
        <input
          type="text"
          value={playbackId}
          placeholder="Enter Playback ID"
          onChange={(e) => setPlaybackId(e.target.value)}
        />
        <input
          type="text"
          value={streamName}
          placeholder="Enter Stream Name"
          onChange={(e) => setStreamName(e.target.value)}
        />
        <button type="submit">Show Stream</button>
      </form>
      <div style={{ width: "100%" }}>
        {flag && (
          <div>
            <Player
              title="Waterfalls"
              playbackId={playbackId}
              showPipButton
              showTitle={false}
              aspectRatio="16to9"
              controls={{
                autohide: 3000,
              }}
              theme={{
                borderStyles: { containerBorderStyle: "hidden" },
                radii: { containerBorderRadius: "10px" },
              }}
            />
            <ChatBox chat={streamName}></ChatBox>
          </div>
        )}
      </div>
    </div>
  );
};

export default Webplayer;
