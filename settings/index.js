function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Route Settings</Text>}>
          <TextInput
            label="preferred route"
            placeholder="Route Number"
            settingsKey="route"
          />
          <Toggle
              settingsKey="show_expired_times"
              label="Show Expired Leaves Times"
            />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);