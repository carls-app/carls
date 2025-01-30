import React from 'react'
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  PixelRatio,
} from 'react-native'

import { AthleticsData } from './types'

import * as c from '../../modules/colors'

export function AthleticsRow({
  data,
  includePrefix = true,
}: {
  data: AthleticsData
  includePrefix?: boolean
}) {
  return (
    <ScrollView>
      {data.map((item, index) => {
        if (item.prescore_info === 'No team scores') {
          return null
        }

        return (
          <View key={`${index}-${item.id}`} style={styles.rowContainer}>
            <Text style={styles.sportName}>{item.sport}</Text>
            <View style={styles.container}>
              <View style={styles.teamLeft}>
                {item.hometeam_logo ? (
                  <Image
                    style={styles.teamLogo}
                    source={{ uri: item.hometeam_logo }}
                  />
                ) : null}

                <Text style={styles.teamName}>{item.hometeam.trim()}</Text>
              </View>

              <View style={styles.gameInfo}>
                {item.status.indicator === 'A' ? (
                  <Text style={styles.infoTime}>{item.time}</Text>
                ) : (
                  <>
                    <Text style={styles.infoProcess} />

                    {item.status.indicator === 'O' && (
                      <View style={styles.infoScorePanel}>
                        <Text style={styles.infoScore}>{item.team_score}</Text>
                        <View style={styles.infoDivider} />
                        <Text style={styles.infoScore}>
                          {item.opponent_score}
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </View>

              <View style={styles.teamRight}>
                {item.opponent_logo ? (
                  <Image
                    style={styles.teamLogo}
                    source={{ uri: item.opponent_logo }}
                  />
                ) : null}

                <Text style={styles.teamName}>{item.opponent.trim()}</Text>
              </View>
            </View>
          </View>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  rowContainer: {
    backgroundColor: c.systemBackground,
    borderRadius: 10,
    marginHorizontal: 3,
    marginVertical: 5,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sportName: {
    color: c.label,
    fontSize: 11,
    fontWeight: 'bold',
    padding: 2,
    textAlign: 'center',
  },
  container: {
    backgroundColor: c.systemBackground,
    borderRadius: 5,
    flex: 1,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sportTime: {
    color: c.black,
    fontWeight: '500',
    fontSize: 14,
    padding: 4,
    textAlign: 'center',
  },
  teamLeft: {
    alignItems: 'center',
    flex: 1,
  },
  teamRight: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 30,
    height: 30,
    marginVertical: 4,
  },
  teamName: {
    color: c.label,
    fontSize: 12,
    textAlign: 'center',
  },
  gameInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  infoProcess: {
    fontSize: 8,
    marginVertical: 2,
  },
  infoTime: {
    color: c.label,
    fontSize: 14,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  processUnstart: {
    fontSize: 18,
  },
  infoScorePanel: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  infoScore: {
    color: c.label,
    fontWeight: '500',
    fontSize: 20,
    textAlign: 'center',
    width: 40,
  },
  infoDivider: {
    backgroundColor: c.systemGray,
    height: 20,
    width: 2 / PixelRatio.get(),
    marginHorizontal: 8,
  },
})
