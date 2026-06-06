#!/usr/bin/env bash
# Install existing debug APK to the connected physical device only.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/android-env.sh"
cd "$SCRIPT_DIR/.."

APK="android/app/build/outputs/apk/debug/app-debug.apk"
if [ ! -f "$APK" ]; then
  echo "APK not found. Run: npm run android"
  exit 1
fi

if ! adb devices | grep -v emulator | grep -w device | grep -q .; then
  echo "No physical device connected. Plug in your phone and enable USB debugging."
  adb devices
  exit 1
fi

if ! adb -d install -r "$APK"; then
  echo ""
  echo "Install failed. On Xiaomi/Redmi/POCO, enable in Developer options:"
  echo "  - USB debugging (Security settings)"
  echo "  - Install via USB"
  echo "Then run this script again and accept any prompt on the phone."
  exit 1
fi
echo "Installed. Start Metro: npm start"
echo "Then open Notification Reader on your phone (same Wi‑Fi as this Mac)."
