
/*eslint-env es6 */
<template>
  <v-container grid-list-xl text-xs-center>
    <v-layout align-center column fill-height mt-3>
      <section v-if="!startScan && !scanned">
        <v-flex xs12>
          <!-- <v-alert :value="true" type="warning" outline> -->
          <span class="display-1">This device requires an owner before it can be used.</span>
          <!-- </v-alert> -->
        </v-flex>
        <v-flex xs12 sm12>
          <v-btn
            class="mb-4"
            :disabled="!systemready"
            block
            primary
            color="primary"
            @click="fireUpScanner"
          >Clock In</v-btn>
          <span class="mt-2 subheading">
            By clocking in with this device you agree that it is now under your
            care according to our
          </span>
          <hr>
        </v-flex>
      </section>
      <v-layout v-if="scanned && !agreed" mt-3>
        <v-card flat>
          <!-- <v-card-title color="primary"> -->
          <b>Please sign</b>
          <v-flex mx-3>
            <VueSignaturePad
              id="signature"
              width="100%"
              height="100px"
              ref="signaturePad"
              required
              :options="{ onEnd }"
            />
          </v-flex>
          <!-- </v-card-title> -->
          <v-card-text class="caption">
            By clocking in with this device you agree that it is now under your
            care according to our
            <router-link :to="{ name: 'terms' }">employee handbook</router-link>.
          </v-card-text>
          <v-flex xs12 sm6 mx-5>
            <v-btn block color="primary" @click="agree">Agree</v-btn>
          </v-flex>
        </v-card>
      </v-layout>
      <v-dialog v-model="clockOut" max-width="290">
        <v-card>
          <v-card-title class="headline">Already clocked in.</v-card-title>
          <v-card-text>
            You will need to clock out from another device first in order to
            clock in on this one.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click="clockUserOut">Clock out</v-btn>
            <v-btn color="green darken-1" flat="flat" @click="goHome">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn block color="primary" @click="agree">deev Agree</v-btn>
    </v-layout>
  </v-container>
</template>
<script>
import VueSignaturePad from "vue-signature-pad";
import * as Database from "../database/Database";
import moment from "moment";
// import { mapGetters, mapActions } from 'vuex'
// import dialogs from "./dialogs";
// import bus from '../../helper-bus'
// import spinner from '../spinner.vue'
// import { $auth } from '@helper'
import { filter, first, map, debounce, startWith } from "rxjs/operators";
import { timer } from "rxjs";
export default {
  data() {
    return {
      result: {},
      loading: true,
      fbLoading: false,
      error: "",
      andrews_logo: "@assets/images/logo.png",
      hasScroll: false,
      isUnderstood: true,
      dontShowAgain: false,
      isShowLogin: false,
      clockOut: false,
      username: null,
      startScan: false,
      agreed: false,
      showNotRegistered: false,
      // registered: $auth.checkSession(),
      accept: false,
      scanned: false,
      items: [],
      systemready: true,
      select: false,
      userList: [],
      checkboxId: false,
      bytes: null
    };
  },

  methods: {
    onEnd() {
      this.bytes = VueSignaturePad.data().signatureData.src;
      // this.signed = true;
    },
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    goHome() {
      // this.clockOut = false;
      this.router.push({ name: "home" });
      // router.rememberBack();
      console.log("going home");
    },
    clockUserOut() {
      this.clockOut = false;
      this.logout();
      // location.reload();
      // router.push({ name: "login" });
    },
    fireUpScanner() {
      var that = this;
      this.startScan = true;
      if (this.isMobile) {
        window.cordova.plugins.barcodeScanner.scan(
          function(result) {
            console.log(result.name);
            console.log(result.password);
            if (_result) {
              that.result = _result;
              this.scanned = true;
              this.startScan = false;
              // that.login(result);
            } else {
              that.error = "bad scan";
              dialogs.message("Bad scan", {
                duration: 8,
                estado: "error"
              });
            }
          },
          function(error) {
            this.error = "bad";
            dialogs.message(error.message, {
              duration: 8,
              estado: "error"
            });
          },
          {
            preferFrontCamera: false, // iOS and Android
            showFlipCameraButton: true, // iOS and Android
            showTorchButton: true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt: "Place your badge inside the scan area", // Android
            resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats:
              "DATA_MATRIX,UPC_A,UPC_E,EAN_8,EAN_13,CODE_39,CODE_93,CODE_128,CODABAR,ITF,RSS14,PDF_417,RSS_EXPANDED,MSI,AZTEC", // default: all but PDF_417 and RSS_EXPANDED
            orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations: true, // iOS
            disableSuccessBeep: false // iOS and Android
          }
        );
      } else {
        // this.scanned = true;
        console.log("browser");
        var _result = {
          id: "1444044",
          employeeId: "Z3o1zDDS"
        };
        this.result = _result;

        this.scanned = true;
        this.startScan = false;
        // this.login(result);
      }
    },
    agree() {
      this.agreed = true;
      if (this.registered != "badDevice") {
        this.login();
      } else {
        this.showNotRegistered == true;
      }
    },
    logout(result) {
      if (process.env.NODE_ENV == "development") {
        result = {
          humanityId: "1444044",
          employeeId: "Z3o1zDDS"
        };
      }
      this.doClockOut(result).then(
        data => {
          this.clockOut = false;
          location.reload();
        },
        error => {
          console.log(error);
          if (error.status == "13") {
            dialogs.message("You were not clocked out.", {
              duration: 8,
              estado: "error"
            });
          }
          this.scanned = false;
          this.clockOut = true;
          if (error) {
            this.error = error.error;
          }
          this.loading = false;
        }
      );
    },
    async login(result) {
      if (process.env.NODE_ENV == "development") {
        result = {
          humanityId: "1444044",
          employeeId: "Z3o1zDDS"
        };
      }
      const db = Database.get();
      db.timesheets
        .findOne()
        .where("humanityId")
        .eq(result.humanityId)
        .where("status")
        .lt(10)
        .exec()
        .then(doc => console.dir(doc));
      if (doc) {
        dialogs.message("You were not clocked out.", {
          duration: 8,
          estado: "error"
        });
        this.scanned = false;
        this.clockOut = true;
        if (error) {
          this.error = error.error;
        }
        this.loading = false;
      } else {
        let now = new Moment();
        db.timesheets.insert({
          name: result.employeeId,
          humanityId: result.humanityId,
          startTime: now,
          status: 1,
          deviceId: this.$deviceId
        });
        db.employees
          .findOne()
          .where("employeeId")
          .eq(result.employeeId)
          .exec()
          .then(doc => {
            doc.update({
              $set: {
                clockedIn: true // sets firstName to foobar
              },
              $set: {
                currentDeviceId: this.$deviceId // sets firstName to foobar
              }
            });
          });
        this.$router.push("/profile:" + result.employeeId);
      }
      // this.timesheets
      //   .find({ humanityId: { $eq: result.humanityId } })
      //   .exec()
      //   .then(documents => console.dir(documents));

      // if (!ts) {
      //   const doc = await this.timesheets.insert({
      //     humanityId: result.humanityId,
      //     startTime: new moment()
      //   });
      // }
      // console.log(ts);
    },
    onClearClick() {
      this.router.back();
    },
    editTimesheet(timeSheet) {
      this.$emit("edit", timeSheet);
    }
  },
  subscriptions() {
    const db = Database.get();
    return {
      timesheets: db.timesheets.find().$
    };
  },
  async mounted() {
    const db = Database.get();
    this.loading = await db.timesheets
      .find()
      .$.pipe(
        debounce(() => timer(1000)),
        map(() => false),
        first()
      )
      .toPromise();
  },
  beforeDestroy() {}
};
</script>
<style>
/* .login {
  background-color: blue;
} */
#signature {
  border: double 1px transparent;
  border-radius: 3px;
  background-image: linear-gradient(white, white),
    radial-gradient(circle at top left, black, black);
  background-origin: border-box;
  background-clip: content-box, border-box;
}

.app-container {
  min-height: 100vh;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.banner {
  height: 130px;
  text-align: center;
  font-size: 20px;
  display: block;
  text-align: center;
  color: #3fba84;
  background-color: #31475d;
}
.fb-terms {
  color: #eee;
}

.facebook-box {
  margin-top: 0.5em !important;
}

.password-not {
  text-align: center;
  margin-top: 16px;
  display: block;
  text-align: center;
  color: #ddd;
  font-weight: bold;
  text-decoration: underline;
  padding-left: 10px;
}

label {
  margin-top: 0.3em;
  font-weight: bold;
}

.login-forget {
  font-weight: bold;
  padding-left: 12px;
  color: #016587;
}

.user-form .btn-primary.btn-facebook {
  width: 90%;
  margin: 1em auto;
}

.description {
  font-size: 11px;
  text-transform: none;
  color: #fff;
  display: block;
}

.btn-facebook.btn-with-icon--icon {
  background-color: var(--button-facebook-blue-left);
}

.register {
  /* font-weight: 300; */
  font-size: 14px;
  display: block;
  padding: 1.4em 0;
  position: relative;
  display: inline-block;
}

.register::before {
  position: absolute;
  /* border-top: solid 1px #2793ff; */
  width: 90%;
  margin-left: 5%;
  content: " ";
  top: 0;
  left: 0;
}

.register::after {
  position: absolute;
  border-bottom: solid 1px #2793ff;
  width: 90%;
  margin-left: 5%;
  content: " ";
  bottom: 0;
  left: 0;
}

.alert-warning a {
  color: #337ab7;
}

.register {
  color: #ccc;
}

.alert-warning {
  position: fixed;
  top: 0;
  left: 0;
  width: 94%;
  margin: 10vh 3%;
  height: 80vh;
  z-index: 100;
}

@media only screen and (min-width: 768px) {
  .login-box {
    margin-right: 0;
  }
  .alert-warning {
    position: static;
    width: auto;
    height: auto;
    margin: auto;
    margin-bottom: 1em;
  }
  .register {
    color: #555;
  }
  .description {
    display: inline;
    padding-left: 0.4em;
    color: rgb(1, 101, 135);
  }
  .visual-trick {
    border-right: solid 1px #ccc;
    padding-right: 4rem;
  }
  .form > div:last-child {
    padding-left: 4em;
  }
  .user-form .btn-primary.btn-facebook {
    width: 100%;
    max-width: 280px;
    margin: 1.6em 0 0.6em 0;
  }
  .register {
    display: inline;
    margin-bottom: 2em;
    font-weight: 400;
  }
  .register::before {
    display: none;
  }
  .register::after {
    display: none;
  }
}

.form-warning-login label {
  color: black;
}

.form-warning-login .checkbox {
  display: inline-block;
  margin-right: 1em;
}

.form-warning-login .checkbox span {
  text-transform: none;
}

.form-warning-login * {
  vertical-align: middle;
}

.form-warning-login button {
  margin-top: 0em;
}

@media only screen and (min-width: 768px) {
  .form-warning-login button {
    margin-top: 0.5em;
  }
  [type="checkbox"] {
    margin-top: 0;
  }
}

#btn_show_login {
  border: 2px solid rgba(215, 37, 33, 0.8);
  color: #fff;
  background: rgba(215, 37, 33, 0.8);
}
</style>
