// sheet
const getGroupList = () => {
  const lastRow = GroupListSheet.getLastRow();
  const range = GroupListSheet.getRange(`A2:F${lastRow}`);
  return getValue(range);
};

const addGroup = (profile: GroupProfile, count: number) => {
  GroupListSheet.appendRow([
    profile.groupId,
    profile.groupName,
    `=IMAGE("${profile.pictureUrl}", 1)`,
    count,
    new Date(),
  ]);
};

const getAllowGroup = () => {
  const list = getGroupList();
  return list.filter((row) => row[5] === 'yes').flatMap((row) => row[0]);
};
