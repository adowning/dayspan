<template>
  <v-container grid-list-md class="mt-3">
    <v-layout row wrap v-if="!loading">
      <v-flex md12 sm12 xs12>
        <v-card class="elevation-0 transparent pa-2 ma-0">
          <v-layout row wrap justify-center>
            <v-flex xl2 lg3 md4 sm4 xs12>
              <v-layout justify-center>
                <v-flex xs3>
                  <v-btn v-show="false" icon>
                    <v-icon color="editicon">edit</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs6>
                  <v-card class="transparent elevation-0">
                    <div class="text-xs-center mb-3">
                      <v-avatar size="120" class="elevation-2">
                        <img src="../../assets/images/avatar_placeholder.png" alt="avatar">
                      </v-avatar>
                    </div>
                  </v-card>
                </v-flex>
                <v-flex xs3>
                  <v-btn icon @click.native="imgdialog = !imgdialog">
                    <v-icon color="editicon">edit</v-icon>
                  </v-btn>
                  <app-image :dialog="imgdialog" @close="closeImage"></app-image>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xl5 lg6 md8 sm8 xs12>
              <v-card class="mb-2">
                <v-list two-line>
                  <app-user-name v-bind:profile="profile" @updateName="edit = true"></app-user-name>

                  <!-- <app-user-name v-bind:profile="profile" @updateName="updateName($event)"></app-user-name> -->
                  <v-divider></v-divider>
                  <app-user-email :email="userModel.emailAddress"></app-user-email>
                  <v-divider></v-divider>
                  <app-birth-date
                    :date="userModel.birthDate"
                    :caption="'Birth Date'"
                    @update="updateBirthDate($event)"
                  ></app-birth-date>
                  <v-divider></v-divider>
                </v-list>
                <v-list>
                  <app-phone-number
                    :phone="userModel.phoneNumber"
                    @updatePhoneNumber="updatePhone($event)"
                  ></app-phone-number>
                  <v-divider></v-divider>
                </v-list>
                <v-list>
                  <app-address
                    :address="userModel.homeAddress"
                    :caption="'Home Address'"
                    @updateAddress="updateAddress($event, 'home')"
                  ></app-address>
                  <v-divider></v-divider>
                  <app-address
                    :address="userModel.businessAddress"
                    :caption="'Business Address'"
                    @updateAddress="updateAddress($event, 'business')"
                  ></app-address>
                </v-list>
              </v-card>
              <v-card class="mt-4">
                <v-toolbar dense class="elevation-0 grey--text">
                  <v-toolbar-title>Custom Attributes</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon flat class="mr-3" @click="addCustomForm =! addCustomForm">
                    <v-icon color="editicon">add</v-icon>
                  </v-btn>
                </v-toolbar>
                <template v-for="(item, index) in userModel.custom">
                  <app-custom
                    :key="index"
                    :obj="item"
                    :newEntry="false"
                    @update="updateCustom($event, index)"
                    @delete="deleteCustom(index)"
                    :caption="'Custom Atribute' + ' ' + index"
                  ></app-custom>
                </template>
              </v-card>
              <v-dialog v-if="addCustomForm" max-width="500px">
                <app-custom
                  :obj="{ prop1: '', prop2: '', prop3: '', prop4: '', prop5: '' }"
                  :newEntry="true"
                  @add="addCustom($event)"
                  @close="addCustomForm =! addCustomForm"
                  :caption="'Custom Attribute'"
                ></app-custom>
              </v-dialog>
              <v-btn
                small
                class="mt-4 elevation-0 grey--text"
                @click.native="pwdialog = !pwdialog"
              >Change Password</v-btn>
              <app-chpwd :dialog="pwdialog" @close="pwdialog = !pwdialog"></app-chpwd>
            </v-flex>
          </v-layout>
        </v-card>
        {{profile}}
        <name-edit v-bind:profile="profile" v-on:cancel="edit=null" v-on:submit="edit=null"></name-edit>
        {{loading}}
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import userName from "../profile/Name.vue";
import userEmail from "../profile/email.vue";
import birthDate from "./datefield.vue";
import phoneNumber from "./phone.vue";
import address from "./address.vue";
import custom from "./custom.vue";
import chpwd from "./chpwd.vue";
import image from "./image.vue";
import { mapGetters } from "vuex";
import * as Database from "../../database/Database";
import { filter, first, map, debounce, startWith } from "rxjs/operators";
import { timer } from "rxjs";
import NameEdit from "./name-edit.vue";
export default {
  components: {
    "app-user-name": userName,
    "app-user-email": userEmail,
    "app-birth-date": birthDate,
    "app-phone-number": phoneNumber,
    "app-address": address,
    "app-custom": custom,
    "app-chpwd": chpwd,
    "app-image": image
  },
  data: function() {
    return {
      employee: {},
      loading: true,
      edit: null,

      formData: null,
      userModel: {
        name: { first: "", middle: "", last: "" },
        emailAddress: "",
        birthDate: "",
        phoneNumber: { mobile: "", business: "", home: "" },
        homeAddress: {
          line: "",
          city: "",
          state: "",
          zipcode: "",
          country: ""
        },
        businessAddress: {
          line: "",
          city: "",
          state: "",
          zipcode: "",
          country: ""
        },
        custom: []
      },
      pwdialog: false,
      imgdialog: false,
      addCustomForm: false
    };
  },
  computed: {
    // ...mapGetters({
    //   checkLogin: 'getUser'
    // })
  },
  methods: {
    closeImage: function() {
      console.log("closing image dialog");
      this.imgdialog = false;
    },
    getAttributes: function() {
      if (this.$store.getters.getStateAttributes.length < 1) {
        console.log("getting attributes from server...");
        this.$store.state.auth.cognitoUser.getUserAttributes((err, result) => {
          if (err) {
            console.log("get attribute error: " + err);
          } else {
            this.$store.commit("setAttributes", result);
            this.mapAttributes(result);
          }
        });
      } else {
        console.log("getting attributes from central state...");
        let result = this.$store.getters.getStateAttributes;
        this.mapAttributes(result);
      }
    },
    mapAttributes: function(result) {
      for (let attribute of result) {
        if (attribute.Name === "given_name") {
          this.userModel.name.first = attribute.Value;
        } else if (attribute.Name === "middle_name") {
          this.userModel.name.middle = attribute.Value;
        } else if (attribute.Name === "family_name") {
          this.userModel.name.last = attribute.Value;
        } else if (attribute.Name === "birthdate") {
          this.userModel.birthDate = attribute.Value;
        } else if (attribute.Name === "email") {
          this.userModel.emailAddress = attribute.Value;
        } else if (attribute.Name === "custom:phone_numbers") {
          this.userModel.phoneNumber = JSON.parse(attribute.Value);
        } else if (attribute.Name === "custom:home_address") {
          this.userModel.homeAddress = JSON.parse(attribute.Value);
        } else if (attribute.Name === "custom:business_address") {
          this.userModel.businessAddress = JSON.parse(attribute.Value);
        } else if (attribute.Name === "custom:custom_attribute") {
          this.userModel.custom = JSON.parse(attribute.Value);
        }
      }
    },
    updateName: async function(name) {
      console.log("updating name...", name.first);
      // let firstName = { Name: "given_name", Value: name.first };
      // let middleName = { Name: "middle_name", Value: name.middle };
      // let lastName = { Name: "family_name", Value: name.last };
      // await this.profile.atomicUpdate("name.first", name.first);
      // await this.profile.update({
      //   $set: {
      //     imageUrl: "foobar" // sets firstName to foobar
      //   }
      // });
      // this.formData = this.profile;
      // this.formData.imageUrl = "asdfad";
      this.formData = this.profile.imageUrl;
      console.log(this.profile);
      await this.profile.atomicSet("imageUrl", this.formData);

      // this.$emit("submit");
      // this.employee.set(firstName);
      // this.employee.set(middleName);
      // this.employee.set(lastName);
      // this.employee.save({
      //   success: function(obj) {
      //     this.$cb.pin(obj);
      //   },
      //   error: function(err) {
      //     console.error(err);
      //   }
      // });
    },
    updateBirthDate: function(date) {
      console.log("updating birthday date...");
      let attributeList = [];
      let attributeBirthDate = { Name: "birthdate", Value: date };
      let birthDate = attributeBirthDate;
      console.log(birthDate);
      attributeList.push(birthDate);
      this.$store.state.auth.cognitoUser.updateAttributes(
        attributeList,
        (err, result) => {
          if (err) {
            console.log("error: " + err);
            return;
          }
          console.log("call result: " + result);
          this.userModel.birthDate = date;
        }
      );
    },
    updatePhone: function(phone) {
      console.log("updating phone number...");
      var attributeList = [];
      var phoneNumbers = JSON.stringify(phone);
      console.log("saving numbers :" + phoneNumbers);
      var attributePhoneNumber = {
        Name: "custom:phone_numbers",
        Value: phoneNumbers
      };
      var phoneNumber = attributePhoneNumber;
      attributeList.push(phoneNumber);
      this.$store.state.auth.cognitoUser.updateAttributes(
        attributeList,
        (err, result) => {
          if (err) {
            console.log("error: " + JSON.stringify(err));
            return;
          }
          console.log("call result: " + result);
          this.userModel.phoneNumber = JSON.parse(JSON.stringify(phone));
        }
      );
    },
    updateAddress: function(newAddress, type) {
      console.log("updating address...");
      let attributeList = [];
      let addressJSON = "";
      if (type === "home") {
        addressJSON = JSON.stringify(newAddress);
      } else if (type === "business") {
        addressJSON = JSON.stringify(newAddress);
      } else {
        return;
      }
      var attributeAddress = {
        Name: "custom:" + type + "_address",
        Value: addressJSON
      };
      var address = attributeAddress;
      attributeList.push(address);
      this.$store.state.auth.cognitoUser.updateAttributes(
        attributeList,
        (err, result) => {
          if (err) {
            console.log("error: " + JSON.stringify(err));
            return;
          }
          console.log("call result: " + result);
          if (type === "home") {
            console.log("home address updated");
            this.userModel.homeAddress = JSON.parse(JSON.stringify(newAddress));
          } else if (type === "business") {
            console.log("business address updated");
            this.userModel.businessAddress = JSON.parse(
              JSON.stringify(newAddress)
            );
          }
        }
      );
    },
    addCustom: function(value) {
      console.log("adding custom attribute ...");
      let newCustom = this.userModel.custom.slice();
      newCustom.push(value);
      this.updateCustomAtrribute(newCustom);
    },
    updateCustom: function(value, index) {
      console.log("updating custom attribute ...");
      let newCustom = this.userModel.custom.slice();
      newCustom.splice(index, 1, value);
      this.updateCustomAtrribute(newCustom);
    },
    deleteCustom: function(index) {
      console.log("deleting custom attribute at index " + index);
      let newCustom = this.userModel.custom.slice();
      if (index > -1) {
        newCustom.splice(index, 1);
      }
      this.updateCustomAtrribute(newCustom);
    },
    updateCustomAtrribute: function(customAttribute) {
      let attributeList = [];
      let attribute = {
        Name: "custom:custom_attribute",
        Value: JSON.stringify(customAttribute)
      };
      var newAttribute = attribute;
      attributeList.push(newAttribute);
      this.$store.state.auth.cognitoUser.updateAttributes(
        attributeList,
        (err, result) => {
          if (err) {
            console.log("error: " + JSON.stringify(err));
            return;
          }
          console.log("call result: " + result);
          console.log("custom attribute updated");
          this.addCustomForm = false;
          this.userModel.custom = customAttribute.slice();
        }
      );
    }
  },
  subscriptions() {
    const db = Database.get();
    console.log(this.$route.query.employee);
    return {
      profile: db.profiles
        .findOne()
        .where("humanityId")
        .eq(this.$route.query.employee).$
      // .findOne()
      // .where("employeeId")
      // .eq(this.$route.query.employee).$
    };
  },
  async mounted() {
    // this.formData = this.profile;
    console.log(this.$route.query.employee);

    const db = Database.get();
    this.loading = await db.profiles
      .findOne()
      .where("humanityId")
      .eq(this.$route.query.employee)
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
<style scoped>
</style>
