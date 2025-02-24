import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import storeToolkit from "@/features/store";


export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={storeToolkit}>{children}</Provider>;
}
