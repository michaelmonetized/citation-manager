#!/bin/bash
# Non-interactive Convex setup
cd ~/Projects/citation-manager

# Try to use existing testing team project
npx convex dev --configure --team testing --project citation-manager --region us-east-1 <<EOF2
citation-manager
EOF2
