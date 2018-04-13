import React from 'react';

import Player from './Player';
import CreateOrUpdatePlaylist from "./CreateOrUpdatePlaylist";
import UpdateDevice from './UpdateDevice';

const RightContainer = () => (
  <div style={{
    width: '29%',
    position: 'relative',
    display: 'inline-block',
  }}>
    <Player />
    <CreateOrUpdatePlaylist />
    <UpdateDevice />
  </div>
);

export default RightContainer;
