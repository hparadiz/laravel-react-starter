
import { View } from "react-native";
import { LoginForm } from "./LoginForm";
import styles from "../../Styles/Sheet";

export function LoginScreen(props) {
  var localStyle = Object.assign({}, props.style, styles.splashContainer);
  return (
    <View style={localStyle}>
        <LoginForm onLoginEvent={props.onLoginEvent}></LoginForm>
    </View>
  );
};