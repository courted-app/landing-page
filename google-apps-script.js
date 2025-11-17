/**
 * Google Apps Script Code
 * 
 * INSTRUCTIONS:
 * 1. Go to https://script.google.com
 * 2. Click "New Project"
 * 3. Replace the default code with this code
 * 4. Update the SPREADSHEET_ID and SHEET_NAME variables
 * 5. Click "Deploy" > "New deployment"
 * 6. Select type: "Web app"
 * 7. Set "Execute as": "Me"
 * 8. Set "Who has access": "Anyone"
 * 9. Click "Deploy"
 * 10. Copy the Web App URL and paste it in script.js as GOOGLE_SCRIPT_URL
 */

// Replace with your Google Sheet ID (found in the URL)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// Configuration for all form types and their corresponding sheets
const FORM_CONFIG = {
  'waitlist': {
    sheetName: 'Waitlist V2',
    headers: [
      'Timestamp', 
      'Name', 
      'Email', 
      'Gender', 
      'Age Range', 
      'Match Same Age Group',
      'DUPR Rating',
      'DUPR ID',
      'Looking to Date',
      'Education',
      'Dating Age Range',
      'When Do You Play',
      'Type of Partner',
      'Partner Type',
      'Date Gender Preference',
      'Current Club', 
      'City', 
      'Country'
    ],
    dataMapper: (data) => [
      new Date(data.timestamp || new Date()),
      data.name || '',
      data.email || '',
      data.gender || '',
      data.ageRange || '',
      data.matchSameAgeGroup || '',
      data.duprRating || '',
      data.duprId || '',
      data.lookingToDate || '',
      data.education || '',
      data.datingAgeRange || '',
      data.whenDoYouPlay || '',
      data.lookingFor || '',
      data.partnerType || '',
      data.dateGenderPreference || '',
      data.currentClub || '',
      data.city || '',
      data.country || ''
    ]
  },
  'event': {
    sheetName: 'Hisports stouffville kickoff',
    headers: [
      'Timestamp',
      'First Name',
      'Last Name',
      'Email',
      'Gender',
      'Age Range',
      'Preferred Partner Age Range Min',
      'Preferred Partner Age Range Max',
      'DUPR/Self Rating',
      'DUPR ID',
      'Time of Day',
      'Days of Play',
      'Field of Work / Study',
      'Type of Play',
      'Winning',
      'Having Fun',
      'Professional Networking',
      'Post-Pickleball Party',
      'Meeting new players in the community',
      'Health and Well-being'
    ],
    dataMapper: (data) => {
      const priorities = data.priorities || [];
      const allPriorities = ['Winning', 'Having Fun', 'Professional Networking', 'Post-Pickleball Party', 'Meeting new players in the community', 'Health and Well-being'];
      
      // Create array with priority ranking numbers for each priority
      const priorityColumns = allPriorities.map(priority => {
        const rankIndex = priorities.findIndex(p => p === priority);
        return rankIndex !== -1 ? (rankIndex + 1).toString() : '';
      });
      
      return [
        new Date(data.timestamp || new Date()),
        data.firstName || '',
        data.lastName || '',
        data.email || '',
        data.gender || '',
        data.ageRange || '',
        data.preferredPartnerAgeRangeMin || '',
        data.preferredPartnerAgeRangeMax || '',
        data.duprRating || '',
        data.duprId || '',
        data.timeOfDay ? data.timeOfDay.join(', ') : '',
        data.daysOfPlay ? data.daysOfPlay.join(', ') : '',
        data.fieldOfWork || '',
        data.typeOfPlay ? data.typeOfPlay.join(', ') : '',
        ...priorityColumns
      ];
    },
    genderColumnIndex: 4 // Column E (0-indexed: 4)
  }
  // Add new form types here:
  // 'newFormType': {
  //   sheetName: 'New Sheet Name',
  //   headers: [...],
  //   dataMapper: (data) => [...],
  //   genderColumnIndex: 4 // if needed for gender counting
  // }
};

/**
 * Gets or creates a sheet with the specified configuration
 * @param {Spreadsheet} ss - The spreadsheet object
 * @param {Object} config - The form configuration object
 * @returns {Sheet} - The sheet object
 */
function getOrCreateSheet(ss, config) {
  let sheet = ss.getSheetByName(config.sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(config.sheetName);
    initializeSheetHeaders(sheet, config.headers);
  } else {
    ensureSheetHeaders(sheet, config.headers);
  }
  
  return sheet;
}

/**
 * Initializes sheet headers
 * @param {Sheet} sheet - The sheet object
 * @param {Array} headers - Array of header strings
 */
function initializeSheetHeaders(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
}

/**
 * Ensures sheet headers match the expected format
 * @param {Sheet} sheet - The sheet object
 * @param {Array} expectedHeaders - Array of expected header strings
 */
function ensureSheetHeaders(sheet, expectedHeaders) {
  const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const headersMatch = JSON.stringify(existingHeaders) === JSON.stringify(expectedHeaders);
  
  if (!headersMatch) {
    initializeSheetHeaders(sheet, expectedHeaders);
  }
}

/**
 * Gets the form configuration based on formType
 * @param {string} formType - The type of form (e.g., 'waitlist', 'event')
 * @returns {Object|null} - The form configuration or null if not found
 */
function getFormConfig(formType) {
  return FORM_CONFIG[formType] || FORM_CONFIG['waitlist']; // Default to waitlist if not found
}

/**
 * Validates spreadsheet ID configuration
 * @returns {Object|null} - Error object if invalid, null if valid
 */
function validateSpreadsheetId() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
    return {
      success: false,
      error: 'SPREADSHEET_ID not configured. Please update the script with your Google Sheet ID.'
    };
  }
  return null;
}

/**
 * Parses incoming POST data
 * @param {Object} e - The event object
 * @returns {Object} - Parsed data or error object
 */
function parsePostData(e) {
  try {
    if (typeof e.postData.contents === 'string') {
      return { success: true, data: JSON.parse(e.postData.contents) };
    } else {
      return { success: true, data: e.postData.contents };
    }
  } catch (parseError) {
    return {
      success: false,
      error: 'Invalid JSON format: ' + parseError.toString()
    };
  }
}

/**
 * Opens the spreadsheet
 * @returns {Object} - Spreadsheet object or error object
 */
function openSpreadsheet() {
  try {
    return { success: true, spreadsheet: SpreadsheetApp.openById(SPREADSHEET_ID) };
  } catch (error) {
    return {
      success: false,
      error: 'Cannot access spreadsheet. Please check the SPREADSHEET_ID and ensure the script has access.'
    };
  }
}

function doPost(e) {
  try {
    // Validate configuration
    const configError = validateSpreadsheetId();
    if (configError) {
      return ContentService.createTextOutput(JSON.stringify(configError))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Parse incoming data
    const parseResult = parsePostData(e);
    if (!parseResult.success) {
      return ContentService.createTextOutput(JSON.stringify(parseResult))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = parseResult.data;
    
    // Get form configuration
    const formType = data.formType || 'waitlist';
    const config = getFormConfig(formType);
    
    if (!config) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Invalid form type: ' + formType
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Open spreadsheet
    const spreadsheetResult = openSpreadsheet();
    if (!spreadsheetResult.success) {
      return ContentService.createTextOutput(JSON.stringify(spreadsheetResult))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const ss = spreadsheetResult.spreadsheet;
    
    // Get or create sheet
    const sheet = getOrCreateSheet(ss, config);
    
    // Map data to row format using the configured mapper
    const rowData = config.dataMapper(data);
    
    // Append the data
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data added successfully',
      rowNumber: sheet.getLastRow(),
      formType: formType
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      message: 'An error occurred while processing your submission'
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Counts gender entries in a sheet
 * @param {Sheet} sheet - The sheet object
 * @param {number} genderColumnIndex - The column index for gender (0-based)
 * @returns {Object} - Object with maleCount and femaleCount
 */
function countGenders(sheet, genderColumnIndex) {
  if (!sheet || sheet.getLastRow() <= 1) {
    return { maleCount: 0, femaleCount: 0 };
  }
  
  const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
  const data = dataRange.getValues();
  
  let maleCount = 0;
  let femaleCount = 0;
  
  for (let i = 0; i < data.length; i++) {
    const gender = data[i][genderColumnIndex];
    if (gender === 'Male') {
      maleCount++;
    } else if (gender === 'Female') {
      femaleCount++;
    }
  }
  
  return { maleCount, femaleCount };
}

/**
 * Action handlers for GET requests
 */
const GET_ACTIONS = {
  'getGenderCounts': (e) => {
    const formType = e.parameter.formType || 'event';
    const config = getFormConfig(formType);
    
    if (!config || !config.genderColumnIndex) {
      return {
        success: false,
        error: 'Form type does not support gender counting'
      };
    }
    
    const spreadsheetResult = openSpreadsheet();
    if (!spreadsheetResult.success) {
      return spreadsheetResult;
    }
    
    const ss = spreadsheetResult.spreadsheet;
    const sheet = ss.getSheetByName(config.sheetName);
    
    const counts = countGenders(sheet, config.genderColumnIndex);
    
    return {
      success: true,
      maleCount: counts.maleCount,
      femaleCount: counts.femaleCount
    };
  }
  // Add new GET actions here:
  // 'newAction': (e) => { ... }
};

function doGet(e) {
  try {
    const configError = validateSpreadsheetId();
    if (configError) {
      return ContentService.createTextOutput(JSON.stringify(configError))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const action = e.parameter.action;
    
    if (!action) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Action parameter is required'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const actionHandler = GET_ACTIONS[action];
    
    if (!actionHandler) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Invalid action: ' + action
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const result = actionHandler(e);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Test function to verify setup
function test() {
  // Test function - can be removed if not needed
}

