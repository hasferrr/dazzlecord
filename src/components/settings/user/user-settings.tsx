'use client'

import ButtonSelection from '@/components/settings/button-selection'
import SettingsLayout from '@/components/settings/settings-layout'
import {
  useCloseUserSettingsPage,
  useOpenUserSettingsPage,
  useUserSettingsPageValue,
  useUserSettingsValue,
} from '@/context/settings/user-settings-context'

import Profiles from './profiles'

const UserSettings = () => {
  const userSettingsValue = useUserSettingsValue()
  const userSettingsPageValue = useUserSettingsPageValue()
  const closeUserSettingsPage = useCloseUserSettingsPage()
  const openUserSettingsPage = useOpenUserSettingsPage()

  return (
    <SettingsLayout
      label="USER SETTINGS"
      isSettingsPageOpen={userSettingsPageValue}
      closeSettingsPage={closeUserSettingsPage}
      selectionComponents={
        <ButtonSelection
          title="Profiles"
          onClick={openUserSettingsPage}
          activeCondition={userSettingsValue.profiles}
        />
      }
    >
      <Profiles />
    </SettingsLayout>
  )
}

export default UserSettings
