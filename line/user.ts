type Profile = {
  displayName: string;
  userId: string;
  language: string;
  pictureUrl: string;
  statusMessage: string;
};

const getUser = (type, groupId, userId): Profile => {
  let url = 'https://api.line.me/v2/bot/';
  if (type === 'user') {
    url += `profile/${userId}`;
  } else if (type === 'group') {
    url += `group/${groupId}/member/${userId}`;
  }

  const response = UrlFetchApp.fetch(url, genOption(null, 'get'));
  const profile = JSON.parse(response.getContentText());

  return profile;
};
