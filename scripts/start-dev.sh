#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/android-env.sh"
cd "$SCRIPT_DIR/.."

if adb devices | grep -v "List of devices" | grep -v "emulator-" | grep -w "device" | grep -q .; then
  echo "Physical device detected — forwarding Metro (8081) over USB..."
  adb reverse tcp:8081 tcp:8081
  export REACT_NATIVE_PACKAGER_HOSTNAME=localhost
  exec npx expo start --dev-client --localhost "$@"
fi

exec npx expo start --dev-client "$@"
