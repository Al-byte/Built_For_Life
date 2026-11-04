/**
 * Built For Life — shared, browser-safe utilities.
 * Import these into individual page modules; no globals are required.
 */

/** Find an element by its HTML id. */
export const byId = (id) => document.getElementById(id);

/** Escape untrusted text before interpolating it into an HTML string. */
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

/** Deep copy JSON-shaped prototype data. */
export const cloneData = (value) => JSON.parse(JSON.stringify(value));

/** Clamp a numeric form value to the requested interval. */
export function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

/** Show a Bootstrap toast, with optional custom message and delay. */
export function showToast(element, { messageElement, message, delay = 3000 } = {}) {
  if (messageElement && message !== undefined) messageElement.textContent = message;
  if (element && window.bootstrap?.Toast) {
    window.bootstrap.Toast.getOrCreateInstance(element, { delay }).show();
  }
}
