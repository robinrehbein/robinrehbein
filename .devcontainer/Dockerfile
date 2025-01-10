FROM ubuntu:jammy

COPY first-run-notice.txt /tmp/scripts/

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    # Restore man command
    && yes | unminimize 2>&1 

# Install basic build tools
RUN apt-get update \
    && apt-get upgrade -y \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    # Basic dev tools
    make \
    software-properties-common \
    xtail \
    libsecret-1-dev \
    # Required for PostgreSQL and Client
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get update \
    && apt-get upgrade -y \
    && add-apt-repository universe \
    && rm -rf /var/lib/apt/lists/*

# Verify expected build and debug tools are present
RUN apt-get update \
    # Clean up
    && apt-get autoremove -y && apt-get clean -y \
    # Move first run notice to right spot
    && mkdir -p "/usr/local/etc/vscode-dev-containers/" \
    && mv -f /tmp/scripts/first-run-notice.txt /usr/local/etc/vscode-dev-containers/

# Remove scripts now that we're done with them
RUN apt-get clean -y && rm -rf /tmp/scripts

# [Optional] Install debugger for development of Codespaces - Not in resulting image by default
ARG DeveloperBuild
RUN if [ -z $DeveloperBuild ]; then \
    echo "not including debugger" ; \
    else \
    curl -sSL https://aka.ms/getvsdbgsh | bash /dev/stdin -v latest -l /vsdbg ; \
    fi
