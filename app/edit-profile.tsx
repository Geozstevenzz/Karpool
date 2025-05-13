import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../store/userStore';
import * as SecureStore from 'expo-secure-store';

export default function EditProfile() {
  const router = useRouter();
  const { user, clearUser } = useUserStore();
  const [userInterests, setUserInterests] = useState(user?.interests || []);
  const [showInterestDropdown, setShowInterestDropdown] = useState(false);

  const interestOptions = [
    'Sports', 'Cricket', 'Literature', 'Fashion', 'Clothing',
    'Poetry', 'Vehicles', 'Travel', 'Politics', 'Science'
  ];

  const handleUpdateInterests = async () => {
    const token = await SecureStore.getItemAsync('userToken');
          if (!token) {
            throw new Error('No token found. Please log in again.');
          }
    try {
      const response = await fetch(`http://10.0.2.2:9000/user/${user.userid}/interests`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests: userInterests }),
      });

      if (!response.ok) {
        Alert.alert('Update Failed', 'Unable to update interests.');
      } else {
        Alert.alert('Success', 'Interests updated successfully.');
      }
    } catch (error) {
      console.error('Error updating interests:', error);
      Alert.alert('Error', 'An error occurred while updating interests.');
    }
  };

  const handleDeleteProfile = () => {
  Alert.alert(
    'Confirm Deletion',
    'Are you sure you want to delete your profile? This action cannot be undone.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
            const token = await SecureStore.getItemAsync('userToken');
          if (!token) {
            throw new Error('No token found. Please log in again.');
          }
          try {
            const response = await fetch(`http://10.0.2.2:9000/user/${user.userid}`, {
              method: 'DELETE',
            });

            if (!response.ok) {
              Alert.alert('Deletion Failed', 'Could not delete profile.');
              return;
            }

            clearUser();
            Alert.alert('Deleted', 'Your profile has been deleted.', [
              { text: 'OK', onPress: () => router.replace('/') },
            ]);
          } catch (error) {
            console.error('Error deleting profile:', error);
            Alert.alert('Error', 'An error occurred while deleting your profile.');
          }
        },
      },
    ]
  );
};


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#00308F" />
        </TouchableOpacity>
        <Text style={styles.header}>Edit Interests</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.inputContainer}>
          <Text style={styles.label}>User Interests</Text>
          <TouchableOpacity
            style={styles.interestBox}
            onPress={() => setShowInterestDropdown(!showInterestDropdown)}
          >
            <Text style={{ color: '#00308F' }}>
              {userInterests.length === 0 ? 'Select Interests' : ''}
            </Text>
            <View style={styles.selectedTagsContainer}>
              {userInterests.map((interest, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{interest}</Text>
                  <TouchableOpacity onPress={() => {
                    setUserInterests(userInterests.filter(i => i !== interest));
                  }}>
                    <Text style={styles.removeTag}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </TouchableOpacity>

          {showInterestDropdown && (
            <View style={styles.dropdownWrapper}>
              <ScrollView style={styles.dropdown} nestedScrollEnabled>
                {interestOptions.map((interest, idx) => {
                  const alreadySelected = userInterests.includes(interest);
                  return (
                    <TouchableOpacity
                      key={idx}
                      disabled={alreadySelected || userInterests.length >= 5}
                      style={[styles.dropdownItem, alreadySelected && { opacity: 0.4 }]}
                      onPress={() => {
                        if (!alreadySelected && userInterests.length < 5) {
                          setUserInterests([...userInterests, interest]);
                        }
                      }}
                    >
                      <Text style={{ color: '#00308F' }}>{interest}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdateInterests}>
          <Text style={styles.buttonText}>Update Interests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteProfile}>
          <Text style={styles.buttonText}>Delete Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  headerContainer: {
    width: '90%',
    alignItems: 'flex-start',
    marginTop: 50,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    color: '#00308F',
    marginLeft: 10,
  },
  inputContainer: {
    width: '90%',
    marginBottom: 11,
    zIndex: 1,
  },
  label: {
    fontSize: 13,
    color: '#00308F',
    marginBottom: 3,
    marginLeft: 5,
  },
  interestBox: {
    borderWidth: 1,
    borderColor: '#999ea1',
    borderRadius: 8,
    padding: 5,
    minHeight: 33,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00308F',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 2,
  },
  tagText: {
    color: '#FFFFFF',
    marginRight: 5,
  },
  removeTag: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dropdownWrapper: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#999ea1',
    borderRadius: 8,
    maxHeight: 150,
    marginTop: 5,
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 999,
  },
  dropdown: {
    maxHeight: 150,
  },
  dropdownItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  button: {
    width: '90%',
    backgroundColor: '#00308F',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 17,
  },
  deleteButton: {
    width: '90%',
    backgroundColor: '#8B0000',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
});
