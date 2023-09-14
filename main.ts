const main = () => {
  clearUsers();
};

const updateAllowGroup = () => {
  const cache = CacheService.getScriptCache();
  const groupList = ['C37394dcfed997be8a884dc1427b1e048'];

  cache.put('groupList', groupList.join(','));
};
