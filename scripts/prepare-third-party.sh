#!/bin/bash

sudo xcode-select -s /Applications/Xcode.app
node_modules/react-native/scripts/ios-install-third-party.sh && node_modules/react-native/scripts/ios-configure-glog.sh
