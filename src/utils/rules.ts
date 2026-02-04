export const rules = {
    max50: (value: string) => value.length <= 50 || 'Максимум 50 символов',
    max100: (value: string) => value.length <= 100 || 'Максимум 100 символов',
    required: (value: string) => !!value || 'Обязательное поле',
}