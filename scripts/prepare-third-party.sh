#!/bin/bash

ls
ls node_modules
ls node_modules/react-native/
cd node_modules/react-native/third-party/glog-0.3.4/ && ../../scripts/ios-configure-glog.sh && cd ../../../../
