"use client";
import store  from "./Store/appStore";

import { Provider } from "react-redux";

export default function ProviderWrapper({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
