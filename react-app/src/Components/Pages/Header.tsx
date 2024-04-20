import { Text, XStack, YStack } from 'tamagui';
import styles from '../../Styles/Sheet';
import MenuContainer from '../Navigation/MenuContainer';

const PageHeader = ({ navigation, pageData }) => {
    return (
        <XStack style={ styles.pageHeader }>
            <YStack flex={1}>
                <MenuContainer navigation={navigation} pageName={pageData.pageName} />                
            </YStack>

            <YStack flex={1}>
                <Text style={ styles.appTitle }>Starter Application</Text>
                <Text style={ styles.pageTitle }>{ pageData.pageTitle }</Text>
            </YStack>

            <YStack flex={1}>
                <Text style={ styles.userName }>User Id: { pageData.UserID }</Text>
            </YStack>
        </XStack>
    )
};

export default PageHeader;