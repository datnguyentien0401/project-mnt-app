import { Term } from '@/types/common'

export function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

export function stringToColor(str: string) {
  let hash = 0
  str.split('').forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash)
  })
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += value.toString(16).padStart(2, '0')
  }
  return colour
}

export function getTimerangeByYearAndTerm(year: string, term: Term) {
  const fromDate = new Date(year)
  const toDate = new Date(year)

  //month based index = 0
  if (term === Term.HALF_1) {
    fromDate.setMonth(0, 1)
    toDate.setMonth(5, 30)
  } else if (term === Term.HALF_2) {
    fromDate.setMonth(6, 1)
    toDate.setMonth(11, 31)
  } else if (term === Term.FULL) {
    fromDate.setMonth(0, 1)
    toDate.setMonth(11, 31)
  }
  return {
    fromDate: fromDate,
    toDate: toDate,
  }
}
