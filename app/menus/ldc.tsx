import {BonAppHostedMenu} from '../views/menus/menu-bonapp'

export const LDCMenuView = (): React.JSX.Element => (
    <BonAppHostedMenu
        cafe="ldc"
        ignoreProvidedMenus={true}
        loadingMessage={['Tracking down empty seats…']}
        name="LDC"
    />
)

export default LDCMenuView
