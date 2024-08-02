// LiveClassPage.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const LiveClassPage = () => {
  const { courseId, teacherId } = useParams();

  useEffect(() => {
    const domain = 'meet.jit.si';
    const options = {
      roomName: `${courseId}-${teacherId}`,
      width: '100%',
      height: '100%',
      parentNode: document.getElementById('jitsi-container'),
      configOverwrite: {
        recordingType: 'jibri',
        startWithAudioMuted: true,
        startWithVideoMuted: true,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen', 'fodeviceselection', 'hangup', 'profile', 'chat',
          'recording', 'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand', 'videoquality', 'filmstrip',
          'invite', 'feedback', 'stats', 'shortcuts', 'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
          'e2ee', 'security'
        ],
      },
    };

    if (window.JitsiMeetExternalAPI) {
      const api = new window.JitsiMeetExternalAPI(domain, options);

      api.addEventListener('videoConferenceJoined', () => {
        console.log('Local User Joined');
      });

      api.addEventListener('videoConferenceLeft', () => {
        console.log('Local User Left');
      });

      return () => {
        api.dispose();
      };
    } else {
      console.error('JitsiMeetExternalAPI not loaded');
    }
  }, [courseId, teacherId]);

  return <div id="jitsi-container" style={{ width: '100%', height: '100vh' }} />;
};

export default LiveClassPage;
