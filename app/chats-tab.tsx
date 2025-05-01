// app/chats-tab.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import {
  collection, query, where, onSnapshot, orderBy
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useUserStore } from '@/store/userStore';

export default function ChatsTab() {
  const { user } = useUserStore();
  const [chats, setChats] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const q = query(
      collection(db,'chats'),
      where('participants','array-contains',user.userid.toString()),
      orderBy('lastUpdated','desc')
    );
    return onSnapshot(q, qs => {
      setChats(qs.docs.map(d=>({ id:d.id, ...d.data() })));
    });
  },[]);

  return (
    <View style={{flex:1}}>
      <FlatList
        data={chats}
        keyExtractor={c=>c.id}
        renderItem={({item})=>{
          // display the other party’s name by inspecting participants
          const other = item.participants.find((id:string)=>id!==user.userid.toString());
          return (
            <TouchableOpacity
              style={{padding:15,borderBottomWidth:1,borderColor:'#eee'}}
              onPress={()=>router.push({pathname:'/chat-room',params:{chatId:item.id}})}
            >
              <Text>Chat with {other}</Text>
              <Text style={{color:'#999',fontSize:12}}>
                {item.lastMessage||'No messages yet'}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
