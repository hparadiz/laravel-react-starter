import { useEffect, useRef, useState, CSSProperties } from 'react';
import { Text, Button, AnimatePresence, Image, XStack, YStack, Separator } from 'tamagui';
import { Menu } from '@tamagui/lucide-icons';
import pageList from './pageList';
import styles from '../../Styles/Sheet';

const MenuContainer = ({ navigation, pageName }) => {
    // DISPLAY LOGO TOP OF MENU
    const logo = require('../../../resources/logo.png');

    // PULL ALL PAGE LINKS IN MENU
    const pages = pageList;

    // SET STATE AND TARGET FOR MENU VISABILITY
    const [isVisible, setIsVisible] = useState(false);
    const top = useRef<any>(null);

    // EVENT HANDLER FOR MENU CLOSE ON OUTSIDE CLICK
    useEffect(() => {
        const handleClickEvent = (event) => {
            if (top.current && !top.current.contains(event.target)) {
                setIsVisible(false);
            }
        }

        document.addEventListener('click', handleClickEvent);
        
        return () => {
            document.removeEventListener('click', handleClickEvent);
        };
    }, [isVisible]);

    // MENU BUTTON HOVER AFFECT CONTROL
    // const useHover = (styleOnHover: CSSProperties, styleOnNotHover: CSSProperties = {}) => {
    //     const [style, setBtnHoverStyle] = useState(styleOnNotHover);
        
    //     const onMouseEnter = () => setBtnHoverStyle(styleOnHover);
    //     const onMouseLeave = () => setBtnHoverStyle(styleOnNotHover);
        
    //     return { style, onMouseEnter, onMouseLeave }
    // };

    // const hover = useHover({ backgroundColor: 'red' });

    return (
        
        <XStack ref={top} backgroundColor={'transparent'}>

            {/* MENU BUTTON */}
            <YStack>
                <Button style={ styles.menuButton } icon={<Menu size={'$2'} />} onPress={() => { setIsVisible(!isVisible) }}></Button>
            </YStack>

            {/* MENU BODY */}
            <AnimatePresence>
                {isVisible && (
                    <YStack
                        style={ styles.menuContainer }
                        enterStyle={{ x: -50, opacity: 0 }}
                        exitStyle={{ x: -50, opacity: 0  }}
                        animation={[ 'medium', { opacity: { overshootClamping: true, },},]}
                    >

                        {/* MAIN MENU */}

                        <XStack style={ styles.mainMenu }>
                            <YStack width={'100%'}>

                                {/* MENU HEADER */}
                                <XStack style={ styles.menuHeader }>
                                    <YStack style={ styles.menuHeaderLogoContainer } >
                                        <Image source={{width: 50, height: 50, uri: logo }} style={ styles.menuHaderLogoImage } />
                                    </YStack>
                                    
                                    <YStack style={ styles.menuHeaderTitle }>
                                        <Text>Skeleton Application</Text>
                                    </YStack>
                                </XStack>

                                {/* MENU ITEMS */}
                                <XStack style={ styles.menuItems }>
                                    
                                    { 
                                        pages.map((page, idx) => pageName != page.name ? 
                                            page.name == 'Seperator' ? 
                                            <Separator key={idx} alignSelf="stretch" marginVertical={25} backgroundColor={'$blue11Light'} height={5} /> :
                                            <YStack key={page.name}>
                                                <Button 
                                                    backgroundColor={'$colorTransparent'}
                                                    hoverStyle={ styles.menuItemButtonHover }
                                                    style={ styles.menuItemButton }
                                                    icon={ <page.icon size={'$2'} />} 
                                                    onPress={() => { setIsVisible(!isVisible), setTimeout(() => { navigation.navigate(page.route) }, 500)  }}>
                                                    {page.name}
                                                </Button>
                                            </YStack> : null) 
                                    }
                                    
                                </XStack>

                            </YStack>
                        </XStack>
                    </YStack>
                )}
            </AnimatePresence>
        </XStack>
    );
}

export default MenuContainer;