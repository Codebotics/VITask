/**
 * @format
 */
import * as React from 'react';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import {name as appName} from './app.json';
import App from './App';
import {Provider} from 'react-redux'
import configureStore from "./actions/types";

const store = configureStore()

export default function Main() {
  return (
    <Provider store={store}>
    <PaperProvider>
      <App />
    </PaperProvider>
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
