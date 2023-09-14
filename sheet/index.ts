const scriptProperties = PropertiesService.getScriptProperties();
const sheetId = scriptProperties.getProperty('SHEET_ID');

const spreadsheet = SpreadsheetApp.openById(sheetId);
const sheets = spreadsheet.getSheets();

const UserListSheet = sheets.find((sheet) => sheet.getName() === 'UserList');

const getValue = (range) => {
  return range.getValues().map((cell) => cell);
};

const updateCells = (range, values) => {
  range.setValues(values);
};
