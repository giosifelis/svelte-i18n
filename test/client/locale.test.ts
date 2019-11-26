import {
  getFallbackLocale,
  setFallbackLocale,
  isFallbackLocaleOf,
  getFallbackOf,
  getFallbacksOf,
  setInitialLocale,
  getCurrentLocale,
  $locale,
  isRelatedLocale,
} from '../../src/client/stores/locale'
import { get } from 'svelte/store'

beforeEach(() => {
  setFallbackLocale(undefined)
  $locale.set(undefined)
})

test('sets and gets the fallback locale', () => {
  setFallbackLocale('en')
  expect(getFallbackLocale()).toBe('en')
})

test('checks if a locale is a fallback locale of another locale', () => {
  expect(isFallbackLocaleOf('en', 'en-US')).toBe(true)
  expect(isFallbackLocaleOf('en', 'en')).toBe(false)
  expect(isFallbackLocaleOf('it', 'en-US')).toBe(false)
})

test('checks if a locale is a fallback locale of another locale', () => {
  expect(isRelatedLocale('en', 'en-US')).toBe(true)
  expect(isRelatedLocale('pt-BR', 'pt')).toBe(true)
  expect(isRelatedLocale('en', 'en')).toBe(true)
  expect(isRelatedLocale('en', 'it-IT')).toBe(false)
  expect(isRelatedLocale('en-US', 'it')).toBe(false)
})

test('gets the next fallback locale of a locale', () => {
  expect(getFallbackOf('az-Cyrl-AZ')).toBe('az-Cyrl')
  expect(getFallbackOf('en-US')).toBe('en')
  expect(getFallbackOf('en')).toBe(null)
})

test('gets the global fallback locale if set', () => {
  setFallbackLocale('en')
  expect(getFallbackOf('it')).toBe('en')
})

test('should not get the global fallback as the fallback of itself', () => {
  setFallbackLocale('en')
  expect(getFallbackOf('en')).toBe(null)
})

test('if global fallback locale has a fallback, it should return it', () => {
  setFallbackLocale('en-US')
  expect(getFallbackOf('en-US')).toBe('en')
})

test('gets all fallback locales of a locale', () => {
  expect(getFallbacksOf('en-US')).toEqual(['en', 'en-US'])
  expect(getFallbacksOf('en-US')).toEqual(['en', 'en-US'])
  expect(getFallbacksOf('az-Cyrl-AZ')).toEqual(['az', 'az-Cyrl', 'az-Cyrl-AZ'])
})

test('gets all fallback locales of a locale including the global fallback locale', () => {
  setFallbackLocale('pt')
  expect(getFallbacksOf('en-US')).toEqual(['en', 'en-US', 'pt'])
  expect(getFallbacksOf('en-US')).toEqual(['en', 'en-US', 'pt'])
  expect(getFallbacksOf('az-Cyrl-AZ')).toEqual([
    'az',
    'az-Cyrl',
    'az-Cyrl-AZ',
    'pt',
  ])
})
test('gets all fallback locales of a locale including the global fallback locale and its fallbacks', () => {
  setFallbackLocale('pt-BR')
  expect(getFallbacksOf('en-US')).toEqual(['en', 'en-US', 'pt', 'pt-BR'])
  expect(getFallbacksOf('en-US')).toEqual(['en', 'en-US', 'pt', 'pt-BR'])
  expect(getFallbacksOf('az-Cyrl-AZ')).toEqual([
    'az',
    'az-Cyrl',
    'az-Cyrl-AZ',
    'pt',
    'pt-BR',
  ])
})

test("don't list fallback locale twice", () => {
  setFallbackLocale('pt-BR')
  expect(getFallbacksOf('pt-BR')).toEqual(['pt', 'pt-BR'])
  expect(getFallbacksOf('pt')).toEqual(['pt'])
})

test('gets the current locale', () => {
  expect(getCurrentLocale()).toBe(undefined)
  $locale.set('es-ES')
  expect(getCurrentLocale()).toBe('es-ES')
})

test('sets the global fallback when defining initial locale', () => {
  setInitialLocale({
    fallback: 'pt',
  })
  expect(get($locale)).toBe('pt')
  expect(getFallbackLocale()).toBe('pt')
})
