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
const SHEET_NAME = 'Waitlist'; // Name of the sheet tab

function doPost(e) {
  try {
    // Check if SPREADSHEET_ID is configured
    if (!SPREADSHEET_ID || SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'SPREADSHEET_ID not configured. Please update the script with your Google Sheet ID.'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Parse the incoming JSON data
    let data;
    try {
      if (typeof e.postData.contents === 'string') {
        data = JSON.parse(e.postData.contents);
      } else {
        data = e.postData.contents;
      }
    } catch (parseError) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Invalid JSON format: ' + parseError.toString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Open the spreadsheet
    let ss;
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (error) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Cannot access spreadsheet. Please check the SPREADSHEET_ID and ensure the script has access.'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Add headers
      sheet.getRange(1, 1, 1, 15).setValues([[
        'Timestamp', 
        'Name', 
        'Email', 
        'Gender', 
        'Birthday', 
        'DUPR Rating',
        'DUPR ID',
        'Looking to Date',
        'When Do You Play',
        'Type of Partner',
        'Partner Type',
        'Date Gender Preference',
        'Current Club', 
        'City', 
        'Country'
      ]]);
      sheet.getRange(1, 1, 1, 15).setFontWeight('bold');
    }
    
    // Check if headers exist, if not add them
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 15).setValues([[
        'Timestamp', 
        'Name', 
        'Email', 
        'Gender', 
        'Birthday', 
        'DUPR Rating', 
        'DUPR ID',
        'Looking to Date',
        'When Do You Play',
        'Type of Partner',
        'Partner Type',
        'Date Gender Preference',
        'Current Club', 
        'City', 
        'Country'
      ]]);
      sheet.getRange(1, 1, 1, 15).setFontWeight('bold');
    }
    
    // Append the data
    const timestamp = new Date(data.timestamp || new Date());
    const rowData = [
      timestamp,
      data.name || '',
      data.email || '',
      data.gender || '',
      data.birthday || '',
      data.duprRating || '',
      data.duprId || '',
      data.lookingToDate || '',
      data.whenDoYouPlay || '',
      data.lookingFor || '',
      data.partnerType || '',
      data.dateGenderPreference || '',
      data.currentClub || '',
      data.city || '',
      data.country || ''
    ];
    
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data added successfully',
      rowNumber: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      message: 'An error occurred while processing your submission'
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Test function to verify setup
function test() {
  // Test function - can be removed if not needed
}

