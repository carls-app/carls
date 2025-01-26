import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  PixelRatio,
} from "react-native";

import { AthleticsData } from "./types";
import { formatGameTime } from "./utils";

import * as c from "../../modules/colors";

export function AthleticsRow({ data }: { data: AthleticsData }) {
  return (
    <ScrollView>
      {data.map((item, index) => (
        <View key={`${index}-${item.id}`}>
          <Text style={styles.sportTime}>{formatGameTime(item.date_utc)}</Text>
          <View style={styles.container}>
            <View style={styles.team}>
              {item.hometeam_logo ? (
                <Image
                  style={styles.teamLogo}
                  source={{ uri: item.hometeam_logo }}
                />
              ) : null}

              <Text style={styles.teamName}>
                {item.hometeam.trim().toUpperCase()}
              </Text>
            </View>

            <View style={styles.gameInfo}>
              <Text style={styles.infoProcess}>
                {item.prescore_info
                  ? item.prescore_info
                  : item.status.indicator}
              </Text>

              {item.status.indicator !== "A" && (
                <View style={styles.infoScorePanel}>
                  <Text style={styles.infoScore}>{item.team_score}</Text>
                  <View style={styles.infoDivider} />
                  <Text style={styles.infoScore}>{item.opponent_score}</Text>
                </View>
              )}
            </View>

            <View style={styles.team}>
              {item.opponent_logo ? (
                <Image
                  style={styles.teamLogo}
                  source={{ uri: item.opponent_logo }}
                />
              ) : null}

              <Text style={styles.teamName}>
                {item.opponent.trim().toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: c.white,
    borderRadius: 5,
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 12,
    marginBottom: 10,
  },
  sportTime: {
    color: c.black,
    fontWeight: "500",
    fontSize: 16,
    padding: 5,
    textAlign: "center",
  },
  team: {
    alignItems: "center",
    borderRadius: 5,
    flex: 1.5,
  },
  teamLogo: {
    width: 50,
    height: 50,
    marginTop: 12,
    marginBottom: 5,
  },
  teamCity: {
    color: c.black,
    fontSize: 11,
    marginTop: 2,
  },
  teamName: {
    color: c.black,
    fontWeight: "bold",
    fontSize: 13,
    position: "relative",
    paddingBottom: 12,
    top: 0,
    justifyContent: "center",
    textAlign: "center",
  },
  gameInfo: {
    alignItems: "center",
    flex: 1.5,
    flexDirection: "column",
  },
  infoProcess: {
    color: c.black,
    fontSize: 10,
    marginTop: 22,
    marginBottom: 3,
  },
  processUnstart: {
    fontSize: 22,
    position: "relative",
    top: 13,
  },
  infoScorePanel: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  infoScore: {
    color: c.black,
    fontWeight: "500",
    fontSize: 24,
    textAlign: "center",
    width: 50,
  },
  infoDivider: {
    backgroundColor: c.systemGray,
    height: 25,
    marginTop: 7,
    marginLeft: 10,
    marginRight: 10,
    width: 2 / PixelRatio.get(),
  },
});
