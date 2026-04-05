/**
 * vhs_events.js
 * Lightweight Custom Event system for ducking the background music.
 * Used to communicate between the VideoPlayer and AudioManager.
 */

export const VHS_EVENT_VIDEO_STATUS = 'vhs:video_status'

export function dispatchVHSVideoEvent(isPlaying) {
  const event = new CustomEvent(VHS_EVENT_VIDEO_STATUS, { detail: { isPlaying } })
  window.dispatchEvent(event)
}
