#!/bin/bash

# https://github.com/facebook/react-native/issues/14382
cd node_modules/react-native/scripts/
curl https://raw.githubusercontent.com/facebook/react-native/5c53f89dd86160301feee024bce4ce0c89e8c187/scripts/ios-configure-glog.sh > ios-configure-glog.sh
chmod +x ios-configure-glog.sh
