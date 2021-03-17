import { styli } from '@styli/core'
import { StyliPlugin } from '@styli/types'
import { isValidPropValue } from '@styli/utils'

export const sizeMaps: any = {
  w: ['width'],
  h: ['height'],
  s: ['width', 'height'],
  circle: ['width', 'height', 'borderRadius'],
  minw: ['minWidth'],
  maxw: ['maxWidth'],
  minh: ['minHeight'],
  maxh: ['maxHeight'],
}

export function isSizeKey(key: string) {
  return /^([wh]|circle|min[HWhw]|max[HWhw])(-[\dA-Z-a-z]+)?$|^s(-[\dA-Za-z]+){0,2}$/.test(key)
}

export function sizePropToStyle(prop: string, propValue: any) {
  const [, matchKey = '', , xValue, , yValue] = prop.match(/^([swh]|circle|min[HWhw]|max[HWhw])(-([\d+A-Z]+))?(-([\d+A-Z]+))?$/i) || []
  const key = matchKey.toLowerCase()

  const sizeValue = isValidPropValue(propValue) ? [propValue] : [xValue, yValue]

  return (sizeMaps[key] || []).reduce((style: any, cur: string, idx: number) => {
    const currentValue = sizeValue[idx] || (isValidPropValue(propValue) ? propValue : xValue)
    style[cur] = styli.getValue(currentValue)
    return style
  }, {} as any)
}

export default (): StyliPlugin => {
  return {
    name: 'styli-plugin-size',
    isMatch: (propKey) => {
      return isSizeKey(propKey)
    },
    beforeAtomStyleCreate(atom) {
      const { propKey } = atom
      const [, key, value] = propKey.match(/^([a-zA-Z]+)(\d+)$/) || []
      if (!key || !value || !sizeMaps[key]) return atom

      const sizes = styli.getTheme<string[]>('spacing') || []

      if (!sizes.length) {
        console.error('theme spacing is not provide')
      }

      return {
        ...atom,
        propKey: key,
        propValue: sizes[Number(value)],
        className: propKey,
      }
    },
    onAtomStyleCreate(atom) {
      atom.style = sizePropToStyle(atom.propKey, atom.propValue)
      return atom
    },
  }
}
