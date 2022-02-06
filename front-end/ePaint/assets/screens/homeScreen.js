import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOp, TouchableOpacity, Image } from "react-native";

/*const Item = ( {post, onPress} ) => {
    const { ipString } = useContext( EnvContext );
    
    //console.log( post );

    return (
        <TouchableOpacity style = {styles.LogoBanner} onPress = {onPress}>
            <View style = {{flexDirection: "row", alignContent: "center"}}>
                <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + user.image}} size = {25} />
                <View>
                    <Caption style = {{margin: 5, fontSize: 15, bottom: 5}}>@{user.username}</Caption>
                </View>
            </View>
        </TouchableOpacity>
    );
};*/

export default function homeScreen( {navigation} ) {
    return (
        <View style = {styles.View}>
            <View style = {styles.LogoBanner} >
                <Image style = { { width: 50, height: 50, alignSelf: "center" } } source = {require("../app-logo.png")}/>
                <TouchableOpacity style = {styles.SearchBtn} onPress = {() => {navigation.navigate( "searchScreen" )}}>
                    <AntDesign style = {{margin: 5}} name = "search1" size = { 24 } color = "#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    View: {
        flex: 1,
        //justifyContent: "center",
        //alignItems: "center"
        backgroundColor: "#3b3b3b"
    },
    Text: {
        fontSize: 20
    },
    SelectImage: {
        //width: "60%",
        borderRadius: 30,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#3b3b3b",
        margin: 5
    },
    LogoBanner: {
        flexDirection: "row",
        marginTop: 60,
        backgroundColor: "#3b3b3b"
    },
    SearchBtn: {
        alignSelf: "center",
        position: "absolute",
        right: 0,
        backgroundColor: "#3b3b3b",
        borderRadius: 100,
        margin: 5
    }
});