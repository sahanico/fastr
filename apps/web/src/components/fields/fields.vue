<template>
  <div>
    <!-- Text Field -->
    <template v-if="item.value.type==='text'">
      <text-field v-model="form[item.value.name]" :label=item.value.label
                  :disabled="item.value.meta.disabled || disabled" :design="design"
                  :name=item.value.name :form="form" :required="item.value.required"
                  :context="context" :default="item.value.meta"></text-field>
    </template>
    <template v-if="item.value.type==='address'">
      <address-field v-model="form[item.value.name]"
                     :context="context"
                     :label="item.value.label"
                     :name="item.value.name"
                     :form="form"
                     :required="item.value.required">
      </address-field>
    </template>
    <!-- Text Area Field -->
    <template v-if="item.value.type==='textarea'">
      <textarea-field v-model="form[item.value.name]" :label=item.value.label
                      :name=item.value.name :form="form" :required="item.value.required"
                      :textAreaRows="item.value.meta.textareaRows"
                      :disabled="item.value.meta.disabled"
                      :context="context"></textarea-field>
    </template>
    <!-- Number Field -->
    <template v-if="item.value.type==='number'">
      <number-field v-model="form[item.value.name]" :label=item.value.label
                    :name=item.value.name :form="form" :required="item.value.required"
                    :disabled="item.value.meta.disabled || disabled"
                    :context="context"></number-field>
    </template>
    <!-- Object Field -->
    <template v-if="item.value.type==='object'">
      <object-field v-model="form[item.value.name]" :object="item.value" :name=item.value.name
                    @updateHeight="updateHeight" :root-form-field-index="rootFormFieldIndex"
                    @updateInListHeight="updateInListHeight" :label="item.value.label"
                    :disabled="item.value.meta.disabled" :form="form" :item="item"
                    :pool="pool"
                    :context="context"></object-field>
    </template>
    <!-- Object Array Field -->
    <template v-if="item.value.type==='object_array'">
      <object-array-field v-model="form[item.value.name]" :object="item.value"
                          @updateHeight="updateHeight" :root-form-field-index="rootFormFieldIndex"
                          @updateInListHeight="updateInListHeight" :label="item.value.label"
                          :disabled="item.value.meta.disabled" :name="item.value.name"
                          :context="context" :form="form"></object-array-field>
    </template>
    <!-- Date Time Field -->
    <template v-if="item.value.type==='date_time'">
      <date-time-field v-model="form[item.value.name]" :name=item.value.name
                       :form="form" :label="item.value.label"
                       :context="context"></date-time-field>
    </template>
    <!-- Dropdown Field -->
    <template v-if="item.value.type==='dropdown'">
      <dropdown-field v-model="form[item.value.name]" :context="context" :item="item"
                      :disabled="item.value.meta.disabled"
                      :name=item.value.name :form="form" :required="item.value.required">
      </dropdown-field>
    </template>
    <!-- User Field -->
    <template v-if="item.value.type==='user'">
      <user-field v-model="form[item.value.name]" :item="item" :context="context" :form="form"
                  :name=item.value.name :object="item.value" :required="item.value.required">
      </user-field>
    </template>
    <!-- Multiple User Field -->
    <template v-if="item.value.type==='multiple_users'">
      <multiple-users-field v-model="form[item.value.name]" :item="item" :context="context"
                            :form="form" :name=item.value.name :object="item.value">
      </multiple-users-field>
    </template>
    <!-- Date Field -->
    <template v-if="item.value.type==='date'">
      <date-field v-model="form[item.value.name]" :name="item.value.name" :form="form"
                  :required="item.value.required" :label="item.value.label"
                  :default="item.value.meta.default"
                  :context="context"></date-field>
    </template>
    <!-- Checkbox Field -->
    <template v-if="item.value.type==='checkbox'">
      <checkbox-field v-model="form[item.value.name]" :label=item.value.label
                      :form="form" :name="item.value.name" :item="item"
                      :context="context" :value="form[item.value.name]"></checkbox-field>
    </template>
    <!-- Signature Field -->
    <template v-if="item.value.type==='signature'">
      <signature-field v-model="form[item.value.name]" :item="item" :form="form"
                       :name="item.value.name" :label=item.value.label
                       :disabled="item.value.meta.disabled"
                       :context="context"></signature-field>
    </template>
    <!-- Radio Buttons Field -->
    <template v-if="item.value.type==='radio'">
      <radio-field v-model="form[item.value.name]" :label="item.value.label"
                   :disabled="item.value.meta.disabled" :name=item.value.name
                   :form="form" :required="item.value.required" :item="item"
                   :items="item.value.meta.radioItems" :context="context">
      </radio-field>
    </template>
    <!-- Time Field -->
    <template v-if="item.value.type==='time'">
      <time-field v-model="form[item.value.name]" :context="context" :form="form"
                  :name="item.value.name"></time-field>
    </template>
    <!-- Currency Field -->
    <template v-if="item.value.type==='currency'">
      <currency-field v-model="form[item.value.name]" :context="context"
                      :name="item.value.name" :disabled="item.value.meta.disabled || disabled"
                      :form="form" :label="item.value.label"></currency-field>
    </template>
    <!-- Dropdown Array Field -->
    <template v-if="item.value.type==='dropdown_array'" :disabled="item.value.meta.disabled">
      <dropdown-array-field v-model="form[item.value.name]" :context="context"
                            :item="item" :form="form" :name="item.value.name"/>
    </template>
    <!-- Email Field -->
    <template v-if="item.value.type==='email'" :disabled="item.value.meta.disabled">
      <email-field v-model="form[item.value.name]"
                   :context="context" :form="form"
                   :name=item.value.name
                   :label=item.value.label
                   :required="item.value.required"
                   :item="item">

      </email-field>
    </template>
    <!-- Phone Field -->
    <template v-if="item.value.type==='phone'" :disabled="item.value.meta.disabled">
      <phone-field v-model="form[item.value.name]" :context="context" :form="form"
                   :required="item.value.required" :item="item" :name=item.value.name></phone-field>
    </template>
    <!-- Display Text Field -->
    <template v-if="item.value.type==='display_text'" :disabled="item.value.meta.disabled">
      <display-text-field v-model="form[item.value.name]" :context="context" :form="form"
                          :item="item" :default="item.value.meta.default"
                          :label=item.value.label :name=item.value.name />
    </template>
    <!-- Percent Field -->
    <template v-if="item.value.type==='percent'">
      <percent-field v-model="form[item.value.name]" :context="context"
                     :item="item" :form="form" :name=item.value.name
                     :label=item.value.label
                     :default="item.value.meta.default"></percent-field>
    </template>
    <!-- Display Image Field -->
    <!-- Display Image Field -->
    <template v-if="item.value.type==='display_image'">
      <image-field v-model="form[item.value.name]" :context="context" :form="form"
                   :item="item" :default="item.value.meta.default"
                   :name=item.value.name></image-field>
    </template>
    <!--   todo: template for attachment field-->
    <template v-if="item.value.type==='attachment'">
      <attachment-field
        v-model="form[item.value.name]" :label=item.value.label
        :name=item.value.name :form="form" :inputId="inputId" @input="handleAttachmentInput"
        :context="context" :item="item"></attachment-field>
    </template>
    <template v-if="item.value.type==='design'">
      <design-field v-model="form[item.value.name]" :label=item.value.label
                      :name=item.value.name :form="form" :required="item.value.required"
                      :context="context"></design-field>
    </template>
    <template v-if="item.value.type==='parametric'">
      <parametric-field v-model="form[item.value.name]" :label=item.value.label :field="item"
                      :name=item.value.name :form="form" :required="item.value.required"
                      :context="context"></parametric-field>
    </template>
    <!-- COMPUTED Field -->
    <template v-if="item.value.type==='computed'">
      <computed-field v-model="form[item.value.name]" :label=item.value.label
                    :name=item.value.name :form="form" :required="item.value.required"
                    :disabled="item.value.meta.disabled || disabled"
                    :context="context"></computed-field>
    </template>
  </div>
</template>
<script>
import ObjectField from '../fields/object-field';
import ObjectArrayField from '../fields/object-array-field';
import DropdownField from '../fields/dropdown-field';
import DropdownArrayField from '../fields/dropdown-array-field';
import TextField from '../fields/text-field';
import TextareaField from '../fields/textarea-field';
import NumberField from '../fields/number-field';
import CheckboxField from '../fields/checkbox-field';
import UserField from '../fields/user-field';
import RadioField from '../fields/radio-field';
import TimeField from '../fields/time-field';
import DateField from '../fields/date-field';
import DateTimeField from '../fields/date-time-field';
import SignatureField from '../fields/signature-field';
import CurrencyField from '../fields/currency-field';
import EmailField from '../fields/email-field';
import PhoneField from '../fields/phone-field';
import DisplayTextField from '../fields/display-text-field';
import PercentField from '../fields/percent-field';
import ImageField from '../fields/image-field';
import AttachmentField from '../fields/attachment-field';
import MultipleUsersField from '../fields/multiple-users';
import AddressField from '../fields/address-field';
import DesignField from '../fields/design-field';
import ParametricField from '../fields/parametric-field';
import ComputedField from './computed-field';

export default {
  components: {
    ComputedField,
    ObjectField,
    ObjectArrayField,
    TextField,
    TextareaField,
    NumberField,
    CheckboxField,
    UserField,
    RadioField,
    TimeField,
    DateField,
    SignatureField,
    DateTimeField,
    CurrencyField,
    DropdownField,
    DropdownArrayField,
    EmailField,
    PhoneField,
    DisplayTextField,
    PercentField,
    ImageField,
    AttachmentField,
    MultipleUsersField,
    AddressField,
    DesignField,
    ParametricField,
  },
  props: ['item', 'context', 'form', 'inputId', 'rootFormFieldIndex', 'design', 'disabled', 'pool'],
  name: 'test',
  methods: {
    updateHeight(height, idx) {
      this.$emit('updateHeight', height, idx);
    },
    updateInListHeight(height, idx) {
      this.$emit('updateHeight', height, idx);
    },
    handleAttachmentInput(value) {
      this.form[this.item.value.name] = value;
    },
  },
  watch: {
    'design.label': {
      handler(label) {
        if (this.context === 'create') {
          this.design.name = label.trim().split(' ').join('_').toLowerCase();
        }
      },
    },
  },
};
</script>
