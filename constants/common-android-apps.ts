import {
  BANCO_DE_VENEZUELA_LABEL,
  BANCO_DE_VENEZUELA_PACKAGE,
} from './whitelist-defaults';

export interface InstalledAppInfo {
  packageName: string;
  appLabel: string;
}

export const COMMON_ANDROID_APPS: InstalledAppInfo[] = [
  { packageName: 'com.whatsapp', appLabel: 'WhatsApp' },
  { packageName: 'org.telegram.messenger', appLabel: 'Telegram' },
  { packageName: 'com.google.android.gm', appLabel: 'Gmail' },
  { packageName: 'com.instagram.android', appLabel: 'Instagram' },
  { packageName: 'com.facebook.orca', appLabel: 'Messenger' },
  { packageName: 'com.facebook.katana', appLabel: 'Facebook' },
  { packageName: 'com.twitter.android', appLabel: 'X' },
  { packageName: 'com.discord', appLabel: 'Discord' },
  { packageName: 'com.slack', appLabel: 'Slack' },
  { packageName: 'com.microsoft.teams', appLabel: 'Teams' },
  { packageName: 'com.google.android.apps.messaging', appLabel: 'Messages' },
  { packageName: 'com.android.chrome', appLabel: 'Chrome' },
  { packageName: 'com.spotify.music', appLabel: 'Spotify' },
  { packageName: 'com.amazon.mShop.android.shopping', appLabel: 'Amazon' },
  { packageName: 'com.linkedin.android', appLabel: 'LinkedIn' },
  { packageName: 'com.snapchat.android', appLabel: 'Snapchat' },
  { packageName: 'com.reddit.frontpage', appLabel: 'Reddit' },
  { packageName: 'com.google.android.youtube', appLabel: 'YouTube' },
  { packageName: BANCO_DE_VENEZUELA_PACKAGE, appLabel: BANCO_DE_VENEZUELA_LABEL },
];
