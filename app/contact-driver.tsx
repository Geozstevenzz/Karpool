import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, TextInput, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const driver = {
  name: 'Bella Huffman',
  profilePic: require('@/assets/images/react-logo.png'), // Replace with the actual path to your image
  status: 'Online',
};

const messagesData = [
  { id: '1', sender: 'driver', text: 'How about these pictures?', time: '5:12 PM' },
  { id: '2', sender: 'passenger', text: 'Looks cool, can you find more options?', time: '5:12 PM' },
  // More mock messages can be added here
];

export default function ContactMessage() {
  const router = useRouter();
  const [newMessage, setNewMessage] = React.useState('');

  const handleSend = () => {
    console.log('Send message:', newMessage);
    setNewMessage('');
  };

  return (
    <View style={styles.container}>
      {/* Status Bar Spacer */}
      <View style={styles.statusBarSpacer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      </View>

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push('/menu')}>
          <Ionicons name="arrow-back" size={24} color="#00308F" />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <View style={styles.profilePicContainer}>
            <Image source={driver.profilePic} style={styles.profilePic} />
            <View style={styles.onlineIndicator} />
          </View>
          <View>
            <Text style={styles.driverName}>{driver.name}</Text>
            <Text style={styles.driverStatus}>{driver.status}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.callButton}>
          <Text style={styles.callText}>Call</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Section */}
      <FlatList
        data={messagesData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === 'driver' ? styles.driverMessage : styles.passengerMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
        )}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Message Input Section */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="attach" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { marginHorizontal: 5 }]}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Write messages..."
        />
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="mic" size={20} color="#00308F" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  statusBarSpacer: {
    height: StatusBar.currentHeight || 20,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  profilePicContainer: {
    position: 'relative',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00FF00',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  driverName: {
    
    fontSize: 16,
    color: '#00308F',
  },
  driverStatus: {
    
    fontSize: 13,
    color: '#007F00',
  },
  profileButton: {
    borderWidth: 1,
    borderColor: '#00308F',
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  profileText: {
    
    fontSize: 14,
    color: '#00308F',
  },
  callButton: {
    backgroundColor: '#00308F',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  callText: {
    
    fontSize: 14,
    color: '#FFFFFF',
  },
  chatContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageContainer: {
    maxWidth: '75%',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  driverMessage: {
    backgroundColor: '#F7F9FC',
    alignSelf: 'flex-start',
  },
  passengerMessage: {
    backgroundColor: '#D0E8FF',
    alignSelf: 'flex-end',
  },
  messageText: {
    
    fontSize: 14,
    color: '#00308F',
  },
  messageTime: {
    
    fontSize: 11,
    color: '#999EA1',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#999EA1',
    borderRadius: 20,
    paddingHorizontal: 10,
    
    fontSize: 14,
    color: '#00308F',
    backgroundColor: '#FFFFFF',
  },
  sendButton: {
    backgroundColor: '#00308F',
    marginLeft: 5,
    padding: 10,
    borderRadius: 20,
  },
});
