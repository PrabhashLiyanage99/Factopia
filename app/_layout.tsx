// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
// import Card from '../components/card';

// const HomePage: React.FC = () => {
//   const [todayFacts, setTodayFacts] = useState<string[]>([]);
//   const [weekFacts, setWeekFacts] = useState<string[][]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   // Helper to fetch facts for a specific date
//   const fetchFactsForDate = async (month: number, day: number): Promise<string[]> => {
//     try {
//       const response = await fetch(`http://numbersapi.com/${month}/${day}/date?json`);
//       const data = await response.json();
//       return [data.text];
//     } catch {
//       return [`No data available for ${month}/${day}`];
//     }
//   };

//   // Fetch today's facts
//   const fetchTodayFacts = async () => {
//     const today = new Date();
//     const month = today.getMonth() + 1;
//     const day = today.getDate();
//     return fetchFactsForDate(month, day);
//   };

//   // Fetch this week's facts
//   const fetchWeekFacts = async () => {
//     const today = new Date();
//     const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
//     const facts: string[][] = [];

//     for (let i = 0; i < 7; i++) {
//       const currentDay = new Date(startOfWeek);
//       currentDay.setDate(startOfWeek.getDate() + i);
//       const month = currentDay.getMonth() + 1;
//       const day = currentDay.getDate();
//       facts.push(await fetchFactsForDate(month, day));
//     }
//     return facts;
//   };

//   useEffect(() => {
//     const fetchAllFacts = async () => {
//       setLoading(true);
//       try {
//         const todayData = await fetchTodayFacts();
//         const weekData = await fetchWeekFacts();
//         setTodayFacts(todayData);
//         setWeekFacts(weekData);
//       } catch {
//         Alert.alert('Error', 'Failed to fetch facts. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAllFacts();
//   }, []);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <>
//           <Card title="Today's Specialities" content={todayFacts} />
//           <Card
//             title="This Week's Specialities"
//             content={weekFacts.flat()} // Flatten to display all facts in one list
//           />
//         </>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//   },
// });

// export default HomePage;
