
const userConfigOptions = {

  'keybinds': {
    'sidebar': {
      'pin': "Ctrl+p",
      'nextTab': "Ctrl+Page_Down",
      'prevTab': "Ctrl+Page_Up",
    },
  },
  'appearance': {
    'fakeScreenRounding': false,
  },
  'apps': {
    'terminal': 'alacritty',
  },
  'music': {
    'preferredPlayer': "ncmcppp",
  },
  'dock': {
    'enabled': false,
  },
  'time': {
    // See https://docs.gtk.org/glib/method.DateTime.format.html
    // Here's the 12h format: "%I:%M%P"
    // For seconds, add "%S" and set interval to 1000
    'format': "%H:%M:%S",
    'interval': 1000,
    'dateFormatLong': "%A, %B %d %Y", // On bar
    'dateInterval': 5000,
    'dateFormat': "%d/%m", // On notif time
  },

}

export default userConfigOptions;
