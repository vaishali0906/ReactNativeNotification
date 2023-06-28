import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, View } from 'react-native'; 
import  * as Notification from 'expo-notifications';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { Platform } from 'react-native';

export default function App() {

  useEffect(() =>{
    async function configuraNotification(){
     const { status} = await Notification.getPermissionsAsync();
     let finalStatus = status

     if(finalStatus !== 'granted'){
     const status = await Notification.requestPermissionsAsync();
     finalStatus = status
     }

     console.log(finalStatus)

     if(finalStatus !== 'granted'){
      Alert.alert("Needs Permission", "Need approprite permission to use this app")
      return
     }

     const pushTokenData =  await Notification.getExpoPushTokenAsync()
     console.log("data" +pushTokenData.data)
  

    if(Platform.OS === 'android'){
      Notification.setNotificationChannelAsync('default',{
        name:'default',
        importance: Notification.AndroidNotificationPriority.DEFAULT
      });
    }
    }

    configuraNotification();
  },[])

  useEffect(() => {
    //Called when notification gets visible
    const Subscription1 = Notification.addNotificationReceivedListener((notification) =>{
      console.log(notification)
        })

        //Called when notification is tapped
        const Subscription2 = Notification.addNotificationResponseReceivedListener((response) =>{
          console.log(response)
            })

        return () =>{
          Subscription1.remove()
          Subscription2.remove()
        }
        
  },[])

 
 

  Notification.setNotificationHandler({
    handleNotification: async () =>{
      return {
        shouldPlaySound:false,
        shouldSetBadge:false,
        shouldShowAlert:true
      }
    }
  })
function OnButtonClickHandler(){
  Notification.scheduleNotificationAsync({
    content:{
      title: 'My First local Notification',
      body:"Hello User!! How are you?",
      data:{
        username:'Vaishali'
      }
    },
    trigger:{
      seconds:5
    }
  })
}

function sendPushNotification(){
  fetch('https://exp.host/--/api/v2/push/send',{
    method:'Post',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to:"ExponentPushToken[rzCftHK8gOzR70yWkI6x-2]",
      title:'Hello User',
      body:'Test - send from a device'
    })
  })
}

  return (
    <View style={styles.container}>
      <Button onPress={ OnButtonClickHandler} title='Schedule Notification'/>
      <Button onPress={ sendPushNotification} title='Send Notification'/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
