#!/bin/bash

PLIST=platforms/ios/*/*-Info.plist

echo 'exec overwrite_plist.sh'

cat << EOF |
Delete :CFBundleDevelopmentRegion
Add :CFBundleDevelopmentRegion array
Add :CFBundleDevelopmentRegion:0 string "Japanese"
Delete :CFBundleLocalizations
Add :CFBundleLocalizations array
Add :CFBundleLocalizations:0 string "ja"
EOF
while read line
do
      /usr/libexec/PlistBuddy -c "$line" $PLIST
done

true