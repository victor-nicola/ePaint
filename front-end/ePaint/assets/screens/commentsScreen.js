import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput, Touchable, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnvContext } from "../../containers/envContext";
import { Avatar, Caption, Text, Title } from "react-native-paper";

const Item = ( {elem} ) => {
    const { ipString } = useContext( EnvContext );

    return (
            <View style = {{flexDirection: "row", backgroundColor: "#fff", flexDirection: "row", alignContent: "center"}}>
                <View>
                    <Caption style = {{margin: 5, fontSize: 15, bottom: 5, color: "#fff"}}>{elem.comment.caption}</Caption>
                </View>
            </View>
    );
};

export default function commentsScreen( {navigation, route: {params}} ) {
    const { ipString } = useContext( EnvContext );
    const [data, setData] = useState([]);
    const {post} = params;

    const getComments = async() => {
        var token = await AsyncStorage.getItem( "userToken" );
    
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( {token: token, post: post} )
        };
    
        await fetch( ipString + "api/user/getComments", options )
        .then((res) => res.json())
        .then((res) => setData(res));
    };

    useEffect( () => {
        setData( [] );
        getComments();
    },[]);

    const renderItem = ( {item} ) => {
        return (
            <Item onPress = {() => onPress()} elem = {item} />
        );
    };

    return (
        <View style = {{flex: 1, backgroundColor: "#3b3b3b"}} >
            <View style = {styles.LogoBannerView}></View>
            <FlatList 
                data = {data}
                renderItem = {renderItem}
                keyExtractor = {item => item.comment._id}
                extraData = {data}
                scrollEnabled = {true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    TextInputContainer: {
        // flex: 1,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "#000",
        height: 50,
        width: '85%',
        margin: 5,
        justifyContent: "center"
    },
    TextInput: {
        height: 50,
        //flex: 1,
        padding: 10,
        //margin: 5,
        width: "80%",
        color: "#fff"
        //margin: 10
    },
    LogoBanner: {
        flexDirection: "row",
        //marginTop: 60,
        backgroundColor: "#3b3b3b"
    },
    LogoBannerView: {
        paddingTop: 15,
        flexDirection: "row",
        marginTop: 30,
        backgroundColor: "#3b3b3b"
    },
    AvatarImage: {
        alignSelf: "center",
        margin: 5
    },
    BackBtn: {
        alignSelf: "center",
        //position: "absolute",
        //right: 0,
        //backgroundColor: "#fff",
        borderRadius: 100,
        margin: 5
    }
});