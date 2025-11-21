#!/bin/bash
# Build script for Render deployment

# Install dependencies
npm install

# Build the frontend
npm run build

# The dist folder will be served statically by Render