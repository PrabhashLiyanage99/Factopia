import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';

// Floating button to display the click count
const FloatingButton = ({ count }) => {
  return (
    <TouchableOpacity style={styles.floatingButton}>
      <Text style={styles.floatingButtonText}>{count}</Text>
    </TouchableOpacity>
  );
};

const getRandomImageUrl = (id) => `https://picsum.photos/id/${id}/300/200`;

const Card = ({ title, content, imageUri, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={cardStyles.card}>
        {imageUri && <Image source={{ uri: imageUri }} style={cardStyles.image} />}
        <Text style={cardStyles.title}>{title}</Text>
        {content.map((item, index) => (
          <Text key={index} style={cardStyles.content}>
            {item}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const HomePage = () => {
  const { user } = useAuth();
  const [todayFacts, setTodayFacts] = useState([]);
  const [weekFacts, setWeekFacts] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedFacts, setSelectedFacts] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(false);

  const fetchFactsForDate = async (month, day) => {
    try {
      const response = await fetch(`http://numbersapi.com/${month}/${day}/date?json`);
      const data = await response.json();
      return [data.text];
    } catch {
      return [`No data available for ${month}/${day}`];
    }
  };

  const fetchTodayFacts = async () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return fetchFactsForDate(month, day);
  };

  const fetchWeekFacts = async () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const facts = [];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      const month = currentDay.getMonth() + 1;
      const day = currentDay.getDate();
      facts.push(await fetchFactsForDate(month, day));
    }
    return facts;
  };

  const fetchSelectedDateFacts = async (date) => {
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

  const refreshFacts = async () => {
    setLoading(true);
    try {
      const todayData = await fetchTodayFacts();
      const weekData = await fetchWeekFacts();
      setTodayFacts(todayData);
      setWeekFacts(weekData);
    } catch {
      Alert.alert('Error', 'Failed to fetch new facts.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    fetchSelectedDateFacts(day.dateString);
  };

  const getFormattedDate = () => {
    const today = new Date();
    const options = { month: 'long', day: 'numeric' }; 
    return today.toLocaleDateString(undefined, options); 
  };

  useEffect(() => {
    refreshFacts();
  }, []);

  return (
    <ImageBackground
      source={require('./assets/Homepage-background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <Header/>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 100 }]}>
          <Text style={styles.sectionHeader}>
            Welcome back, {user?.username ?? 'Guest'}!
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <Text style={styles.sectionHeader}>Today's Specialities</Text>
              {todayFacts.map((fact, index) => (
                <Card
                  key={`today-${index}`}
                  title={`Today's Fact - ${getFormattedDate()}`}
                  content={[fact]}
                  imageUri={getRandomImageUrl(index + 1)}
                  onPress={() => setClickCount((prev) => prev + 1)}
                />
              ))}

              <Text style={styles.sectionHeader}>This Week's Specialities</Text>
              {weekFacts.flat().map((fact, index) => (
                <Card
                  key={`week-${index}`}
                  title={`Week Fact ${index + 1}`}
                  content={[fact]}
                  imageUri={getRandomImageUrl(index + 10)}
                  onPress={() => setClickCount((prev) => prev + 1)}
                />
              ))}
            </>
          )}

          {/* Calendar Section */}
          <Text style={styles.sectionHeader}>Specialities Calendar</Text>
          <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={handleDateSelect}
                markedDates={{
                  [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
                }}
                theme={{
                  backgroundColor: '#222',
                  calendarBackground: '#222',
                  textSectionTitleColor: '#FFA500',
                  dayTextColor: '#FFA500',
                  todayTextColor: '#FFA500',
                  selectedDayBackgroundColor: 'blue',
                  selectedDayTextColor: '#FFFFFF',
                  arrowColor: '#FFA500',
                  monthTextColor: '#FFA500',
                  textDayFontFamily: 'Arial',
                  textMonthFontFamily: 'Arial',
                  textDayHeaderFontFamily: 'Arial',
                  textDayFontSize: 16,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 14,
                }}
              />
            </View>
          <View style={styles.factContainer}>
            {calendarLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : selectedFacts.length > 0 ? (
              <Card
                title={`Facts for ${selectedDate}`}
                content={selectedFacts}
              />
            ) : (
              <Text style={styles.noDataText}>
                {selectedDate
                  ? `No data available for ${selectedDate}`
                  : 'Select a date to view facts.'}
              </Text>
            )}
          </View>
        </ScrollView>

        {/* New Facts Button */}
        <TouchableOpacity style={styles.refreshButton} onPress={refreshFacts}>
          <Text style={styles.refreshButtonText}>New Facts</Text>
        </TouchableOpacity>

        <FloatingButton count={clickCount} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
    color: '#fff',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#FFA500',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFA500',
  },
  content: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  calendarContainer: {
    backgroundColor: '#222', 
    borderRadius: 16, 
    overflow: 'hidden', 
    marginVertical: 16, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default HomePage;
