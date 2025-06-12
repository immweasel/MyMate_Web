
interface IconSet {
    default: string;
    gray: string;
}

interface Icons {
    main: IconSet;
    favourites: IconSet;
    adsNavigation: IconSet;
    chats: IconSet;
    profile: IconSet;
}

const icons: Icons = {
    main: {
        default: require('../../assets/icons/main.svg').default,
        gray: require('../../assets/icons/mainGray.svg').default,
    },
    favourites: {
        default: require('../../assets/icons/favourites.svg').default,
        gray: require('../../assets/icons/favouritesGray.svg').default,
    },
    adsNavigation: {
        default: require('../../assets/icons/adsNavigation.svg').default,
        gray: require('../../assets/icons/adsNavigationGray.svg').default,
    },
    chats: {
        default: require('../../assets/icons/chats.svg').default,
        gray: require('../../assets/icons/chatsGray.svg').default,
    },
    profile: {
        default: require('../../assets/icons/profile.svg').default,
        gray: require('../../assets/icons/profileGray.svg').default,
    },
};

export default icons;
