# Notification Reader

Personal Android app built with **Expo** and **React Native** that captures notifications from whitelisted apps using Android `NotificationListenerService`, stores them in **encrypted secure storage** (`expo-secure-store`), and displays a modern timeline feed.

## Requirements

- Android device or emulator (API 26+)
- **Expo development build** — Expo Go does not include the notification listener native module
- Node.js 20.19+ (recommended per Expo SDK 56)
- **Android SDK** with `adb` on your `PATH` (see below if `expo run:android` fails)

## Android SDK setup (macOS)

If you see `Failed to resolve the Android SDK path` or `spawn adb ENOENT`:

1. Open **Android Studio** → **Settings** (or **Android Studio → Settings** on macOS).
2. Go to **Languages & Frameworks → Android SDK**.
3. Note the **Android SDK Location** (usually `~/Library/Android/sdk`).
4. Install at least one **SDK Platform** (API 34+) and **Android SDK Build-Tools**.
5. On the **SDK Tools** tab, enable **Android SDK Platform-Tools** (includes `adb`).
6. Add to `~/.zshrc`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
```

7. Reload your shell: `source ~/.zshrc`
8. Verify: `adb version` and `echo $ANDROID_HOME`

Then from the project directory:

```bash
npx expo prebuild --platform android
npx expo run:android
```

### Run on a physical Android phone

1. On the phone: **Settings → About phone** → tap **Build number** 7 times → back → **Developer options** → enable **USB debugging**.
2. Connect the phone to your Mac with a **data USB cable** (not charge-only).
3. When prompted on the phone, tap **Allow** (USB debugging / trust this computer).
4. In a terminal (after `source ~/.zshrc`):

```bash
adb devices
```

You should see your phone as `XXXXXXXX    device` (not `unauthorized`).

5. Stop any running emulator if you only want the phone, then:

```bash
npm run android
```

The script auto-detects a physical device and runs `expo run:android --device`.

6. Keep the phone on the **same Wi‑Fi** as your Mac so the dev client can load JS from Metro (`npm start`).

**Already built?** Quick reinstall to the phone only:

```bash
npm run install:phone
npm start
```

**Notification access** must be enabled on the **phone** (Settings → Apps → Special access → Notification access → Notification Reader).

#### `INSTALL_FAILED_USER_RESTRICTED` (Xiaomi / Redmi / POCO)

If adb says **Install canceled by user**:

1. **Settings → Additional settings → Developer options**
2. Enable **USB debugging** (already on)
3. Enable **USB debugging (Security settings)** — confirm with your Mi account if asked
4. Enable **Install via USB** (or **USB installation**)
5. Unplug and replug USB; run `npm run android` again
6. Watch the phone screen — tap **Allow** / **Install** if a popup appears during install

For emulators, use Android Studio **Device Manager**.

### Already set up on this machine?

If `~/.zshrc` includes `ANDROID_HOME` (configured automatically), open a **new terminal** and run:

```bash
source ~/.zshrc
cd /path/to/notification-reader
npx expo start --dev-client
```

In another terminal (with the emulator running or a USB device connected):

```bash
adb devices   # must show a device
npx expo run:android   # builds only if needed; or launch the installed dev client from the emulator
```

**Gradle note:** If the build fails with `JvmVendorSpec IBM_SEMERU`, use Gradle 8.14.3 in `android/gradle/wrapper/gradle-wrapper.properties` (already pinned in this repo after first successful setup).

## Quick start

```bash
npm install
npx expo prebuild --platform android
npx expo run:android
```

## First-run setup

1. Complete onboarding: grant **Notification access** in system settings.
2. Select apps to whitelist (common apps list + manual package entry).
3. Optionally disable battery optimization for reliable background capture.
4. View captured notifications on the **Feed** tab.

## Architecture

- **Screens:** `app/` (Expo Router)
- **Hooks:** TanStack Query + native listener subscription
- **Services:** `NotificationService`, `NotificationListenerBridge`, `InstalledAppsService`
- **Storage:** `expo-secure-store` JSON envelope (max 500 records, configurable retention)
- **State:** Zustand (whitelist, theme, retention) persisted via SecureStore adapter

## OEM troubleshooting

If notifications stop while the app is closed:

- Re-check **Settings → Apps → Special access → Notification access**
- Disable battery optimization for this app
- Some manufacturers (Xiaomi, Samsung, Huawei) require additional autostart permissions

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Metro (dev client) |
| `npm run android` | Run on Android |
| `npm test` | Unit tests (repository dedupe/retention) |

## Privacy

All data stays on-device in encrypted storage. No network backend.
