# Zebra Ionic Demo
This project is an updated version of Zebra Ionic Demo App for Ionic v4. This repo is not offically supported by Zebra. 

![Application](https://raw.githubusercontent.com/Zebra/ZebraIonicDemo/master/screenshots/application01.png)

##  License
This project is protected by Zebra's EULA, as detailed in the [License.md](./License.md) file

##  Restrictions

Note that this application will only work on Zebra mobile computers, running on non-Zebra devices will give you the following warning:

![Non Zebra warning message](https://raw.githubusercontent.com/Zebra/ZebraIonicDemo/master/screenshots/consumer_warning.png)


##  Building
To build this application:
- [Install Ionic](https://ionicframework.com/docs/v1/guide/installation.html)
- `git clone https://github.com/Zebra/ZebraIonicDemo.git`
- `cd ZebraIonicDemo`
- `npm install`
- Connect Zebra device to adb
- `ionic cordova run android --device`

##   DataWedge
This application is designed to use DataWedge.  DataWedge is only available on Zebra mobile computing devices and provides access to the device hardware scanner(s) including the laser imager, attached Bluetooth scanners and camera imager; **it is not a software scanning library**.

##   Setup
Any Zebra mobile computer running Android which supports Datawedge should work with this sample but the complexity of setup will depend 

---
If your device is running Datawedge 6.4 or higher you will see no warning messages and can safely skip this step
---
You will see this message if you are running a version of Datawedge prior to 6.3:

![Pre-6.3 warning message](https://raw.githubusercontent.com/Zebra/ZebraIonicDemo/master/screenshots/pre-6.3_message.png)

And this message if you are running Datawedge 6.3:

![6.3 warning message](https://raw.githubusercontent.com/Zebra/ZebraIonicDemo/master/screenshots/6.3_message.png)

In either case, ensure you have a Datawedge profile on the device.  You can do this by:
- Launching the Datawedge application
- (Prior to 6.3 only) Select Menu --> New Profile and name the profile `ZebraIonicDemo`
- Configure the ZebraIonicDemo profile to 
  - Associate the profile with com.zebra.zebraionicdemo, with * Activities
  - Configure the intent output plugin to send broadcast intents to `com.zebra.ionicdemo.ACTION`
  
![Profile configuration 1](https://raw.githubusercontent.com/Zebra/ZebraIonicDemo/master/screenshots/profile_activities.png)

![Profile configuration 2](https://raw.githubusercontent.com/Zebra/ZebraIonicDemo/master/screenshots/profile_output.png)

### Older Devices
- Devices branded as 'Motorola Solutions' (identifyable by the Motorola logo) will need to use a recent version of this demo app as earlier versions did not detect this manufacturer.  Motorola Solutions is one of the ancestor companies which now make up Zebra Technologies.  
- Jellybean devices will not run with the latest version of Ionic.  Some users have reported success by using the crosswalk rendering engine but since crosswalk is no longer maintained and recent forum posts report incompatibility with the Android 28 support libraries, users targeting Jellybean devices may wish to seek an alternative solution.

##  Use

There are two sections to the UI, at the top you can configure scanning attributes such as choosing the supported decoders.  Note that some configuration features will require a minimum version of Datawedge.  You can initiate a soft trigger scan using the floating action button.

**ALL** versions of Datawedge support scanning barcodes. 

##  Dependencies

In order to interact with the Datawedge service on Zebra devices this application relies on a 3rd party component to provide the Android Intent interface.  Please be sure to add the [Cordova plugin intent](https://www.npmjs.com/package/com-darryncampbell-cordova-plugin-intent) package to your application if you are using this code as a template for your own application:

`ionic cordova plugin add com-darryncampbell-cordova-plugin-intent`
