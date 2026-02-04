<template>
  <v-container>
    <v-container>
      <v-row class="header">
        <h1>
          Учетные записи
        </h1>
        <v-btn @click="addField" icon="mdi-plus"></v-btn>
      </v-row>
    </v-container>
    <v-form v-for="(field, index) in fields" :key="index" ref="forms">
      <v-container>
        <v-row>
          <v-col
            cols="25"
            md="2"
          >
            <v-text-field
              v-model="field.label"
              :rules="[rules.max50]"
              :counter="50"
              :error-messages="field.errors.label"
              label="Метка"
              hint="Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;"
              @blur="saveData"
            ></v-text-field>
          </v-col>

          <v-col
            cols="25"
            md="2"
          >
            <v-select 
              v-model="field.type"
              label="Тип записи"
              :rules="[rules.required]"
              required
              :items="['LDAP', 'Локальная']"
              :error-messages="field.errors.type"
              @update:model-value="saveData"
            >

            </v-select>
          </v-col>

          <v-col
            cols="25"
            md="2"
          >
            <v-text-field
              v-model="field.login"
              label="Логин"
              :rules="[rules.max100, rules.required]"
              required
              :counter="100"
              :error-messages="field.errors.login"
              @blur="saveData"
            ></v-text-field>
          </v-col>

          <v-col
          v-if="field.type === 'Локальная' || field.type === ''"
            cols="25"
            md="2"
          >
            <v-text-field
              :append-inner-icon="field.passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="field.passwordVisible ? 'text' : 'password'"
              v-model="field.password"
              label="Пароль"
              required
              :rules="[rules.max50, rules.required]"
              :counter="50"
              @click:append-inner="field.passwordVisible = !field.passwordVisible"
              :error-messages="field.errors.password"
              @blur="saveData"
            ></v-text-field>
          </v-col>

          <v-col
            cols="25"
            md="1"
          >
            <v-btn @click="removeField(index)" icon="mdi-delete"></v-btn>
          </v-col>
          
        </v-row>
      </v-container>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useIndexStore } from './stores';
import type { FormField } from './Interfaces/FormIntefaces';
import { rules } from './utils/rules';
type FormFieldType = 'label' | 'type' | 'login' | 'password';

const indexStore = useIndexStore()

const fields = ref<FormField[]>([{
  label: '',
  type: '',
  login: '',
  password: '',
  passwordVisible: false,
  rules: {
    label: [rules.max50],
    type: [rules.required],
    login: [rules.max100, rules.required],
    password: [rules.max50, rules.required],
  },
  errors: {
    label: [],
    type: [],
    login: [],
    password: [],
  }
}])

const addField = () => {
  fields.value = [...fields.value,
  {
    label: '',
    type: '',
    login: '',
    password: '',
    passwordVisible: false,
    rules: {
      label: [rules.max50],
      type: [rules.required],
      login: [rules.max100, rules.required],
      password: [rules.max50, rules.required],
    },
    errors: {
      label: [],
      type: [],
      login: [],
      password: [],
    }
  }
]}

const removeField = (index: number) => {
  fields.value.splice(index, 1)
  saveData()
}

const checkFieldErrors = (index: number, fieldName: FormFieldType) => {
  const field = fields.value[index];

  if (!field) return;

  const value = field[fieldName];
  const fieldRules = field.rules[fieldName];
  
  field.errors[fieldName] = [];
  
  for (const rule of fieldRules) {
    const result = rule(value);
    if (typeof result === 'string') {
      field.errors[fieldName].push(result);
      break; 
    }
  }
}

const checkAllFieldsErrors = () => {
  let hasAnyErrors = false;
  
  fields.value.forEach((field, index) => {
    const fieldTypes: FormFieldType[] = ['label', 'type', 'login', 'password'];
    
    fieldTypes.forEach(fieldName => {
      if (fieldName === 'password' && field.type === 'LDAP') {
        return;
      }
      
      checkFieldErrors(index, fieldName);
      if (field.errors[fieldName].length > 0) {
        hasAnyErrors = true;
      }
    });
  });
  
  return hasAnyErrors;
}

const saveData = () => {
  const hasErrors = checkAllFieldsErrors();
  if (hasErrors) {
    return;
  }

  const data = fields.value.map(item => {
    const labelArray = item.label.split(';').filter(label => label.trim() !== '').map(label => ({ text: label.trim() }));

    return {type: item.type, login: item.login, password: item.password, label: labelArray}
  })

  const currentDataString = JSON.stringify(indexStore.fieldsData || []);
  const newDataString = JSON.stringify(data);
  
  if (currentDataString === newDataString) {
    return;
  }

  indexStore.saveFields(data)
}

onMounted(() => {
  const storedData = indexStore.getFieldsData as FormField[]
  if (storedData && storedData.length > 0) {
    fields.value = storedData
  }
})

</script>

<style scoped>
  .header{
    gap: 25px;
  }

</style>