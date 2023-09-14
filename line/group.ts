type GroupProfile = {
  groupName: string;
  groupId: string;
  pictureUrl: string;
};

const getGroup = (groupId): GroupProfile => {
  let url = `https://api.line.me/v2/bot/group/${groupId}/summary`;

  const response = UrlFetchApp.fetch(url, genOption(null, 'get'));
  const profile = JSON.parse(response.getContentText());

  return profile;
};

const getGroupCount = (groupId): number => {
  let url = `https://api.line.me/v2/bot/group/${groupId}/members/count`;

  const response = UrlFetchApp.fetch(url, genOption(null, 'get'));
  const { count } = JSON.parse(response.getContentText());

  return count;
};
