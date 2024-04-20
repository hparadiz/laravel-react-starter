import styles from '../../Styles/Sheet';
import { View, Text, ListItem, Button, YStack, SizableText } from 'tamagui';
import PageHeader from './Header';
import Http from '../../Data/Http';
import { eventEmitter } from '../../App';

const AccountScreen = ({ route, navigation }) => {
    const pageData = [{
        pageName: 'Account',
        pageTitle: route.params.title,
        UserID: route.params.session.UserID,
    }];

    const session = route.params.session;

    const logout = async () => {
          var response = await (new Http()).post('auth/logout');
      
          if (response.success) {
            eventEmitter.emit('logoutEvent',response.session);
          } else {
            //setErrorMessage(response.errors.concat("\n"));
          }
    }

    return (
        <View style={styles.container}>
            <PageHeader navigation={navigation} pageData={pageData[0]} />
            <YStack
                borderWidth={1}
                borderRadius="$4"
                backgroundColor="$background"
                borderColor="$borderColor"
                padding="$8"
                >
                <SizableText size="$8" padding="$2">Account Settings</SizableText>
                <SizableText size="$4" padding="$2">Welcome, {session.Individual.first_name}!</SizableText>
                
                <Text fontSize={24} padding="$2">Active Logins</Text>
                <ListItem key="0" padding="$2">
                    Session ID: {session.id}, Type: {session.Type}, Last IP: {session.LastIP}
                </ListItem>
                
                <Button onPress={logout.bind(this)}>Logout</Button>
            </YStack>
        </View>
    )
};

export default AccountScreen;