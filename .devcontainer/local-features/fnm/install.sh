#!/usr/bin/env bash
#-------------------------------------------------------------------------------------------------------------
# Script zur Installation und Konfiguration von fnm und node-gyp Abhängigkeiten
#-------------------------------------------------------------------------------------------------------------

export FNM_DIR="${FNMINSTALLPATH:-"/usr/local/share/fnm"}"

UPDATE_RC="${UPDATE_RC:-"true"}"
USERNAME="${USERNAME:-"${_REMOTE_USER:-"automatic"}"}"
NODE_GYP_DEPENDENCIES="${NODEGYPDEPENDENCIES:-true}"

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

fnm_install_snippet="$(cat << EOF
set -e
umask 0002
# Do not update profile - we'll do this manually
export PROFILE=/dev/null
curl -fsSL https://fnm.vercel.app/install | bash -s -- --install-dir "${FNM_DIR}" --skip-shell
EOF
)"

fnm_rc_snippet="$(cat << EOF
# fnm
FNM_PATH="${FNM_DIR}"
if [ -d "\$FNM_PATH" ]; then
    export PATH="\$FNM_PATH/bin:\$PATH"
    eval "\$(fnm env --use-on-cd --resolve-engines --corepack-enabled --shell bash)"
fi
EOF
)"

if ! cat /etc/group | grep -e "^fnm:" > /dev/null 2>&1; then
    groupadd -r fnm
fi
usermod -a -G fnm ${USERNAME}

umask 0002
if [ ! -d "${FNM_DIR}" ]; then
    # Create fnm dir, and set sticky bit
    mkdir -p "${FNM_DIR}"
    chown "${USERNAME}:fnm" "${FNM_DIR}"
    chmod g+rws "${FNM_DIR}"
    su ${USERNAME} -c "${fnm_install_snippet}" 2>&1
    # Update rc files
    if [ "${UPDATE_RC}" = "true" ]; then
        updaterc "${fnm_rc_snippet}"
    fi
else
    echo "FNM already installed."
fi

if [ "${NODE_GYP_DEPENDENCIES}" = "true" ]; then
    echo "Verifying node-gyp OS requirements..."
    to_install=""
    if ! type make > /dev/null 2>&1; then
        to_install="${to_install} make"
    fi
    if ! type gcc > /dev/null 2>&1; then
        to_install="${to_install} gcc"
    fi
    if ! type g++ > /dev/null 2>&1; then
        to_install="${to_install} g++"
    fi
    if ! type python3 > /dev/null 2>&1; then
        to_install="${to_install} python3-minimal"
    fi
    if [ ! -z "${to_install}" ]; then
        apt_get_update
        apt-get -y install ${to_install}
    fi
fi

# Clean up
rm -rf /var/lib/apt/lists/*

echo "Done!"
