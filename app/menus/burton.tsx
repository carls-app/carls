import {BonAppHostedMenu} from '../views/menus/menu-bonapp'

export const BurtonMenuView = (): React.JSX.Element => (
	<BonAppHostedMenu
		cafe="burton"
		ignoreProvidedMenus={true}
		loadingMessage={['Searching for Schiller…']}
		name="Burton"
	/>
)

export default BurtonMenuView
