import { CELL_MARGIN, HomeScreenButton } from "./button";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import { Column } from "../../modules/layout/column";
import * as c from "../../modules/colors";
import { useLayoutEffect } from "react";
import { OpenSettingsButton } from "../../modules/navigation-buttons";

const styles = StyleSheet.create({
  scrollview: {
    flex: 1,
    backgroundColor: c.systemBackground,
  },
  cells: {
    marginHorizontal: CELL_MARGIN / 2,
    paddingTop: CELL_MARGIN,
    flexDirection: "row",
  },
  column: {
    flex: 1,
  },
});

export default function HomeScreenView(): React.JSX.Element {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "CARLS",
      headerRight: () => <OpenSettingsButton />,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.scrollview} edges={["left", "right", "bottom"]}>
      <ScrollView
        alwaysBounceHorizontal={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        testID="screen-homescreen"
      >
        <View style={styles.cells}>
          <Column style={styles.column}>
            <HomeScreenButton
              title="Menus"
              iconName="bowl"
              foreground="light"
              tintColor="#7CBB00"
              onPress={() => {
                router.navigate("../menus");
              }}
            />
            <HomeScreenButton
              title="Building Hours"
              iconName="clock"
              foreground="light"
              tintColor={c.lightBlueToBlueDark[0]}
              onPress={() => {
                router.navigate("../building-hours");
              }}
            />
          </Column>
          <Column style={styles.column}>
            <HomeScreenButton
              title="Transportation"
              iconName="address"
              foreground="light"
              tintColor={c.grayToDarkGray[0]}
              onPress={() => {
                router.navigate("../transportation");
              }}
            />
            <HomeScreenButton
              title="Atheltics"
              iconName="trophy"
              foreground="light"
              tintColor={c.orangeToRed[0]}
              onPress={() => {
                router.navigate("../athletics");
              }}
            />
          </Column>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
