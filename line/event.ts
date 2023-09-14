const processMessage = (type, groupId, event) => {
  const { userId } = event.source;
  let userMessage = event.message.text;

  if (userMessage === undefined) {
    if (event.message.type === 'sticker') {
      const stickerUrl = `https://stickershop.line-scdn.net/stickershop/v1/sticker/${event.message.stickerId}/android/sticker.png`;

      userMessage = `=IMAGE("${stickerUrl}", 1)`;
    } else {
      userMessage = `[sent ${event.message.type}]`;
    }
  }

  UpdateLastMsg(type, groupId, userId, userMessage);
};

const processMemberJoined = (type, groupId, event) => {
  for (let member of event.joined.members) {
    UpdateLastMsg(type, groupId, member.userId, '[memberJoined]');
  }
};

const processMemberLeft = (type, groupId, event) => {
  for (let member of event.joined.members) {
    UpdateLastMsg(type, groupId, member.userId, '[memberLeft]');
  }
};

const eventMap = {
  message: processMessage,
  memberJoined: processMemberJoined,
  memberLeft: processMemberLeft,
};
