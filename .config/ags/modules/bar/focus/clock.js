import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
const { GLib } = imports.gi;

const WEATHER_CACHE_FOLDER = `${GLib.get_user_cache_dir()}/ags/weather`;
Utils.exec(`mkdir -p ${WEATHER_CACHE_FOLDER}`);

const BarGroup = ({ child }) => {
  const emptyArea = Widget.Box({ hexpand: true, });

  return Widget.Box({
    className: 'bar-group-margin bar-sides',
    children: [
      Widget.Box({
        className: 'bar-group-trans bar-group-standalone bar-group-pad-system',
        children: [emptyArea, child],
      }),
    ]
  })
}

const BarClock = () => Widget.Box({
  vpack: 'center',
  className: 'spacing-h-4 bar-clock-box',
  children: [
    Widget.Label({
      className: 'txt-smallie bar-date',
      label: GLib.DateTime.new_now_local().format(userOptions.time.dateFormatLong),
      setup: (self) => self.poll(userOptions.time.dateInterval, (label) => {
        label.label = GLib.DateTime.new_now_local().format(userOptions.time.dateFormatLong);
      }),
    }),
    Widget.Label({
      className: 'txt-norm txt-onLayer1',
      label: '•',
    }),
    Widget.Label({
      className: 'bar-time',
      label: GLib.DateTime.new_now_local().format(userOptions.time.format),
      setup: (self) => self.poll(userOptions.time.interval, label => {
        label.label = GLib.DateTime.new_now_local().format(userOptions.time.format);
      }),
    }),
  ],
});



export default () => Widget.EventBox({
  child: Widget.Box({
    className: 'spacing-h-4 bar-spaceright',
    child: BarGroup({ child: BarClock() }),
  })
});
