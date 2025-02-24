import React, { createContext, useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { PushNotificationContext, PushNotificationPressContext, PushNotificationReceivedContext } from '@/providers/PushNofiticationContext';
import storeToolkit from '@/features/store';

const getDataFromNotification = (notification: Notifications.Notification) => {
  let data: any;
  const content = notification.request.content as unknown as { data?: any; dataString: string };
  if (content.data) {
    data = content.data;
  }
  if (typeof content.dataString == 'string') {
    data = JSON.parse(content.dataString) as { dialogId: string };
  }
  return data;
};
Notifications.setNotificationHandler({
  handleNotification: async (notification: Notifications.Notification) => {
    const activeChatId = storeToolkit.getState().dialog.activeId;
    let data: { dialogId: string } = getDataFromNotification(notification);
    const dialogId = data.dialogId;

    if (activeChatId && dialogId && dialogId === activeChatId) {
      return {
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
      };
    }
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log('pushTokenString', pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

export function PushNotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const [notificationPress, setPressNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const [token, setToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setToken(token ?? ''))
      .catch((error: any) => {
        console.log('error', error);
      });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(getDataFromNotification(notification));
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      setPressNotification(getDataFromNotification(response.notification));
    });

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <PushNotificationContext.Provider value={token}>
      <PushNotificationReceivedContext.Provider value={notification}>
        <PushNotificationPressContext.Provider value={notificationPress}>{children}</PushNotificationPressContext.Provider>
      </PushNotificationReceivedContext.Provider>
    </PushNotificationContext.Provider>
  );
}
