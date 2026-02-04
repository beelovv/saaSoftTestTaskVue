import { defineStore } from 'pinia'
import type { Field } from '../Interfaces/FormIntefaces'
import { rules } from '../utils/rules'
export const useIndexStore = defineStore('index', {
  state: ()=> ({
    fieldsData: [] as Field[]
  }),
  getters: {
    getFieldsData: (state) => state.fieldsData.map(item => {
        let labelString 
        if(!item.label || item.label.length <=0 ){
            return labelString = ''
        }
        labelString = item.label.map(labelObj => labelObj.text).filter(text => text !== '').join(';');
        return{
            label: labelString,
            type: item.type || '',
            login: item.login || '',
            password: item.password || '',
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
        
    })
  },
  actions: {
    saveFields(fields: Field[]){
        this.fieldsData = fields
        if( this.fieldsData.length === 0){
          localStorage.removeItem('fields')
          return
        }
        localStorage.setItem('fields', JSON.stringify(fields))
    },
    loadFieldsFromStorage() {
      try {
        const stored = localStorage.getItem('fields')
        if (stored) {
          this.fieldsData = JSON.parse(stored)
        }
      } catch (error) {
        console.error('Не удалось загрузить поля:', error)
        this.fieldsData = []
      }
    }
  }
})
