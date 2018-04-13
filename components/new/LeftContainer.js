import React from 'react';

import CreateOrUpdatePlaylist from "./CreateOrUpdatePlaylist";
import Playlist from "./Playilst";

const LeftContainer = () => (
  <div style={{
    width: '70%',
    position: 'relative',
    display: 'inline-block',
  }}>
    <Playlist />
  </div>
);

export default LeftContainer;