
export type Country = {
  id: string
  name: string
  short: string
  avatar: string
}

export const countries: Country[] = [
  {
    id: 'vi',
    name: 'Tiếng Việt',
    short: 'vi',
    avatar: 'https://flagcdn.com/vn.svg'
  },
  {
    id: 'en',
    name: 'English',
    short: 'en',
    avatar: 'https://flagcdn.com/gb.svg'
  }
]
