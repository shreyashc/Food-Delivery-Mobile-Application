import * as React from "react";
import { useContext, useState } from "react";
import { StyleSheet, ImageBackground, Pressable,TouchableOpacity} from "react-native";
import { Input,Icon,Button,Text  } from 'react-native-elements';
import { SafeAreaView } from "react-native-safe-area-context";


import { View } from "../components/Themed";
import { AppContext } from "../Providers/contexts";

export default function LoginScreen() {
    const {appState,setAppState} = useContext(AppContext);
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
        blurRadius = {3}
        style = {styles.img}
        source={require('../assets/images/heroimg.jpg')}>
        <Text style={styles.heroText}>Foodzy</Text>
        <Input
            style={styles.inputText}
            placeholder="Email"
            onChangeText = {setEmail}
            placeholderTextColor="#fff"
            leftIcon={ 
                <Icon style={styles.inputIcon}
                name='email'
                color='#fff'
            />
            }
        /> 
        <Input
            style={styles.inputText}
            placeholder="Password"
            onChangeText = {setPassword}
            placeholderTextColor="#fff"
            secureTextEntry={true}
            leftIcon={ 
                <Icon style={styles.inputIcon}
                name='lock'
                color='#fff'
            />
            }
        /> 
            <Pressable 
              style = {styles.button}
              onPress={()=>setAppState({isAuth:true})}>
                <Text style={styles.btnText}>Login</Text>
              </Pressable>
              <TouchableOpacity >
                  <Text style = {styles.linkText}>
                      Don't have an account yet? SignUp now!
                  </Text>
              </TouchableOpacity>
        </ImageBackground>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  inputText: {
    color:"#fff",
    marginLeft:6,
  },
  inputIcon: {

  },
  btnText:{
    color: "#fff",
    fontSize:20,
    fontWeight:"700",
  },
  button :{
    color:"#fff",
    alignItems: "center",
    padding : 10,
    margin:10,
    borderRadius:5,
    backgroundColor: "#FFA500"
  },
  img: {
    flex:1,
    resizeMode: "cover",
    // justifyContent: "center",
  },
  heroText: {
    fontSize:80,
    color: "#fff",
    fontWeight: "900",
    textAlign: "center", 
    marginTop:100,
    marginBottom:50,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: {width: -2, height: 3},
    textShadowRadius: 20
  },
  linkText:{
    textAlign: "center",
    color:"#fff"
  },

});
