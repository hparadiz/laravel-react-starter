import 'react-native-gesture-handler';
import { AppRegistry,Platform } from "react-native";
import App from "./App";
import store from "./Data/Redux/store";
import { setSessionData } from './Data/Redux/actions';
import { SessionData } from "./Data/Interfaces/Session"
import { Provider } from 'react-redux'
import Http from './Data/Http';
const app = require('../app.json');

const WrappedApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>);
};

// get session
(async () => {
  if (!['android','ios'].includes(Platform.OS)) { // web
    const session: SessionData = (window as any).sessionData;
    store.dispatch(setSessionData(session));
  } else {  // mobile
    var response = await (new Http()).post('auth/mobile-session');
    if (response.success) {
      store.dispatch(setSessionData(response.session));
    } else {
      console.error(response.error);
    }
  }
})();


AppRegistry.registerComponent(app.name, () => WrappedApp);

if (!['android','ios'].includes(Platform.OS)) {
  AppRegistry.runApplication(app.name, {
    rootTag: document.getElementById("root")
  });
}