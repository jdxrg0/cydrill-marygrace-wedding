/**
 * ============================================================================
 * GRACE & CYDRILL WEDDING — GOOGLE SHEETS LIVE RSVP & GUESTBOOK SCRIPT
 * ============================================================================
 * HOW TO SET UP (Takes ~2 minutes):
 * 1. Go to https://sheets.new to create a new Google Sheet (name it e.g. "Grace & Cydrill Wedding RSVPs").
 * 2. In the top menu, click Extensions -> Apps Script.
 * 3. Delete any code in Code.gs and paste this ENTIRE file.
 * 4. Click the Save icon (💾), then click "Deploy" (top right) -> "New deployment".
 * 5. Click the gear icon ⚙️ next to "Select type" and choose "Web app".
 * 6. Set:
 *      - Description: "Wedding RSVP API"
 *      - Execute as: "Me"
 *      - Who has access: "Anyone"  <-- IMPORTANT so guests don't need to sign in!
 * 7. Click "Deploy" (authorize access if prompted -> Advanced -> Go to project).
 * 8. Copy the "Web app URL" (ends with /exec) and paste it into:
 *      src/config/weddingConfig.ts -> rsvp.googleSheetWebAppUrl
 *    (or send the URL in chat and I will paste it in for you!)
 * ============================================================================
 */

const SHEET_NAME = 'RSVPs';

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0];
    sheet.setName(SHEET_NAME);
  }

  // Automatically create and style the header row if the sheet is empty
  if (sheet.getLastRow() === 0) {
    const headers = [
      'Timestamp',
      'Full Name',
      'Relationship / Role',
      'Attendance',
      'Reserved Seats',
      'Song Request',
      'Well Wishes / Message',
      'Show on Guestbook Wall',
    ];
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange
      .setBackground('#C85A32')
      .setFontColor('#FCFAF5')
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * GET: Returns all visible Guestbook wishes (newest first) for the website's Guestbook Wall
 */
function doGet() {
  try {
    const sheet = getOrCreateSheet();
    const lastRow = sheet.getLastRow();

    if (lastRow <= 1) {
      return ContentService.createTextOutput(
        JSON.stringify({ status: 'ok', wishes: [] })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const values = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
    const wishes = [];

    for (let i = values.length - 1; i >= 0; i--) {
      const [
        timestamp,
        name,
        relationship,
        attendance,
        guestsCount,
        songRequest,
        message,
        showOnWall,
      ] = values[i];

      // Tip: Type "HIDE" or "FALSE" in Column H of the sheet to hide any row from the website wall
      const visibility = String(showOnWall || 'YES').toUpperCase().trim();
      if (visibility === 'HIDE' || visibility === 'FALSE' || visibility === 'NO') {
        continue;
      }

      if (!name) continue;

      wishes.push({
        id: 'row-' + (i + 2),
        createdAt: timestamp ? new Date(timestamp).toISOString() : '',
        name: String(name),
        relationship: String(relationship || 'Loved One & Guest'),
        attendance:
          String(attendance).toLowerCase().indexOf('regret') !== -1
            ? 'regrets'
            : 'attending',
        guestsCount: Number(guestsCount || 0),
        songRequest: String(songRequest || ''),
        message: String(message || ''),
      });
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'ok', wishes: wishes })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * POST: Appends a new guest RSVP & Wish row into the Google Sheet
 */
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const payload = JSON.parse(e.postData.contents || '{}');

    const timestamp = new Date();
    const name = String(payload.name || '').trim();
    const relationship = String(payload.relationship || 'Loved One & Guest').trim();
    const attendance =
      payload.attendance === 'regrets' ? 'Sending Regrets' : 'Joyfully Attending';
    const guestsCount =
      payload.attendance === 'regrets' ? 0 : Number(payload.guestsCount || 1);
    const songRequest = String(payload.songRequest || '').trim();
    const message = String(payload.message || '').trim();

    sheet.appendRow([
      timestamp,
      name,
      relationship,
      attendance,
      guestsCount,
      songRequest,
      message,
      'YES',
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'ok' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
