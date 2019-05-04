import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button
} from "react-native";
import { AuthSession, GoogleSignIn } from "expo";
import { firebaseAuth, db } from "../constants/ApiKeys";
import { TestComponent } from "./../components/AppComponents";

const GOOGLE_APP_ID =
  "448806748779-mldp0sim81htt9oapau99r1647m26278.apps.googleusercontent.com";


export default class TestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }
  logout = () => {
    firebaseAuth().signOut();
    // this.setState({ user: null });
    // navigate('/');
  };
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
    this.setState({ user });
  };

  signOutAsync = async () => {
    await GoogleSignIn.signOutAsync();
    this.setState({ user: null });
  };

  render() {
    if (this.state.user !== null) {
      return (
        <View>
          <Text>Logged Out</Text>
        </View>
      );
    }

    return (
      <View style={{ paddingTop: 20 }}>
        <Text>Hello</Text>
        <TestComponent />

        {/* <Button title="Signout" onPress={this.onSignoutPress} /> */}
        <Button title="Signout" onPress={this.signOutAsync} />
        <Button title="Signout test" onPress={this.logout} />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
