type User = {
  colNum: number;
  count: number;
};

// sheet
const getUserList = (full: boolean) => {
  const lastRow = UserListSheet.getLastRow();
  const range = UserListSheet.getRange(`A2:${full ? 'G' : 'A'}${lastRow}`);
  return getValue(range);
};

const getUserRow = (userId: string) => {
  const userIds = getUserList(false).flat();
  const userIndex = userIds.findIndex((id) => id === userId);

  if (userIndex < 0) {
    return null;
  }

  const range = UserListSheet.getRange(`A${userIndex + 2}:G${userIndex + 2}`);
  const row = getValue(range)[0];

  return {
    colNum: userIndex,
    count: row[6],
  };
};

const addUser = (profile: UserProfile, message: string) => {
  UserListSheet.appendRow([
    profile.userId,
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
  const range = UserListSheet.getRange(`E${userIndex + 2}:G${userIndex + 2}`);
  user.count += 1;
  updateCells(range, [[new Date(), message, user.count]]);
  updateUserCache(userId, user);
  return;
};

const clearUsers = () => {
  const cache = CacheService.getScriptCache();
  const userIds = getUserList(false).flat();

  cache.removeAll(userIds);
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
  addUser(profile, message);
  const userIds = getUserList(false).flat();
  const userIndex = userIds.findIndex((id) => id === userId);

  updateUserCache(userId, {
    colNum: userIndex,
    count: 1,
  });
};
