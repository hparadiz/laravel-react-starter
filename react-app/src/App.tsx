import React, { Component } from "react";
import { connect } from 'react-redux';
import { setSessionData } from "./Data/Redux/actions";
import { Platform } from "react-native";
import { LoginScreen } from "./Components/Auth/LoginScreen";
import { SplashScreen } from "./Components/Screens/Splash";
import { EventEmitter2 } from 'eventemitter2';

const eventEmitter = new EventEmitter2();
export { eventEmitter };

if (!['android','ios'].includes(Platform.OS)) {
  //require('@tamagui/core/reset.css');
}

import { TamaguiProvider, Theme } from 'tamagui';
import tamaguiConfig from '../tamagui.config';

import StackNavigator from './Components/Navigation/StackContainer';

import { SessionData } from "./Data/Interfaces/Session"

interface AppState {
  showSplash: boolean;
  showLogin: boolean;
  showApp: boolean;
  session: SessionData;
}
interface AppProps {
  sessionData: SessionData;
  setSessionData: (sessionData: SessionData) => void;
}
class App extends Component<AppProps,AppState> {
  constructor(props: AppProps) {
    super(props);

    eventEmitter.on('logoutEvent', this.handleLogoutEvent.bind(this));
    console.log(props.sessionData);
    this.state = {
      showSplash: true,
      showLogin: false,
      showApp: false,
      session: props.sessionData
    };
  }

  splashFadeComplete() {
    this.setState({
      showSplash: false,
      showLogin: this.state.session.UserID !== null ? false : true,
      showApp: this.state.session.UserID !== null ? true : false
    });
  }

  handleLoginEvent(updatedSession: SessionData) {
    this.setState({
      showSplash: false,
      showLogin: false,
      showApp: true,
      session: updatedSession
    });
  }

  handleLogoutEvent(updatedSession: SessionData) {
    this.setState({
      showSplash: true,
      showLogin: false,
      showApp: false,
      session: updatedSession
    });
  }

  render() {
    const { showSplash, showLogin, showApp, session } = this.state;

    return (
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light_blue">
        <Theme name="dark_blue">
          {showSplash ? <SplashScreen onFadeComplete={this.splashFadeComplete.bind(this)} /> : null}
          {showLogin ? <LoginScreen onLoginEvent={this.handleLoginEvent.bind(this)} /> : null}
          {showApp ? <StackNavigator sessionData={session} /> : null}
        </Theme>
      </TamaguiProvider>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  sessionData: state.session
});


export default connect(mapStateToProps, { setSessionData })(App);