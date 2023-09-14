const scriptProperties = PropertiesService.getScriptProperties();
const CHANNEL_ACCESS_TOKEN = scriptProperties.getProperty(
  'CHANNEL_ACCESS_TOKEN'
);

const HEADERS = {
  'Content-Type': 'application/json; charset=UTF-8',
  Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN,
};

function genOption(payload, method = 'post') {
  if (method === 'post') {
    return Object.assign(
      { headers: HEADERS, method: 'post' },
      { payload: JSON.stringify(payload) }
    );
  }

  return { headers: HEADERS, method: method };
}
