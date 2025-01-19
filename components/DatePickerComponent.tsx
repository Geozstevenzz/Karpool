import React, { useState } from 'react';
import { View, Button, Modal, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useDateTimeStore} from '../store/dateTImeStore'

interface Params {
  selected: boolean;
  color: string | undefined;
}

interface DatePickerProps {
  onTimeChange: (time: Date) => void;
}
interface DateType {
  [key: string]: Params;
}

export default function DatePickerComponent() {
    const dates = useDateTimeStore((state) => state.dates);
    const setDates =  useDateTimeStore((state) => state.setDate);
    const onTimeChange = useDateTimeStore((state) => state.setTime)

    const [calendarModalVisible, setcalendarModalVisible] = useState(false); 
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const showTimePicker = () => {
      setTimePickerVisibility(true);
    };
  
    const hideTimePicker = () => {
      setTimePickerVisibility(false);
    };
  
    const handleConfirmTime = (time: Date) => {
      onTimeChange(time);
      // console.log(time.toLocaleTimeString());
      hideTimePicker();
    };
  
    function selectDate(day: any) {
      let selectedDate = day.dateString;
      let newDates = { ...dates };
  
      if (dates[selectedDate]) {
        delete newDates[selectedDate];
        setDates(newDates);
      } else {
        let obj1: Params = {
          selected: true,
          color: 'red',
        };
  
        newDates[selectedDate] = obj1;
        setDates(newDates);
        // console.log(newDates);
        // for (const date in newDates)
        // {
        //   console.log(date + " ")
        // }
        //setSelectedDates(newDates);

      }
    }
  
    function addDays(date: Date, days: number) {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result.toDateString();
    }


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setcalendarModalVisible(true)} style={styles.pressable}>
        <Image source={require('../assets/images/calendar.png')} style={styles.icon} />
        <Text style={styles.text}>Date</Text>
      </TouchableOpacity>
      <Modal
          visible={calendarModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setcalendarModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Calendar
                onDayPress={(day: any) => selectDate(day)}
                markedDates={dates}
                minDate={new Date().toDateString()}
                maxDate={addDays(new Date(), 30)}
              />
              
              <Button title="Close Calendar" onPress={() => setcalendarModalVisible(false)} />
            </View>
          </View>
        </Modal>


      <TouchableOpacity onPress={showTimePicker} style={styles.pressable}>
        <Image source={require('../assets/images/Clock.png')} style={styles.icon} />
        <Text style={styles.text}>Time</Text>
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
  }
});

