type User = {
  colNum: number;
  count: number;
};

// sheet
const getUserList = (full: boolean) => {
  const lastRow = UserListSheet.getLastRow();
  const range = UserListSheet.getRange(`A2:${full ? 'H' : 'A'}${lastRow}`);
  return getValue(range);
};

const getUserRow = (userId: string) => {
  const userIds = getUserList(false).flat();
  const userIndex = userIds.findIndex((id) => id === userId);

  if (userIndex < 0) {
    return null;
  }

  const range = UserListSheet.getRange(`A${userIndex + 2}:H${userIndex + 2}`);
  const row = getValue(range)[0];

  return {
    colNum: userIndex,
    count: row[7],
  };
};

const addUser = (groupId, profile: UserProfile, message: string) => {
  UserListSheet.appendRow([
    profile.userId,
    groupId,
    profile.displayName,
    `=IMAGE("${profile.pictureUrl}", 1)`,
    profile.statusMessage,
    new Date(),
    message,
    message.startsWith('[member') ? '0' : '1',
  ]);
};

// chche
const getUserCache = (id: string): User | null => {
  const cache = CacheService.getScriptCache();
  const user = cache.get(id);
  if (user !== null) {
    return JSON.parse(user);
  }
  return null;
};

const updateUserCache = (id: string, user: User) => {
  const cache = CacheService.getScriptCache();
  cache.put(id, JSON.stringify(user), 6 * 60 * 60);
};

const updateUser = (userId: string, message: string, user: User) => {
  const userIndex = user.colNum;
  const range = UserListSheet.getRange(`F${userIndex + 2}:H${userIndex + 2}`);
  user.count += 1;
  updateCells(range, [[new Date(), message, user.count]]);
  updateUserCache(userId, user);
  return;
};

const updateUserInfo = (userIndex: number, user: UserProfile) => {
  const range = UserListSheet.getRange(`C${userIndex + 2}:E${userIndex + 2}`);
  updateCells(range, [
    [user.displayName, `=IMAGE("${user.pictureUrl}", 1)`, user.statusMessage],
  ]);
};

const clearUsers = () => {
  const cache = CacheService.getScriptCache();
  const userIds = getUserList(false).flat();

  cache.removeAll(userIds);
};

const resetUser = () => {
  clearUsers();
  const lastRow = UserListSheet.getLastRow();
  const range = UserListSheet.getRange(`H2:H${lastRow}`);

  updateCells(
    range,
    new Array(lastRow - 1).fill(0).map((_) => [0])
  );
  return;
};

const UpdateLastMsg = (
  type: string,
  groupId: string,
  userId: string,
  message: string
) => {
  let user = getUserCache(userId);
  if (user !== null) {
    updateUser(userId, message, user);
    return;
  }

  user = getUserRow(userId);
  if (user) {
    updateUser(userId, message, user);
    return;
  }

  const profile = getUser(type, groupId, userId);
  addUser(groupId, profile, message);
  const userIds = getUserList(false).flat();
  const userIndex = userIds.findIndex((id) => id === userId);

  updateUserCache(userId, {
    colNum: userIndex,
    count: 1,
  });
};

const deleteUser = (userId: string) => {
  clearUsers();

  const userIds = getUserList(false).flat();
  const userIndex = userIds.findIndex((id) => id === userId);

  UserListSheet.deleteRow(userIndex + 2);
};

const updateAllUserInfo = () => {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  const users = getUserList(true);

  users.forEach((userRow, index) => {
    const userProfile = getUser('group', userRow[1], userRow[0]);
    updateUserInfo(index, userProfile);
  });

  lock.releaseLock();
};
