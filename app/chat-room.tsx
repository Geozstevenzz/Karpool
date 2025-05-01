// app/chat-room.tsx
import React, { useEffect, useState } from 'react';
import {
  View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  collection, addDoc, orderBy,
  query, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useUserStore } from '@/store/userStore';

export default function ChatRoom() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { user }   = useUserStore();
  const [msgs, setMsgs] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt','asc')
    );
    const unsub = onSnapshot(q, qs => {
      setMsgs(qs.docs.map(d=>({ id:d.id, ...d.data() })));
    });
    return unsub;
  }, [chatId]);

  const send = async () => {
    if(!text.trim())return;
    await addDoc(
      collection(db,'chats',chatId,'messages'),
      {
        text,
        senderId: user.userid.toString(),
        createdAt: serverTimestamp()
      }
    );
    // update parent doc’s lastMessage + lastUpdated
    await addDoc(
      collection(db,'chats',chatId,'__meta__'),{}
    ); // optional, or do updateDoc on chat doc
    setText('');
  };

  return (
    <View style={{flex:1,padding:10}}>
      <FlatList
        data={msgs}
        keyExtractor={item=>item.id}
        renderItem={({item})=>(
          <Text style={{
            alignSelf: item.senderId===user.userid.toString() ? 'flex-end' : 'flex-start',
            margin:5,
            backgroundColor: item.senderId===user.userid.toString() ? '#DCF8C5' : '#FFF',
            padding:8,
            borderRadius:5
          }}>
            {item.text}
          </Text>
        )}
      />
      <View style={{flexDirection:'row'}}>
        <TextInput
          style={{flex:1,borderWidth:1,borderColor:'#ccc',borderRadius:5,padding:8}}
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity onPress={send} style={{marginLeft:5,justifyContent:'center'}}>
          <Text style={{color:'#007AFF'}}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
