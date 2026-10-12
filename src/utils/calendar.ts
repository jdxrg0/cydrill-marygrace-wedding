import React from 'react';
import { weddingConfig } from '../config/weddingConfig';

function formatToCalendarUTC(isoString: string): string {
  const date = new Date(isoString);
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function getGoogleCalendarUrl(): string {
  const { couple, schedule, location } = weddingConfig;
  const start = formatToCalendarUTC(schedule.isoDate);
  const end = formatToCalendarUTC(schedule.endIsoDate);
  const title = encodeURIComponent(`${couple.displayTitle}'s Wedding Celebration`);
  const details = encodeURIComponent(
    `We can't wait to celebrate with you! Official Hashtag: ${couple.hashtag}\nVenue: ${location.venueName}, ${location.addressLine1}, ${location.addressLine2}`
  );
  const loc = encodeURIComponent(`${location.venueName}, ${location.addressLine1}, ${location.addressLine2}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&ctz=Asia%2FManila&details=${details}&location=${loc}`;
}

/**
 * Constructs an Android Intent URI with ACTION_INSERT and vnd.android.cursor.item/event.
 * This instructs the Android operating system to directly launch the native Google Calendar
 * app with pre-filled wedding event details instead of opening in a mobile web browser tab.
 */
export function getAndroidCalendarIntentUrl(): string {
  const { couple, schedule, location } = weddingConfig;
  const startMs = new Date(schedule.isoDate).getTime();
  const endMs = new Date(schedule.endIsoDate).getTime();
  const title = encodeURIComponent(`${couple.displayTitle}'s Wedding Celebration`);
  const details = encodeURIComponent(
    `We can't wait to celebrate with you! Official Hashtag: ${couple.hashtag}\nVenue: ${location.venueName}, ${location.addressLine1}, ${location.addressLine2}`
  );
  const loc = encodeURIComponent(
    `${location.venueName}, ${location.addressLine1}, ${location.addressLine2}`
  );
  const fallback = encodeURIComponent(getGoogleCalendarUrl());

  return `intent:#Intent;action=android.intent.action.INSERT;type=vnd.android.cursor.item/event;package=com.google.android.calendar;S.title=${title};S.description=${details};S.eventLocation=${loc};l.beginTime=${startMs};l.endTime=${endMs};S.browser_fallback_url=${fallback};end;`;
}

/**
 * Opens the native Google Calendar app directly on Android devices with the pre-filled wedding event
 * via an Android ACTION_INSERT intent, while preserving clean new-tab behavior on desktop browsers and iOS.
 */
export function openGoogleCalendarApp(e: React.MouseEvent<HTMLAnchorElement>): void {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

  const ua = navigator.userAgent || '';
  const isAndroid = /Android/i.test(ua);

  if (isAndroid) {
    e.preventDefault();
    window.location.href = getAndroidCalendarIntentUrl();
    return;
  }

  // Desktop & iOS: opens standard web link in a fresh new tab via <a target="_blank">
}

/**
 * Opens the native Google Maps app directly on Android & iOS instead of opening a mobile web tab,
 * while preserving normal new-tab behavior on desktop browsers.
 */
export function openGoogleMapsApp(e: React.MouseEvent<HTMLAnchorElement>): void {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

  const { location } = weddingConfig;
  const ua = navigator.userAgent || '';
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);

  if (!isAndroid && !isIOS) {
    // Desktop: let the standard <a target="_blank"> open in a new browser tab
    return;
  }

  e.preventDefault();

  // Extract query parameter from googleMapsUrl or fall back to venue address
  let rawQuery = `${location.venueName}, ${location.addressLine1}, ${location.addressLine2}`;
  try {
    const parsed = new URL(location.googleMapsUrl);
    const q = parsed.searchParams.get('query') || parsed.searchParams.get('q');
    if (q) rawQuery = q;
  } catch {
    // Keep default rawQuery
  }

  const encodedQuery = encodeURIComponent(rawQuery);

  if (isAndroid) {
    // Android Intent URI launches the native Google Maps app directly without opening a browser tab
    const fallback = encodeURIComponent(location.googleMapsUrl);
    window.location.href = `intent://maps.google.com/maps?q=${encodedQuery}#Intent;scheme=https;package=com.google.android.apps.maps;S.browser_fallback_url=${fallback};end`;
    return;
  }

  if (isIOS) {
    // Try launching the native Google Maps iOS app first; fall back to native Apple Maps if not installed
    window.location.href = `comgooglemaps://?q=${encodedQuery}`;
    setTimeout(() => {
      if (!document.hidden) {
        window.location.href = `maps://?q=${encodedQuery}`;
      }
    }, 600);
  }
}

export function downloadIcsFile(): void {
  const { couple, schedule, location } = weddingConfig;
  const start = formatToCalendarUTC(schedule.isoDate);
  const end = formatToCalendarUTC(schedule.endIsoDate);

  const now = formatToCalendarUTC(new Date().toISOString());
  const uid = `wedding-${start}-${end}@grace-cydrill.wedding`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ate Grace Wedding//Boho Sunset Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${couple.displayTitle}'s Wedding Celebration`,
    `DESCRIPTION:Join us as we celebrate the union of ${couple.groomFullName} & ${couple.brideFullName}. Official Hashtag: ${couple.hashtag}\\nVenue: ${location.venueName}, ${location.addressLine1}, ${location.addressLine2}`,
    `LOCATION:${location.venueName}\\, ${location.addressLine1}\\, ${location.addressLine2}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute(
    'download',
    `${couple.groomFirstName}-${couple.brideFirstName.replace(/\s+/g, '-')}-Wedding.ics`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
