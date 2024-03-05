import React from 'react'
import ChatBox from '../Components/ChatBox/ChatBox'

import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";

import StreamStarterFile from '../Components/ForLiveStream/StreamStarterFile'
import Style from "./Home.module.css"
const Livestream = () => {
  return (
    <div className={Style.container}>
      Live
      <StreamStarterFile></StreamStarterFile>

    </div>
  )
}

export default Livestream