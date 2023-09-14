function doGet(e) {
  return ContentService.createTextOutput('success');
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  const requestContent = JSON.parse(e.postData.contents);
  const allowGroups = getAllowGroup();

  for (let event of requestContent.events) {
    if (event == null) {
      continue;
    }

    if (eventMap[event.type] === undefined) {
      return ContentService.createTextOutput('success');
    }

    const { type, groupId } = event.source;

    // admin
    if (event.type === 'message' && event.message.type === 'text') {
      const text = event.message.text;

      if (text === '[RESET_COUNT]') {
        return resetUser();
      } else if (text.startsWith('[DELETE_')) {
        const userId = text.slice(1, -1).split('_')[1];
        const res = deleteUser(userId);
        if (res) {
          return;
        }
      }
    }

    if (groupId === undefined) {
      return ContentService.createTextOutput('success');
    }

    if (event.type !== 'join' && allowGroups.includes(groupId) === false) {
      return ContentService.createTextOutput('success');
    }

    eventMap[event.type](type, groupId, event);
  }

  lock.releaseLock();
  return ContentService.createTextOutput('success');
}
