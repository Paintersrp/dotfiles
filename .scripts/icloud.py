from pyicloud import PyiCloudService
api = PyiCloudService('paintersrp@gmail.com', 'DqwE2!rtQzz')

iphone = api.devices[1]

print(api.drive['Obsidian'])
