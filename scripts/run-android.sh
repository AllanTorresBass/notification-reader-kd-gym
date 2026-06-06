#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=android-env.sh
source "$SCRIPT_DIR/android-env.sh"
cd "$SCRIPT_DIR/.."

PHYSICAL_COUNT=$(adb devices | grep -v "List of devices" | grep -v "emulator-" | grep -w "device" | wc -l | tr -d ' ')

if [ "${PHYSICAL_COUNT}" -gt 0 ]; then
  echo "Physical device detected — forwarding Metro over USB..."
  adb reverse tcp:8081 tcp:8081
  export REACT_NATIVE_PACKAGER_HOSTNAME=localhost
  echo "Building and installing to phone (bundle via localhost:8081)..."
  exec npx expo run:android --device "$@"
fi

EMULATOR_COUNT=$(adb devices | grep "emulator-" | grep -w "device" | wc -l | tr -d ' ')
if [ "${EMULATOR_COUNT}" -gt 0 ]; then
  echo "No physical device found. Using emulator. Connect your phone via USB and enable USB debugging to use a real device."
  exec npx expo run:android "$@"
fi

echo ""
echo "No Android device found."
echo "  1. On your phone: Settings → Developer options → USB debugging ON"
echo "  2. Connect with a data-capable USB cable"
echo "  3. Tap Allow on the computer authorization prompt"
echo "  4. Run: adb devices   (should list your phone as 'device')"
echo "  5. Run: npm run android"
echo ""
exit 1
