import type { WeatherIconType } from '@/types/weather'

export function getIconType(code: number): WeatherIconType {
    if (code === 0)              return 'clear'
    if (code <= 2)               return 'partly-cloudy'
    if (code === 3)              return 'cloudy'
    if (code <= 48)              return 'fog'
    if (code <= 57)              return 'drizzle'
    if (code <= 67)              return 'rain'
    if (code <= 77)              return 'snow'
    if (code <= 82)              return 'rain'
    if (code <= 86)              return 'snow'
    return 'thunder'
}

export function getDescription(code: number): string {
    const map: Record<number, string> = {
        0: 'Céu limpo',               1: 'Predominantemente limpo',  2: 'Parcialmente nublado',
        3: 'Nublado',                 45: 'Neblina',                 48: 'Neblina com geada',
        51: 'Garoa leve',             53: 'Garoa moderada',          55: 'Garoa intensa',
        61: 'Chuva leve',             63: 'Chuva moderada',          65: 'Chuva forte',
        71: 'Neve leve',              73: 'Neve moderada',           75: 'Neve forte',
        77: 'Granizo',                80: 'Pancadas de chuva leve',  81: 'Pancadas de chuva moderada',
        82: 'Pancadas de chuva forte',85: 'Pancadas de neve',        86: 'Pancadas de neve forte',
        95: 'Tempestade',             96: 'Tempestade com granizo',  99: 'Tempestade com granizo forte',
    }
    return map[code] ?? 'Condição desconhecida'
}

export function getWindDir(deg: number): string {
    const dirs = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO']
    return dirs[Math.round(deg / 45) % 8]
}

export function formatDay(dateStr: string, index: number): string {
    if (index === 0) return 'Hoje'
    if (index === 1) return 'Amanhã'
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('pt-BR', { weekday: 'short' })
              .replace('.', '')
              .replace(/^\w/, c => c.toUpperCase())
}

export function getUvLabel(uv: number): string {
    if (uv <= 2)  return 'Baixo'
    if (uv <= 5)  return 'Moderado'
    if (uv <= 7)  return 'Alto'
    if (uv <= 10) return 'Muito alto'
    return 'Extremo'
}

export function getUvColor(uv: number): string {
    if (uv <= 2)  return 'text-emerald-300'
    if (uv <= 5)  return 'text-yellow-300'
    if (uv <= 7)  return 'text-orange-300'
    if (uv <= 10) return 'text-red-400'
    return 'text-purple-400'
}