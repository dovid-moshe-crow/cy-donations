import { type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";

import { MantineProvider, createEmotionCache } from "@mantine/core";
import rtlPlugin from "stylis-plugin-rtl";

const rtlCache = createEmotionCache({
  key: "mantine-rtl",
  stylisPlugins: [rtlPlugin],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      emotionCache={rtlCache}
      theme={{ dir: "rtl" }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
