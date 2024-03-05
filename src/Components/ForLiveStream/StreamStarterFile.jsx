import React, { useContext, useState } from "react";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";
import Livestream from "./StartLivestream";
import Webplayer from "./Webplayer";
import { VidverseContext } from "../../Context/VidverseContext";


const StreamStarterFile = () => {
  const [showLiveStream, setShowLiveStream] = useState(false);
  const [playbackId, setPlaybackId] = useState("");
  const {livepeerCli} = useContext(VidverseContext)
  const [createStreamMode, setCreateStreamMode] = useState(false); 

  const apiKey = "45cddd3a-e60e-4a8b-b121-e353f8b107b0";

  const livepeerClient = createReactClient({
    provider: studioProvider({ apiKey: apiKey }),
  });

  const handleCreateStreamMode = () => {
    setShowLiveStream(false);
    setCreateStreamMode(true);
  };

  return (
    <LivepeerConfig client={livepeerClient}>
      {createStreamMode ? (
        <div>

          <Livestream
            onStreamCreated={(streamId) => {
              // Pass a callback to handle stream created event
              setPlaybackId(streamId);
              setShowLiveStream(true);
              setCreateStreamMode(false);
            }}
            
          />
          
        </div>
      ) : (
        <div>
          <button onClick={handleCreateStreamMode}>Create Stream</button>

          {showLiveStream && <Webplayer />}
        </div>
      )}
    </LivepeerConfig>
  );
};

export default StreamStarterFile;
