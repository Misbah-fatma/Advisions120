import React from 'react';
import { useLocation } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';

const LiveClass = () => {
  const location = useLocation();
  const { courseId, teacherName, teacherRole } = location.state || {}; // Extract courseId, teacherName, and teacherRole from location state

  const roomName = courseId || "defaultRoom"; // Use courseId as the room name or fallback to "defaultRoom"
  const domain = "meet.jit.si";

  const isModerator = teacherRole === "Teacher"; // Check if the role is Teacher

  // Debugging outputs
  console.log("Domain:", domain);
  console.log("Room Name:", roomName);
  console.log("Teacher Name:", teacherName);
  console.log("Teacher Role:", teacherRole);
  console.log("Is Moderator:", isModerator);

  return (
    <div style={{ height: "100vh", display: "grid", flexDirection: "column" }}>
      <JitsiMeeting
        roomName={roomName}
        displayName={teacherName || "Anonymous"} // Use teacherName as displayName or fallback to "Anonymous"
        domain={domain}
        containerStyles={{ display: "flex", flex: 1 }}
        configOverwrite={{
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          prejoinPageEnabled: false,
          disableModeratorIndicator: !isModerator,
          enableUserRolesBasedOnToken: isModerator,
        }}
        interfaceConfigOverwrite={{
          SHOW_JITSI_WATERMARK: false,
          DEFAULT_REMOTE_DISPLAY_NAME: 'Fellow Jitster',
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'chat', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'raisehand',
            'settings', 'videoquality', 'tileview', 'download', 'help'
          ],
        }}
      />
    </div>
  );
};

export default LiveClass;
