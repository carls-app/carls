#!/bin/bash

sudo xcode-select -s /Applications/Xcode.app
node_modules/react-native/scripts/ios-install-third-party.sh && cd node_modules/react-native/third-party/glog-0.3.4/ && ../../scripts/ios-configure-glog.sh && cd ../../../../
