import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/features/store';
import {getPayloadFromToken} from '@/services/SecureStore';
import {IUserPayloadOptions, login, logout} from "@/features/auth/authSlice";
import { useRouter } from 'expo-router';
import {Route} from "@/shared/types";



export function KeyStoreProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    getPayloadFromToken().then((payload) => {
      if (payload) {
        const { version, sessionId, ...user }: IUserPayloadOptions = payload;
        dispatch(login(user));
        router.push(Route.Home);
      } else {
        dispatch(logout({}));
        router.push(Route.Home);
      }
    }).catch((error) => {
      dispatch(logout({}));
      //router.push(Route.SignIn);
    })
  }, [dispatch, router]);

  return <>{children}</>;
}
