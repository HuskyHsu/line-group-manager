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

const processJoin = (type, groupId, event) => {
  const group = getGroup(groupId);
  const count = getGroupCount(groupId);

  addGroup(group, count);
};

const eventMap = {
  message: processMessage,
  join: processJoin,
  memberJoined: processMemberJoined,
  memberLeft: processMemberLeft,
};
