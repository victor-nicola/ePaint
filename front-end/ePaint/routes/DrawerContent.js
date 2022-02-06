import { DrawerView, DrawerContentScrollView } from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AuthContext } from "../containers/authContext";
import { Avatar, Caption, Drawer, Title } from "react-native-paper";
import { UserContext } from "../containers/userContext";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { EnvContext } from "../containers/envContext";

export function DrawerContent( props ) {
    const { logOut } = React.useContext( AuthContext );
    const { user } = React.useContext( UserContext );
    const { ipString } = React.useContext( EnvContext );

    return (
        <View style = {{flex: 1, backgroundColor: "#3b3b3b"}}>
            <DrawerContentScrollView {...props}>
                <View style = {{flex: 1}}>
                    <View style = {{flexDirection: "row", alignContent: "center"}}>
                        <Avatar.Image style = { styles.AvatarImage } source = {{uri: ipString + "images/" + user.image}} size = {50} />
                        <View>
                            <Title style = {{fontSize: 20, fontWeight: "bold", margin: 5, color: "#fff"}}>{user.name} {user.surname}</Title>
                            <Caption style = {{margin: 5, fontSize: 15, bottom: 5, color: "#fff"}}>@{user.username}</Caption>
                        </View>
                    </View>
                    <Drawer.Section>
                        <Drawer.Item
                        icon = {
                            () => (
                                <AntDesign name = "home" size = {24} color = "#fff"/>
                            )
                        }
                        label = "Home"
                        
                        style = {{borderBottomColor: "#fff"}}
                        onPress = {() => {
                            props.navigation.navigate( "homeScreen" );
                        }}
                        />
                        <Drawer.Item 
                        icon = {
                            () => (
                                <AntDesign name = "user" size = {24} color = "#fff"/>
                            )
                        }
                        label = "User"
                        onPress = {() => {
                            props.navigation.navigate( "userProfile", {searchedUser: user} );
                        }}/>
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section>
                <Drawer.Item 
                icon = {
                    () => (
                        <FontAwesome name = "sign-out" color = "#fff" size = {24}/>                       
                    )
                }
                label = "Sign out"
                onPress = {
                    () => {
                        logOut();
                    }
                }
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    AvatarImage: {
        alignSelf: "center",
        margin: 5
    }
});