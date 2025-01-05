import {BonAppHostedMenu} from '../views/menus/menu-bonapp'

const WeitzMenuView = (): React.JSX.Element => (
	<BonAppHostedMenu
		cafe="weitz"
		loadingMessage={['Engaging in people-watching…', 'Checking the mail…']}
		name="Weitz Center"
	/>
)

export default WeitzMenuView
