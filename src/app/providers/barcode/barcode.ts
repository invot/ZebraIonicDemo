/*
* Copyright (C) 2018 Zebra Technologies Corp
* All rights reserved.
*/

import { Injectable } from '@angular/core';
import { WebIntent } from '@ionic-native/web-intent/ngx';
import { Events } from '@ionic/angular';

@Injectable()
export class BarcodeProvider {

  private requestResultCodes = "false";

  constructor(public events: Events, public webintent: WebIntent) {
    let constructorInstance = this;
    webintent.registerBroadcastReceiver({
      filterActions: [
        'com.zebra.ionicdemo.ACTION',           //  Response from scan (needs to match value in output plugin)
        'com.symbol.datawedge.api.RESULT_ACTION'//  Response from DataWedge service (as defined by API)
      ],
      filterCategories: [
        'android.intent.category.DEFAULT'
      ]
    }).subscribe((intent) => {
        //  Broadcast received
        console.log('Received Intent: ' + JSON.stringify(intent.extras));

        //  Emit a separate event for the result associated with this scan.  This will only be present in response to
        //  API calls which included a SEND_RESULT extra
        if (intent.extras.hasOwnProperty('RESULT_INFO')) {
          let commandResult = intent.extras.RESULT + " (" +
            intent.extras.COMMAND.substring(intent.extras.COMMAND.lastIndexOf('.') + 1, intent.extras.COMMAND.length) + ")";  // + JSON.stringify(intent.extras.RESULT_INFO);
          constructorInstance.events.publish('data:commandResult', commandResult.toLowerCase());
        }

        if (intent.extras.hasOwnProperty('com.symbol.datawedge.api.RESULT_GET_VERSION_INFO')) {
          //  The version has been returned (DW 6.3 or higher).  Includes the DW version along with other subsystem versions e.g MX  
          var versionInfo = intent.extras['com.symbol.datawedge.api.RESULT_GET_VERSION_INFO'];
          console.log('Version Info: ' + JSON.stringify(versionInfo));
          let datawedgeVersion = versionInfo['DATAWEDGE'];
          console.log("Datawedge version: " + datawedgeVersion);

          //  Fire events sequentially so the application can gracefully degrade the functionality available on earlier DW versions
          if (datawedgeVersion >= "6.3")
            constructorInstance.events.publish('status:dw63ApisAvailable', true);
          if (datawedgeVersion >= "6.4")
            constructorInstance.events.publish('status:dw64ApisAvailable', true);
          if (datawedgeVersion >= "6.5")
            constructorInstance.events.publish('status:dw65ApisAvailable', true);
        }
        else if (intent.extras.hasOwnProperty('com.symbol.datawedge.api.RESULT_ENUMERATE_SCANNERS')) {
          //  Return from our request to enumerate the available scanners
          let enumeratedScanners = intent.extras['com.symbol.datawedge.api.RESULT_ENUMERATE_SCANNERS'];
          constructorInstance.events.publish('data:enumeratedScanners', enumeratedScanners);
        }
        else if (intent.extras.hasOwnProperty('com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE')) {
          //  Return from our request to obtain the active profile
          let activeProfile = intent.extras['com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE'];
          constructorInstance.events.publish('data:activeProfile', activeProfile);
        }
        else if (!intent.extras.hasOwnProperty('RESULT_INFO')) {
          //  A barcode has been scanned
          constructorInstance.events.publish('data:scan', intent, new Date().toLocaleTimeString());
        }
      }
    );
  }

  //  Control whether or not to include the SEND_RESULT extra in our commands to request DW send the
  //  result back to us.  Only available in DW6.5+
  requestResult(requestCodes: boolean) {
    this.requestResultCodes = "" + requestCodes;
  }

  //  Send a broadcast intent to the DW service which is present on all Zebra devcies.
  //  This functionality requires DW6.3+ as that is the version where the com.symbol.datawedge.api.ACTION
  //  was introduced.
  //  extraValue may be a String or a Bundle
  sendCommand(extraName: string, extraValue) {
    console.log("Sending Command: " + extraName + ", " + JSON.stringify(extraValue));
    this.webintent.sendBroadcast({
      action: 'com.symbol.datawedge.api.ACTION',
      extras: {
        [extraName]: extraValue,
        "SEND_RESULT": this.requestResultCodes
      }
    }).then(() => {});
  }

}

