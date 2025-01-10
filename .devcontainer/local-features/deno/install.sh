#!/usr/bin/env bash
#-------------------------------------------------------------------------------------------------------------
# Script zur Installation und Konfiguration von deno und node-gyp Abhängigkeiten
#-------------------------------------------------------------------------------------------------------------

export DENO_INSTALL="${DENOINSTALLPATH:-"/usr/local/share/deno"}"

UPDATE_RC="${UPDATE_RC:-"true"}"
USERNAME="${USERNAME:-"${_REMOTE_USER:-"automatic"}"}"

set -e

if [ "$(id -u)" -ne 0 ]; then
    echo -e 'Script must be run as root. Use sudo, su, or add "USER root" to your Dockerfile before running this script.'
    exit 1
fi

# Clean up
rm -rf /var/lib/apt/lists/*

# Ensure that login shells get the correct path if the user updated the PATH using ENV.
rm -f /etc/profile.d/00-restore-env.sh
echo "export PATH=${PATH//$(sh -lc 'echo $PATH')/\$PATH}" > /etc/profile.d/00-restore-env.sh
chmod +x /etc/profile.d/00-restore-env.sh

# Determine the appropriate non-root user
if [ "${USERNAME}" = "auto" ] || [ "${USERNAME}" = "automatic" ]; then
    USERNAME=""
    POSSIBLE_USERS=("robinrehbein" "vscode" "node" "codespace" "$(awk -v val=1000 -F ":" '$3==val{print $1}' /etc/passwd)")
    for CURRENT_USER in "${POSSIBLE_USERS[@]}"; do
        if id -u ${CURRENT_USER} > /dev/null 2>&1; then
            USERNAME=${CURRENT_USER}
            break
        fi
    done
    if [ "${USERNAME}" = "" ]; then
        USERNAME=root
    fi
elif [ "${USERNAME}" = "none" ] || ! id -u ${USERNAME} > /dev/null 2>&1; then
    USERNAME=root
fi

updaterc() {
    if [ "${UPDATE_RC}" = "true" ]; then
        echo "Updating /etc/bash.bashrc..."
        if [[ "$(cat /etc/bash.bashrc)" != *"$1"* ]]; then
            echo -e "$1" >> /etc/bash.bashrc
        fi
    fi
}

apt_get_update() {
    if [ "$(find /var/lib/apt/lists/* | wc -l)" = "0" ]; then
        echo "Running apt-get update..."
        apt-get update -y
    fi
}

check_packages() {
    if ! dpkg -s "$@" > /dev/null 2>&1; then
        apt_get_update
        apt-get -y install --no-install-recommends "$@"
    fi
}

export DEBIAN_FRONTEND=noninteractive

check_packages apt-transport-https curl ca-certificates tar gnupg2 dirmngr

if ! type git > /dev/null 2>&1; then
    check_packages git
fi

deno_install_snippet="$(cat << EOF
set -e
umask 0002
# Do not update profile - we'll do this manually
export PROFILE=/dev/null
curl -fsSL https://deno.land/install.sh | sudo DENO_INSTALL=${DENO_INSTALL} bash -s -- -y --no-modify-path
EOF
)"

deno_rc_snippet="$(cat << EOF
# deno
DENO_PATH="${DENO_INSTALL}"
if [ -d "\$DENO_PATH" ]; then
    export PATH="\$DENO_PATH/bin:\$PATH"
    # . "\$DENO_PATH/env"
fi
EOF
)"

if ! cat /etc/group | grep -e "^deno:" > /dev/null 2>&1; then
    groupadd -r deno
fi
usermod -a -G deno ${USERNAME}

umask 0002
if [ ! -d "${DENO_INSTALL}" ]; then
    # Create deno dir, and set sticky bit
    mkdir -p "${DENO_INSTALL}"
    chown "${USERNAME}:deno" "${DENO_INSTALL}"
    chmod g+rws "${DENO_INSTALL}"
    su ${USERNAME} -c "${deno_install_snippet}" 2>&1
    # Update rc files
    if [ "${UPDATE_RC}" = "true" ]; then
        updaterc "${deno_rc_snippet}"
    fi
else
    echo "DENO already installed."
fi

# Clean up
rm -rf /var/lib/apt/lists/*

echo "Done!"
