import { Atom } from '@styli/types'
import plugin from '../src'

describe('styli-plugin-text-size', () => {
  const { isMatch, onAtomStyleCreate } = plugin()
  const sheet = {} as any

  it('isMatch', () => {
    expect(isMatch!('text')).toEqual(true)
    expect(isMatch!('text-10')).toEqual(true)
    expect(isMatch!('text-10rem')).toEqual(true)
  })

  it('onAtomStyleCreate', () => {
    const atom1: Atom = { propKey: 'text', propValue: 10, key: 'text', type: 'style', style: {} }
    const newAtom1: Atom = {
      propKey: 'text',
      propValue: 10,
      style: { fontSize: '10px' },
      key: 'text',
      type: 'style',
    }
    expect(onAtomStyleCreate!(atom1, sheet)).toMatchObject(newAtom1)

    const atom3: Atom = {
      propKey: 'text-10rem',
      propValue: true,
      key: 'text-10rem',
      type: 'style',
      style: {},
    }
    const newAtom3: Atom = {
      key: 'text-10rem',
      propKey: 'text-10rem',
      propValue: true,
      style: { fontSize: '10rem' },
      type: 'style',
    }
    expect(onAtomStyleCreate!(atom3, sheet)).toMatchObject(newAtom3)
  })
})
