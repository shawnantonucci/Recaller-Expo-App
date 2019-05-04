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
import { db } from "../constants/ApiKeys";
import * as firebase from "firebase";

import { TestComponent } from "./../components/AppComponents";

const GOOGLE_APP_ID =
  "448806748779-mldp0sim81htt9oapau99r1647m26278.apps.googleusercontent.com";

export default class TestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
    // console.log(this.state.user);
  }
  updateUser = async () => {
    var user = firebase.auth().currentUser;
    let name, email, photoUrl, uid, emailVerified;

    if (user) {
      displayName = user.displayName;
      email = user.email;
      phoneNumber = user.phoneNumber;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
    }

    console.log(user);
    if (this.state.user != null) {
      const {
        displayName,
        email,
        photoUrl,
        phoneNumber,
        uid,
        emailVerified
      } = user;

      console.log(displayName, "From user");
      // User is signed in.

      data = {
        displayName: "joe"
      };

      var userRef = db.collection("users").doc(uid);

      var updateSingle = userRef.set(data, { merge: true });
    }
  };

  logout = () => {
    auth().signOut();
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
    // this.setState({ user: null });
  };

  render() {
    var user = firebase.auth().currentUser;
    let displayName, email, phoneNumber, photoUrl, uid, emailVerified;
    displayName = user.displayName;
    email = user.email;
    phoneNumber = user.phoneNumber;
    photoUrl = user.photoURL;
    emailVerified = user.emailVerified;
    uid = user.uid;
    console.log(user);

    return (
      <View style={{ paddingTop: 20 }}>
        <Text>{displayName}</Text>
        <Text>{phoneNumber}</Text>
        <Text>{email}</Text>
        <TestComponent />

        {/* <Button title="Signout" onPress={this.onSignoutPress} /> */}
        <Button title="Signout" onPress={this.signOutAsync} />
        <Button title="Signout test" onPress={this.logout} />
        <Button title="Update User" onPress={this.updateUser} />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
