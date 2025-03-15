import React, { useState } from 'react';
import { View, Modal, Text, StyleSheet, Image, TouchableOpacity, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useDateTimeStore } from '../store/dateTImeStore';
import { useUserMode } from '../store/userModeStore';


interface Params {
  selected: boolean;
  color: string | undefined;
}

export default function DatePickerComponent() {
  const dates = useDateTimeStore((state) => state.dates);
  const setDates = useDateTimeStore((state) => state.setDate);
  const time = useDateTimeStore((state) => state.time);
  const setTime = useDateTimeStore((state) => state.setTime);
  const userMode = useUserMode((state) => state.mode)

  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const [selectedDates, setSelectedDates] = useState<string[]>([]); // Store multiple dates
  const [selectedTime, setSelectedTime] = useState<string>("Select Time"); // Default text for time

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

    if (userMode === "passenger") {
      // If the selected date is already chosen, remove it (allow deselection)
      if (selectedDates.includes(selectedDate)) {
          setDates({});
          setSelectedDates([]);
      } else {
          setDates({ [selectedDate]: { selected: true, color: 'red' } });
          setSelectedDates([selectedDate]);
      }
  }
   else {
        // Drivers can select multiple dates
        if (dates[selectedDate]) {
            delete newDates[selectedDate]; // Deselect date
            setDates(newDates);
            setSelectedDates(prevDates => prevDates.filter(date => date !== selectedDate));
        } else {
            newDates[selectedDate] = { selected: true, color: 'red' };
            setDates(newDates);
            setSelectedDates(prevDates => [...prevDates, selectedDate]);
        }
    }
};

  return (
    <View style={styles.container}>
      {/* Date Picker */}
      <TouchableOpacity onPress={() => setCalendarModalVisible(true)} style={styles.pressable}>
        <Image source={require('../assets/images/calendar.png')} style={styles.icon} />
        <Text style={styles.text} numberOfLines={1}>
          {selectedDates.length > 0 ? selectedDates.join(', ') : "Select Date(s)"}
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
