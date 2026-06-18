#!/usr/bin/env bash

set -e

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
GUARD="$SCRIPT_DIR/cmd-guard.js"
SHIM_SRC="$SCRIPT_DIR/install-guard.sh"
BIN_DIR=/opt/install-guard/bin
MASTER="$BIN_DIR/.install-guard.sh"

mkdir -p "$BIN_DIR"
install -m 0755 "$SHIM_SRC" "$MASTER"

# Drop shims we created previously (symlinks to our master) so commands removed from the
# rules stop being guarded. Leaves any unrelated files in the dir untouched.
for f in "$BIN_DIR"/*; do
  if [ -L "$f" ] && [ "$(readlink "$f")" = "$MASTER" ]; then
    rm -f "$f"
  fi
done

# One shim per guarded command. Each is a symlink to the master; the shim reads its own
# name (argv0) to know which command it is.
for name in $(node "$GUARD" --list-commands); do
  ln -sf "$MASTER" "$BIN_DIR/$name"
done
