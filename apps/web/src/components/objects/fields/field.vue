<template>
  <v-card>
    <v-card-title><span class="headline">{{ formTitle }}</span></v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="16" sm="6" md="4">
            <v-text-field v-model="field.label" label="Label">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field :disabled="context === 'update'" v-model="field.name" label="Name">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-autocomplete v-model="field.type" :items="fieldTypes"
                            label="Type"></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-col>
              <v-checkbox v-model="field.unique" label="Unique"/>
            </v-col>
          </v-col>
          <v-col>
            <v-text-field v-model="field.description" label="Description">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div v-if="field.type !== 'signature'">
              <v-checkbox v-model="field.default" label="Default" :disabled="field.type === ''"/>
            </div>
          </v-col>
        </v-row>
        <v-row v-if="field.type === 'text'">
         <div v-if="field.default === true">
            <text-field v-model="field.meta.default" label="Default Value"/>
          </div>
        </v-row>
        <v-row v-if="field.type === 'number'">
          <div v-if="field.default === true">
            <number-field v-model="field.meta.default" label="Default Value"/>
          </div>
          <v-checkbox label="AutoIncrement" v-model="field.meta.autoIncrement"/>
        </v-row>
        <v-row v-if="field.type === 'object'">
          <v-autocomplete v-model="field.meta.object" :items="autocompleteObject"
                          chips dense
                          label="Select Object" outlined return-object small-chips
                          style="max-width: 150px">
          </v-autocomplete>
          <div v-if="field.default === true && field.meta.object !== ''">

            <object-field v-model="field.meta.default" :items="autocompleteRecords"
                          :object="field.meta.object"
                          chips dense label="Default Record"
                          outlined return-object small-chips
                          style="max-width: 150px"></object-field>
          </div>
        </v-row>
        <v-row v-if="field.type === 'object_array'">
          <v-autocomplete v-model="field.meta.objectArray" :items="autocompleteObject"
                          chips dense
                          label="Select Object" outlined return-object small-chips
                          style="max-width: 150px">
          </v-autocomplete>
          <div v-if="field.default === true && field.meta.objectArray !== ''">

            <object-array-field v-model="field.meta.default" :items="autocompleteRecords"
                                :object="field.meta.objectArray"
                                multiple
                                chips dense label="Default Record"
                                outlined return-object small-chips
                                style="max-width: 150px"></object-array-field>
          </div>
        </v-row>
        <v-row v-if="field.type === 'user'">
          <div v-if="field.default === true ">
            <user-field v-model="field.meta.default"
                        style="max-width: 150px" chips dense color="red"
            ></user-field>
          </div>
        </v-row>
        <v-row v-if="field.type === 'display_image'">
          <div v-if="field.default === true">
            <v-file-input  v-model="field.meta.default"
                           @change="encodeImage"
                           accept="image/png, image/jpeg, image/svg"/>
          </div>
        </v-row>
        <v-row v-if="field.type === 'display_text'">
          <div v-if="field.default === true">
            <v-text-field v-model="field.meta.default" label="Message to display"></v-text-field>
          </div>
        </v-row>
        <v-row v-if="field.type === 'textarea'">
          <v-checkbox v-model="autoTimestampOnUpdate"
                      label="Auto timestamp on update"></v-checkbox>
          <v-text-field type="number" v-model="textareaRows"
                        label="Textarea Rows"></v-text-field>
          <div v-if="field.default === true">
            <textarea-field v-model="field.meta.default" :textAreaRows="textareaRows"/>
          </div>
        </v-row>
        <v-row v-if="field.type === 'computed'">
          <v-text-field v-model="field.meta.computed" label="Computation"/>
          <div v-if="field.default === true">
            <computed-field v-model="field.meta.default"></computed-field>
          </div>
        </v-row>
        <v-row v-if="field.type === 'currency'">
          <v-select v-model="field.meta.currency" :items="currencyTypes"
                    label="Currency"></v-select>
          <div v-if="field.default === true">
            <currency-field v-model="field.meta.default" label="default currency"/>
          </div>
        </v-row>
        <v-row v-if="field.type === 'dropdown'">
          <!--          <div class="title red--text">Dropdown Items</div>-->
          <table style="width: 100%; padding:32px 0px 32px;">
            <tr>
              <td>
                <div v-for="(item, idx) in dropdownItems" :key="idx">
                  <v-text-field v-model="field.meta.dropdownItems[idx]"
                                :label="'Dropdown Item ' + (idx + 1)">
                  </v-text-field>
                </div>
              </td>
            </tr>
            <tfoot>
            <td>
              <v-btn style="position: absolute; right: 16px" icon @click="dropdownItems.push('')">
                <v-icon class="red--text"> mdi-plus</v-icon>
              </v-btn>
              <v-btn style="position: absolute; right: 54px" icon
                     @click="dropdownItems.pop()">
                <v-icon class="red--text"> mdi-minus</v-icon>
              </v-btn>
            </td>
            </tfoot>
          </table>
          <div v-if="field.default === true">
            <radio-field v-model="field.meta.default" :items="field.meta.dropdownItems"/>
          </div>
        </v-row>
        <v-row v-if="field.type === 'dropdown_array'">
          <table style="width: 100%; padding:32px 0px 32px;">
            <tr>
              <td>
                <div v-for="(item, idx) in dropdownArrayItems" :key="idx">
                  <v-text-field v-model="field.meta.dropdownArrayItems[idx]"
                                :label="'Dropdown Item ' + (idx + 1)">
                  </v-text-field>
                </div>
              </td>
            </tr>
            <tfoot>
            <td>
              <v-btn style="position: absolute; right: 16px" icon
                     @click="dropdownArrayItems.push('')">
                <v-icon class="red--text"> mdi-plus</v-icon>
              </v-btn>
              <v-btn style="position: absolute; right: 54px" icon
                     @click="dropdownArrayItems.pop()">
                <v-icon class="red--text"> mdi-minus</v-icon>
              </v-btn>
            </td>
            </tfoot>
          </table>
          <div v-if="field.default === true">
<!--todo: fix checkbox group, array cannot be string ( field.meta.default is a string )-->
            <div v-for="(item, index) in field.meta.dropdownArrayItems" :key="index">
              <v-checkbox
                v-model="field.meta.default"
                :label="item"
                :value="item"
              ></v-checkbox>
            </div>

          </div>
        </v-row>
        <v-row v-if="field.type === 'radio'">
          <div class="title red--text">Radio Items</div>
          <table style="width: 100%; padding-bottom: 32px;">
            <tr>
              <td>
                <div v-for="(item, idx) in radioItems" :key="idx">
                  <v-text-field v-model="field.meta.radioItems[idx]"
                                :label="'Radio Item ' + (idx + 1)">
                  </v-text-field>
                </div>
              </td>
            </tr>
            <tfoot>
            <td>
              <v-btn style="position: absolute; right: 16px" icon @click="radioItems.push('')">
                <v-icon class="red--text"> mdi-plus</v-icon>
              </v-btn>
              <v-btn style="position: absolute; right: 54px" icon
                     @click="radioItems.pop()">
                <v-icon class="red--text"> mdi-minus</v-icon>
              </v-btn>
            </td>
            </tfoot>
          </table>
          <div v-if="field.default === true">
            <radio-field v-model="field.meta.default" :items="field.meta.radioItems"></radio-field>
          </div>
        </v-row>
        <v-row v-if="field.type === 'date'">
          <div v-if="field.default === true  ">
            <date-field v-model="field.meta.default"></date-field>
          </div>
        </v-row>
        <v-row v-if="field.type === 'checkbox'">

          <div v-if="field.default === true">
            <checkbox-field v-model="field.meta.default"
                            :label="`Default: ${field.meta.default}`"/>
          </div>
        </v-row>
        <v-row v-if="field.type === 'signature'">
          <signature-field v-model="field.meta.signature"></signature-field>
          <!--           <signature-field :item="signTest"></signature-field>-->
        </v-row>
        <v-row v-if="field.type === 'time'">
          <div v-if="field.default === true">
            <time-field v-model="field.meta.default"></time-field>
          </div>
        </v-row>
        <v-row v-if="field.type === 'date_time'">
          <div v-if="field.default === true">
            <date-time-field v-model="field.meta.default"></date-time-field>
          </div>
        </v-row>
        <v-row v-if="field.type === 'email'">
          <div v-if="field.default === true">
            <email-field v-model="field.meta.default" label='default email'></email-field>
          </div>
        </v-row>
        <v-row v-if="field.type === 'phone'">
          <div v-if="field.default === true">
            <phone-field v-model="field.meta.default"></phone-field>
          </div>
        </v-row>
        <v-row v-if="field.type === 'percent'">
          <div v-if="field.default === true">
            <percent-field v-model="field.meta.default"></percent-field>
          </div>
        </v-row>
        <v-row v-if="field.type === 'address'">
          <div v-if="field.default === true">
            <address-field v-model="field.meta.default" :label="'Default Address'"/>
          </div>
        </v-row>
        <v-row v-if="field.type === 'attachment'">
          <div v-if="field.default === true">
            <attachment-field v-model="field.meta.default"/>
          </div>
        </v-row>
        <v-row v-if="field.type === 'design'">
          <div v-if="field.default === true">
            <design-field v-model="field.meta.default"/>
          </div>
        </v-row>
        <v-row v-if="field.type === 'parametric'">
          <div v-if="field.default === true">
            <parametric-field v-model="field.meta.default" :label="'default Params'"/>
          </div>
        </v-row>

      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-2" dark text @click="close">Cancel</v-btn>
      <v-btn color="red darken-2" dark text @click="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import _ from 'underscore';
import { fieldTypes, currencyTypes } from '../models';
import getBase64 from '../../../util/file';
import TextField from '../../fields/text-field';
import NumberField from '../../fields/number-field';
import ObjectField from '../../fields/object-field';
import ImageField from '../../fields/image-field';
import DisplayTextField from '../../fields/display-text-field';
import ObjectArrayField from '../../fields/object-array-field';
import UserField from '../../fields/user-field';
import TextareaField from '../../fields/textarea-field';
import CurrencyField from '../../fields/currency-field';
import DropdownField from '../../fields/dropdown-field';
import RadioField from '../../fields/radio-field';
import DateField from '../../fields/date-field';
import CheckboxField from '../../fields/checkbox-field';
import SignatureField from '../../fields/signature-field';
import TimeField from '../../fields/time-field';
import DateTimeField from '../../fields/date-time-field';
import EmailField from '../../fields/email-field';
import PhoneField from '../../fields/phone-field';
import PercentField from '../../fields/percent-field';
import AddressField from '../../fields/address-field';
import AttachmentField from '../../fields/attachment-field';
import DesignField from '../../fields/design-field';
import ParametricField from '../../fields/parametric-field';
import DropdownArrayField from '../../fields/dropdown-array-field';
import ComputedField from '../../fields/computed-field';


export default {
  components: {
    ComputedField,
    DropdownArrayField,
    ParametricField,
    DesignField,
    AttachmentField,
    AddressField,
    PercentField,
    PhoneField,
    EmailField,
    DateTimeField,
    TimeField,
    SignatureField,
    CheckboxField,
    DateField,
    RadioField,
    DropdownField,
    CurrencyField,
    TextareaField,
    UserField,
    ObjectArrayField,
    DisplayTextField,
    ImageField,
    NumberField,
    TextField,
    ObjectField,
  },
  props: {
    context: String,
    field: {
      type: Object,
      default: () => ({
        label: '',
        name: '',
        description: '',
        type: '',
        unique: false,
        default: false,
        meta: {
          default: '',
          image: '',
          textareaRows: 5,
          displayText: '',
          radioItems: [''],
          dropdownItems: [''],
          dropdownArrayItems: [''],
          object: '',
          objectArray: [],
          user: '',
          autoIncrement: false,
          date: '',
          currency: '',
          computed: '',
          checkbox: true,
          signature: '',
          time: '',
          dateTime: '',
          email: '',
          phone: '',
          percent: '',
          address: '',
          attachment: [],
          design: [],
          parametric: '',

        },
      }),
    },
  },
  data() {
    return {
      // signTest: {
      //   w: 5,
      //   h: 6,
      // },
      dialog: false,
      fieldTypes,
      currencyTypes,
      headers: [
        { text: 'Label', value: 'label' },
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Description', value: 'description' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      selectedFieldType: '',
      fields: [],
      allObjects: [],
      allUsers: [],
      autocompleteObject: [],
      autocompleteUser: [],
      selectedObject: {},
      dropdownItems: [''],
      dropdownArrayItems: [''],
      radioItems: [''],
      image: null,
      menu: null,
      date: '',
      selectedImage: '',
      displayText: '',
      autoTimestampOnUpdate: '',
      textareaRows: 5,
      default: '',
      records: [],

    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Field' : 'Edit Field';
    },
    autocompleteRecords() {
      if (!this.field.meta.object && !this.records) {
        return [];
      }
      return _.map(this.records, record => ({ text: record.label, value: record.name }));
    },
    autoCompleteUserRecord() {
      if (!this.field.meta.user && !this.records) {
        return [];
      }
      // eslint-disable-next-line no-underscore-dangle
      return _.map(this.autocompleteUser, user => ({ text: user.email, value: user._id }));
    },
  },
  methods: {
    async encodeImage(file) {
      // this.selectedImage = await getBase64(file);
      this.field.meta.default = await getBase64(file);
    },
    save() {
      this.$emit('saveField', {
        ...this.field,
        type: this.field.type,
      });
      this.close();
    },
    close() {
      this.selectedFieldType = '';
      this.$emit('dialog', false);
    },
  },
  watch: {
    dialog(val) {
      return val || this.close();
    },
    'field.label': {
      handler(label) {
        if (this.context === 'create') {
          this.field.name = label.trim().split(' ').join('_').toLowerCase();
        }
      },
    },
    'field.meta.object': {
      async handler(object) {
        if (object !== '') {
          this.records = await this.$store.dispatch(
            'getRecordsByObject', { object: this.field.meta.object.text });
        }
      },
    },
  },
  async created() {
    this.allObjects = await this.$store.dispatch('getAllObjects');
    if (this.allObjects) {
      this.allObjects = _.map(this.allObjects, (object, index) => {
        this.autocompleteObject.push({ text: `${object.name}`, value: index });
        return {
          name: object.name,
          fields: object.fields,
        };
      });
    }
    this.allUsers = await this.$store.dispatch('getAllUsers');
    if (this.allUsers) {
      _.each(this.allUsers, (user, index) => {
        this.autocompleteUser.push({ text: `${user.email}`, value: index });
      });
    }
  },
};
</script>
