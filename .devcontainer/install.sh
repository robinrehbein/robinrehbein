#!/bin/bash

# Set up git config user
git config --global --replace-all user.name "Robin Rehbein" \
&& git config --global --replace-all user.email "github@robinrehbein.de"

# create database
# psql postgresql://postgres:postgres@localhost:5432 -c "CREATE DATABASE <your_database_name>;"