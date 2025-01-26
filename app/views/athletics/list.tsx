import React from "react";
import { SectionList, StyleSheet, Text } from "react-native";
import { useAthleticsGrouped } from "./query";
import { AthleticsRow } from "./row";
import { LoadingView, NoticeView } from "../../modules/notice";

export const AthleticsListView = () => {
  const {
    data = [],
    error,
    refetch,
    isLoading,
    isError,
  } = useAthleticsGrouped();

  if (isError) {
    return (
      <NoticeView
        buttonText="Try again?"
        onPress={refetch}
        text={`A problem occurred while loading: ${String(error)}`}
      />
    );
  }

  if (isLoading) {
    return <LoadingView />;
  }

  if (!data.length) {
    return <NoticeView text="Oops! We didn't find any data." />;
  }

  return (
    <SectionList
      sections={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <AthleticsRow data={[item]} />}
      renderSectionHeader={({ section }) => (
        <Text style={styles.header}>{section.title}</Text>
      )}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
});
