import React, { useState } from 'react';
import { View, Modal, Text, StyleSheet, Image, TouchableOpacity, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useDateTimeStore } from '../store/dateTImeStore';

interface Params {
  selected: boolean;
  color: string | undefined;
}

export default function DatePickerComponent() {
  const dates = useDateTimeStore((state) => state.dates);
  const setDates = useDateTimeStore((state) => state.setDate);
  const time = useDateTimeStore((state) => state.time);
  const setTime = useDateTimeStore((state) => state.setTime);

  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>("Date"); // Default text for date
  const [selectedTime, setSelectedTime] = useState<string>("Time"); // Default text for time

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmTime = (time: Date) => {
    setTime(time); // Update global time in store
    setSelectedTime(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); // Update local state
    hideTimePicker();
  };

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0]; // Return date string in format 'YYYY-MM-DD'
  };

  const selectDate = (day: any) => {
    const selectedDate = day.dateString;
    const newDates = { ...dates };

    if (dates[selectedDate]) {
      delete newDates[selectedDate];
      setDates(newDates);
    } else {
      newDates[selectedDate] = { selected: true, color: 'red' };
      setDates(newDates);
      setSelectedDate(selectedDate); // Update local state with selected date
    }
  };

  return (
    <View style={styles.container}>
      {/* Date Picker */}
      <TouchableOpacity onPress={() => setCalendarModalVisible(true)} style={styles.pressable}>
        <Image source={require('../assets/images/calendar.png')} style={styles.icon} />
        <Text style={styles.text} numberOfLines={1}>
          {selectedDate}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={calendarModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCalendarModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Calendar
              onDayPress={(day: any) => selectDate(day)}
              markedDates={dates}
              minDate={new Date().toISOString().split('T')[0]}
              maxDate={addDays(new Date(), 30)}
            />
            <Button title="Close Calendar" onPress={() => setCalendarModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Time Picker */}
      <TouchableOpacity onPress={showTimePicker} style={styles.pressable}>
        <Image source={require('../assets/images/Clock.png')} style={styles.icon} />
        <Text style={styles.text} numberOfLines={1}>
          {selectedTime}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={hideTimePicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    marginBottom: 7,
    backgroundColor: '#EDFAFF',
    elevation: 5,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});
