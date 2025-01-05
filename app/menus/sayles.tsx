import {BonAppHostedMenu} from '../views/menus/menu-bonapp'

export const SaylesMenuView = (): React.JSX.Element => (
	<BonAppHostedMenu
		cafe="sayles"
		ignoreProvidedMenus={true}
		loadingMessage={['Observing the artwork…', 'Previewing performances…']}
		name="Sayles Hill"
	/>
)

export default SaylesMenuView
