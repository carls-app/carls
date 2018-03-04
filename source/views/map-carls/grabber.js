// @flow

import * as React from 'react'
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import * as c from '../components/colors'

export const GrabberBar = ({onPress}: {onPress: () => any}) => (
    <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.grabber} />
    </TouchableWithoutFeedback>
)

const styles = StyleSheet.create({
    grabber: {
        backgroundColor: c.iosGray,
        borderRadius: 4,
        height: 4,
        width: 30,
        alignSelf: 'center',
        marginBottom: 1,
        marginTop: 6,
    },
})
