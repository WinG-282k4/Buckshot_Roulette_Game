// Avatar mapping utility
// Maps color names to avatar image paths

import blackAvatar from '../assets/img/avatar/black.png';
import blueAvatar from '../assets/img/avatar/blue.png';
import browAvatar from '../assets/img/avatar/brow.png';
import grayAvatar from '../assets/img/avatar/gray.png';
import greenAvatar from '../assets/img/avatar/green.png';
import purpleAvatar from '../assets/img/avatar/purple.png';
import redAvatar from '../assets/img/avatar/red.png';
import timAvatar from '../assets/img/avatar/tim.png';
import yellowAvatar from '../assets/img/avatar/yellow.png';

export const AVATAR_MAP: Record<string, string> = {
  'black': blackAvatar,
  'blue': blueAvatar,
  'brown': browAvatar,
  'brow': browAvatar,
  'gray': grayAvatar,
  'green': greenAvatar,
  'purple': purpleAvatar,
  'red': redAvatar,
  'tim': timAvatar,
  'yellow': yellowAvatar
};

/**
 * Get avatar image path from color name
 * @param colorName - Color name (e.g., "blue", "red", "purple")
 * @returns Avatar image path, defaults to purple if not found
 */
export const getAvatarByColor = (colorName?: string): string => {
  if (!colorName) return purpleAvatar;
  return AVATAR_MAP[colorName] || purpleAvatar;
};

/**
 * Get avatar color name from URL or plain color name
 * Handles both formats:
 * - URL: "/assets/img/avatar/blue.png" -> "blue"
 * - Color name: "blue" -> "blue"
 */
export const getColorFromAvatarUrl = (url?: string): string => {
  if (!url) return 'purple';

  // Check if it's a full URL path (contains "/avatar/")
  if (url.includes('/avatar/')) {
    const match = url.match(/\/avatar\/(\w+)\.png/);
    return match ? match[1] : 'purple';
  }

  // Otherwise, treat it as a plain color name
  return url;
};

