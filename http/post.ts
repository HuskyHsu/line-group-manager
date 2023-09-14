function doPost(e) {
  const requestContent = JSON.parse(e.postData.contents);

  for (let event of requestContent.events) {
    if (event == null) {
      continue;
    }

    if (eventMap[event.type] === undefined) {
      return ContentService.createTextOutput('success');
    }

    const { type, groupId } = event.source;
    if (groupId === undefined) {
      return ContentService.createTextOutput('success');
    }

    eventMap[event.type](type, groupId, event);
  }

  return ContentService.createTextOutput('success');
}
