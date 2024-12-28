import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

// Reusable Card Component
const Card: React.FC<{ title: string; content: string[] }> = ({ title, content }) => {
  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.title}>{title}</Text>
      {content.map((item, index) => (
        <Text key={index} style={cardStyles.content}>
          {item}
        </Text>
      ))}
    </View>
  );
};

const HomePage: React.FC = () => {
  const [todayFacts, setTodayFacts] = useState<string[]>([]);
  const [weekFacts, setWeekFacts] = useState<string[][]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedFacts, setSelectedFacts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [calendarLoading, setCalendarLoading] = useState<boolean>(false);

  // Helper to fetch facts for a specific date
  const fetchFactsForDate = async (month: number, day: number): Promise<string[]> => {
    try {
      const response = await fetch(`http://numbersapi.com/${month}/${day}/date?json`);
      const data = await response.json();
      return [data.text];
    } catch {
      return [`No data available for ${month}/${day}`];
    }
  };

  // Fetch today's facts
  const fetchTodayFacts = async () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return fetchFactsForDate(month, day);
  };

  // Fetch this week's facts
  const fetchWeekFacts = async () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
    const facts: string[][] = [];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      const month = currentDay.getMonth() + 1;
      const day = currentDay.getDate();
      facts.push(await fetchFactsForDate(month, day));
    }
    return facts;
  };

  // Fetch calendar facts for selected date
  const fetchSelectedDateFacts = async (date: string) => {
    setCalendarLoading(true);

    try {
      const [year, month, day] = date.split('-');
      const facts = await fetchFactsForDate(parseInt(month), parseInt(day));
      setSelectedFacts(facts);
    } catch {
      Alert.alert('Error', 'Failed to fetch facts for the selected date.');
    } finally {
      setCalendarLoading(false);
    }
  };

  const handleDateSelect = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    fetchSelectedDateFacts(day.dateString);
  };

  // Fetch initial data
  useEffect(() => {
    const fetchAllFacts = async () => {
      setLoading(true);
      try {
        const todayData = await fetchTodayFacts();
        const weekData = await fetchWeekFacts();
        setTodayFacts(todayData);
        setWeekFacts(weekData);
      } catch {
        Alert.alert('Error', 'Failed to fetch initial facts.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllFacts();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Today's Facts */}
          <Card title="Today's Specialities" content={todayFacts} />

          {/* This Week's Facts */}
          <Card
            title="This Week's Specialities"
            content={weekFacts.flat()} // Flatten to display all facts in one list
          />
        </>
      )}

      {/* Calendar Section */}
      <Text style={styles.sectionHeader}>Specialities Calendar</Text>
      <Calendar
        onDayPress={handleDateSelect}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
        }}
      />
      <View style={styles.factContainer}>
        {calendarLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : selectedFacts.length > 0 ? (
          <Card title={`Facts for ${selectedDate}`} content={selectedFacts} />
        ) : (
          <Text style={styles.noDataText}>
            {selectedDate
              ? `No data available for ${selectedDate}`
              : 'Select a date to view facts.'}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

// Styles for the HomePage Component
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  factContainer: {
    flex: 1,
    marginTop: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

// Styles for the Card Component
const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    elevation: 4, // Adds shadow for Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  content: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
});

export default HomePage;
