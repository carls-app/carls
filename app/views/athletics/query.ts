import { client } from "../../modules/api";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { groupBy, toPairs } from "lodash";
import { AthleticsResponse, AthleticsData, GroupedScores } from "./types";

export const keys = {
  all: ["games"] as const,
};

let athleticsUrl =
  "http://athletics.carleton.edu/services/scores_chris.aspx?format=json";

export function useAthleticsGrouped(): UseQueryResult<GroupedScores[]> {
  return useQuery({
    queryKey: keys.all,
    queryFn: async ({ signal }) => {
      // TODO: move this to the proxy server (which is why we have an undefined prefixUrl)
      let response = await client
        .get(athleticsUrl, { signal, prefixUrl: undefined })
        .json();
      return (response as { scores: AthleticsResponse[] }).scores;
    },
    select: (scores) => {
      const now = Date.now();
      const startOfToday = new Date().setHours(0, 0, 0, 0) / 1000;
      const endOfToday = new Date().setHours(23, 59, 59, 999) / 1000;

      // split into categories
      const todayGames = scores.filter(
        (game) =>
          game.timestamp >= startOfToday && game.timestamp <= endOfToday,
      );
      const upcomingGames = scores.filter(
        (game) => game.timestamp > endOfToday,
      );
      const pastGames = scores.filter((game) => game.timestamp < startOfToday);

      // sort each category
      const sortByTimeAndSport = (
        a: AthleticsResponse,
        b: AthleticsResponse,
      ) => {
        if (a.timestamp === b.timestamp) {
          return a.sport.localeCompare(b.sport);
        }
        return a.timestamp - b.timestamp;
      };

      const sortedToday = todayGames.sort(sortByTimeAndSport);
      const sortedUpcoming = upcomingGames.sort(sortByTimeAndSport);
      const sortedPast = pastGames.sort((a, b) => sortByTimeAndSport(b, a)); // Reverse for past games

      // combine all sorted games
      const sortedScores = [...sortedToday, ...sortedUpcoming, ...sortedPast];

      // group by sport
      const grouped = groupBy(sortedScores, "sport");

      return toPairs(grouped)
        .sort(([titleA], [titleB]) => titleA.localeCompare(titleB))
        .map(([title, data]) => ({
          title,
          data,
        }));
    },
  });
}
