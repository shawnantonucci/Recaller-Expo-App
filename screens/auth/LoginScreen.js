import React from "react";

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  AsyncStorage
} from "react-native";
import * as firebase from "firebase";
import { AuthSession, GoogleSignIn } from "expo";
import TestScreen from "../TestScreen";

const GOOGLE_APP_ID =
  "448806748779-mldp0sim81htt9oapau99r1647m26278.apps.googleusercontent.com";

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: "Please sign in"
  };
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      result: null,
      errorCode: null,
      user: null
    };
  }

  componentDidMount() {
    this.initAsync();
  }

  initAsync = async () => {
    await GoogleSignIn.initAsync({
      clientId: GOOGLE_APP_ID
    });
    this._syncUserWithStateAsync();
  };

  _syncUserWithStateAsync = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync();
    console.log(user, "Google Signin")
    this.setState({ user });
  };

  signInAsync = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === "success") {
        this._syncUserWithStateAsync();
        console.log("Signin success");
      }
    } catch ({ message }) {
      alert("login: Error:" + message);
    }
  };

  onPress = () => {
    if (this.state.user) {
      this.signOutAsync();
    } else {
      this.signInAsync();
    }
  };

  _handlePressAsync = async () => {
    let redirectUrl = AuthSession.getRedirectUrl();
    let result = await AuthSession.startAsync({
      authUrl:
        `https://accounts.google.com/o/oauth2/v2/auth?response_type=token` +
        `&client_id=${GOOGLE_APP_ID}` +
        `&prompt=login` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
        `&scope=profile`
    });
    // console.log(result);
    const { type, errorCode = "You cancel or dismissed the login" } = result;

    if (type === "success") {
      // Just simple way to store the token in this examples
      console.log(result, "Google temp")
      this.setState({ result });
      // console.log(result)
    } else {
      /**
       * Result types can be: cancel, dismissed or error (with errorCode)
       */
      this.setState({ errorCode });
    }
  };

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate("TestScreen");
      } else {
        this.props.navigation.navigate("LoginScreen");
      }
    });
  };

  onLoginPress = async () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {})
      .catch(error => {
        Alert.alert(error.message);
      });

  };

  onCreateAccountPress = () => {
    this.props.navigation.navigate("Signup");
  };

  onForgotPasswordPress = () => {
    this.props.navigation.navigate("ForgotPassword");
  };

  render() {
    const { errorCode } = this.state;
    if (this.state.user || this.state.result !== null) {
      console.log("Authenticated!");
      return <TestScreen />;
    }
    return (
      <View style={{ paddingTop: 30, alignItems: "center" }}>
        <Text>Login</Text>

        <TextInput
          style={{ width: 200, height: 40, borderWidth: 1 }}
          value={this.state.email}
          onChangeText={text => {
            this.setState({ email: text });
          }}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={{ paddingTop: 10 }} />

        <TextInput
          style={{ width: 200, height: 40, borderWidth: 1 }}
          value={this.state.password}
          onChangeText={text => {
            this.setState({ password: text });
          }}
          placeholder="Password"
          secureTextEntry={true}
        />
        <View style={{ paddingTop: 10 }} />

        <Button title="Login" onPress={this.onLoginPress} />

        <View style={{ paddingTop: 10 }} />

        <Button title="Sign in Google Deploy Only" onPress={this.onPress} />
        {errorCode ? <Text>{errorCode}</Text> : null}
        <Button title="Sign in Google" onPress={this._handlePressAsync} />
        {errorCode ? <Text>{errorCode}</Text> : null}

        <View style={{ paddingTop: 10 }} />

        <Button title="Create Account" onPress={this.onCreateAccountPress} />

        <View style={{ paddingTop: 10 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
