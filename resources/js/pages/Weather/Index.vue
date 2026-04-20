<script setup lang="ts">
import {ref, computed, onMounted } from 'vue'
import WeatherIcon from '@/components/Weather/WeatherIcon.vue'
import CitySearch  from '@/components/Weather/CitySearch.vue'
import type { WeatherResponse, WeatherIconType, CityResult } from '@/types/weather'
import { Head } from '@inertiajs/vue3'

defineOptions({ layout: undefined })

// ─── State ───────────────────────────────────────────────
const loading = ref(true)
const error   = ref<string | null>(null)
const data    = ref<WeatherResponse | null>(null)

// ─── Helpers ─────────────────────────────────────────────
function getIconType(code: number): WeatherIconType {
    if (code === 0)            return 'clear'
    if (code <= 2)             return 'partly-cloudy'
    if (code === 3)            return 'cloudy'
    if (code <= 48)            return 'fog'
    if (code <= 57)            return 'drizzle'
    if (code <= 67)            return 'rain'
    if (code <= 77)            return 'snow'
    if (code <= 82)            return 'rain'
    if (code <= 86)            return 'snow'
    return 'thunder'
}

function getDescription(code: number): string {
    const map: Record<number, string> = {
        0: 'Céu limpo', 1: 'Predominantemente limpo', 2: 'Parcialmente nublado',
        3: 'Nublado', 45: 'Neblina', 48: 'Neblina com geada',
        51: 'Garoa leve', 53: 'Garoa moderada', 55: 'Garoa intensa',
        61: 'Chuva leve', 63: 'Chuva moderada', 65: 'Chuva forte',
        71: 'Neve leve', 73: 'Neve moderada', 75: 'Neve forte', 77: 'Granizo',
        80: 'Pancadas de chuva leve', 81: 'Pancadas de chuva moderada', 82: 'Pancadas de chuva forte',
        85: 'Pancadas de neve', 86: 'Pancadas de neve forte',
        95: 'Tempestade', 96: 'Tempestade com granizo', 99: 'Tempestade com granizo forte',
    }
    return map[code] ?? 'Condição desconhecida'
}

function getWindDir(deg: number): string {
    const dirs = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO']
    return dirs[Math.round(deg / 45) % 8]
}

function formatDay(dateStr: string, index: number): string {
    if (index === 0) return 'Hoje'
    if (index === 1) return 'Amanhã'
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('pt-BR', { weekday: 'short' })
              .replace('.', '')
              .replace(/^\w/, c => c.toUpperCase())
}

// ─── Dynamic background ───────────────────────────────────
const bgGradient = computed(() => {
    if (!data.value) return 'from-slate-900 via-blue-950 to-slate-900'
    const c = data.value.weather.current.weather_code
    if (c === 0 || c === 1)            return 'from-sky-500 via-blue-700 to-indigo-900'
    if (c === 2 || c === 3)            return 'from-slate-500 via-slate-700 to-slate-900'
    if (c <= 48)                       return 'from-slate-400 via-slate-600 to-slate-800'
    if (c <= 67 || (c >= 80 && c <= 82)) return 'from-slate-700 via-blue-900 to-slate-950'
    if (c <= 77 || (c >= 85 && c <= 86)) return 'from-sky-300 via-slate-600 to-slate-800'
    return 'from-slate-800 via-zinc-900 to-slate-950'
})

// ─── Data fetching ────────────────────────────────────────
async function fetchWeather(lat: number, lon: number) {
    loading.value = true
    error.value   = null
    try {
        const res = await fetch(`/weather/data?latitude=${lat}&longitude=${lon}`)
        if (!res.ok) throw new Error('Falha ao buscar dados do clima.')
        data.value = await res.json()
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Erro desconhecido.'
    } finally {
        loading.value = false
    }
}

function requestLocation() {
    loading.value = true
    error.value   = null

    if (!navigator.geolocation) {
        error.value   = 'Geolocalização não é suportada pelo seu navegador.'
        loading.value = false
        return
    }

    navigator.geolocation.getCurrentPosition(
        pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        err => {
            loading.value = false
            if (err.code === err.PERMISSION_DENIED)
                error.value = 'Permissão negada. Autorize o acesso à localização nas configurações do navegador.'
            else if (err.code === err.POSITION_UNAVAILABLE)
                error.value = 'Não foi possível determinar sua localização.'
            else
                error.value = 'Tempo esgotado ao obter localização.'
        },
        { timeout: 10000 },
    )
    
}

function onCitySelected(city: CityResult) {
    fetchWeather(city.latitude, city.longitude)
}

const pageTitle = computed(() => {
    if (!data.value) return 'Tempoo'
    const { city} = data.value.location
    
    return `Tempoo - ${city}`
})

function getUvLabel(uv: number): string {
    if (uv <= 2)  return 'Baixo'
    if (uv <= 5)  return 'Moderado'
    if (uv <= 7)  return 'Alto'
    if (uv <= 10) return 'Muito alto'
    return 'Extremo'
}

function getUvColor(uv: number): string {
    if (uv <= 2)  return 'text-emerald-300'
    if (uv <= 5)  return 'text-yellow-300'
    if (uv <= 7)  return 'text-orange-300'
    if (uv <= 10) return 'text-red-400'
    return 'text-purple-400'
}

interface WeatherAlert {
    level: 'info' | 'warning' | 'danger'
    icon: string
    message: string
}

const alerts = computed<WeatherAlert[]>(() => {
    if (!data.value) return []
    const c = data.value.weather.current
    const result: WeatherAlert[] = []

    // UV
    if (c.uv_index >= 11)
        result.push({ level: 'danger',  icon: '☀️', message: `Índice UV extremo (${c.uv_index}). Evite exposição ao sol.` })
    else if (c.uv_index >= 8)
        result.push({ level: 'warning', icon: '🌞', message: `Índice UV muito alto (${c.uv_index}). Use protetor solar FPS 50+.` })
    else if (c.uv_index >= 6)
        result.push({ level: 'info',    icon: '🌤️', message: `Índice UV alto (${c.uv_index}). Recomendado protetor solar.` })

    // Temperatura
    if (c.apparent_temperature >= 40)
        result.push({ level: 'danger',  icon: '🌡️', message: `Sensação térmica extrema (${Math.round(c.apparent_temperature)}°C). Risco de insolação.` })
    else if (c.apparent_temperature >= 35)
        result.push({ level: 'warning', icon: '🌡️', message: `Sensação térmica muito alta (${Math.round(c.apparent_temperature)}°C). Mantenha-se hidratado.` })
    else if (c.apparent_temperature <= 0)
        result.push({ level: 'danger',  icon: '🧊', message: `Sensação térmica abaixo de zero (${Math.round(c.apparent_temperature)}°C). Risco de congelamento.` })
    else if (c.apparent_temperature <= 5)
        result.push({ level: 'warning', icon: '🧣', message: `Frio intenso (${Math.round(c.apparent_temperature)}°C). Use roupas adequadas.` })

    // Vento
    if (c.wind_speed_10m >= 90)
        result.push({ level: 'danger',  icon: '🌀', message: `Vento tempestuoso (${Math.round(c.wind_speed_10m)} km/h). Evite áreas abertas.` })
    else if (c.wind_speed_10m >= 60)
        result.push({ level: 'warning', icon: '💨', message: `Vento muito forte (${Math.round(c.wind_speed_10m)} km/h). Atenção a objetos soltos.` })
    else if (c.wind_speed_10m >= 40)
        result.push({ level: 'info',    icon: '💨', message: `Vento forte (${Math.round(c.wind_speed_10m)} km/h). Cuidado ao dirigir.` })

    // Precipitação
    if (c.precipitation >= 10)
        result.push({ level: 'danger',  icon: '⛈️', message: `Chuva muito intensa (${c.precipitation}mm). Risco de alagamento.` })
    else if (c.precipitation >= 4)
        result.push({ level: 'warning', icon: '🌧️', message: `Chuva forte (${c.precipitation}mm). Tenha um guarda-chuva.` })
    else if (c.precipitation > 0)
        result.push({ level: 'info',    icon: '🌂', message: `Há precipitação no momento (${c.precipitation}mm).` })

    // Visibilidade
    if (c.visibility < 200)
        result.push({ level: 'danger',  icon: '🌫️', message: `Visibilidade muito baixa (${c.visibility}m). Extrema atenção ao dirigir.` })
    else if (c.visibility < 1000)
        result.push({ level: 'warning', icon: '🌫️', message: `Visibilidade reduzida (${(c.visibility / 1000).toFixed(1)}km). Dirija com cuidado.` })

    // Pressão
    if (c.surface_pressure < 990)
        result.push({ level: 'warning', icon: '🔻', message: `Pressão atmosférica baixa (${Math.round(c.surface_pressure)} hPa). Condições instáveis.` })
    else if (c.surface_pressure > 1025)
        result.push({ level: 'info',    icon: '🔺', message: `Pressão atmosférica alta (${Math.round(c.surface_pressure)} hPa). Tempo estável.` })

    // Código de clima crítico
    if ([95, 96, 99].includes(c.weather_code))
        result.push({ level: 'danger',  icon: '⚡', message: 'Tempestade com raios em curso. Evite espaços abertos.' })

    return result
})

const alertStyles: Record<WeatherAlert['level'], string> = {
    info:    'bg-sky-500/15    border-sky-400/30    text-sky-200',
    warning: 'bg-amber-500/15  border-amber-400/30  text-amber-200',
    danger:  'bg-red-500/15    border-red-400/30    text-red-200',
}

const alertDot: Record<WeatherAlert['level'], string> = {
    info:    'bg-sky-400',
    warning: 'bg-amber-400',
    danger:  'bg-red-400',
}

onMounted(() => requestLocation())

</script>

<template>
    
    <div :class="`min-h-screen bg-gradient-to-br ${bgGradient} transition-all duration-1000`">
        <Head :title="pageTitle" />
        <div class="min-h-screen flex flex-col items-center px-4 py-8">

            <!-- Header -->
            <header class="w-full max-w-lg flex items-center justify-between mb-8">
                <span class="text-white text-2xl font-bold tracking-tight montserrat-alternates-regular">
                    Tempoo
                </span>
                <button
                    v-if="!loading"
                    @click="requestLocation"
                    title="Atualizar localização"
                    class="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                    <!-- Refresh icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" stroke-width="2"
                         stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
                        <path d="M16 16h5v5"/>
                    </svg>
                </button>
            </header>

            <!-- Busca por cidade -->
            <div class="w-full max-w-lg mb-4">
                <CitySearch @select="onCitySelected" />
            </div>

            <!-- Loading -->
            <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-5">
                <div class="w-14 h-14 border-4 border-white/25 border-t-white rounded-full animate-spin"/>
                <p class="text-white/60 text-sm">Obtendo sua localização…</p>
            </div>

            <!-- Error -->
            <div v-else-if="error" class="w-full max-w-lg">
                <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center">
                    <div class="text-5xl mb-4">📍</div>
                    <h2 class="text-white font-semibold text-lg mb-2">Localização necessária</h2>
                    <p class="text-white/60 text-sm mb-6">{{ error }}</p>
                    <button @click="requestLocation"
                            class="bg-white/20 hover:bg-white/30 text-white font-medium px-6 py-3 rounded-2xl transition-colors">
                        Tentar novamente
                    </button>
                </div>
            </div>

            <!-- Conteúdo principal -->
            <div v-else-if="data" class="w-full max-w-lg flex flex-col gap-4">

                <!-- Localização -->
                <div class="text-center mb-1">
                    <h1 class="text-white text-2xl font-bold leading-tight">{{ data.location.city }}</h1>
                    <p class="text-white/50 text-sm mt-0.5">
                        {{ [data.location.state, data.location.country].filter(Boolean).join(', ') }}
                    </p>
                </div>

                <!-- Card principal: clima atual -->
                <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex flex-col items-center gap-1">
                    <WeatherIcon :type="getIconType(data.weather.current.weather_code)" :size="120"/>
                    <div class="text-white text-7xl font-thin mt-3 leading-none">
                        {{ Math.round(data.weather.current.temperature_2m) }}<span class="text-4xl align-super ml-1">°C</span>
                    </div>
                    <p class="text-white/85 text-lg mt-1">
                        {{ getDescription(data.weather.current.weather_code) }}
                    </p>
                    <p class="text-white/45 text-sm">
                        Sensação {{ Math.round(data.weather.current.apparent_temperature) }}°C
                    </p>
                </div>

                <!-- Grid de detalhes -->
                <div class="grid grid-cols-3 gap-3">

                    <!-- Sensação Térmica -->
                    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center gap-2">
                        <svg class="w-7 h-7 text-orange-300" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                        </svg>
                        <span class="text-white text-xl font-semibold">
                            {{ Math.round(data.weather.current.apparent_temperature) }}°C
                        </span>
                        <span class="text-white/45 text-xs text-center leading-tight">Sensação Térmica</span>
                    </div>

                    <!-- Umidade -->
                    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center gap-2">
                        <svg class="w-7 h-7 text-blue-300" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2S5 10 5 14a7 7 0 0 0 14 0C19 10 12 2 12 2z"/>
                        </svg>
                        <span class="text-white text-xl font-semibold">
                            {{ data.weather.current.relative_humidity_2m }}%
                        </span>
                        <span class="text-white/45 text-xs">Umidade</span>
                    </div>

                    <!-- Vento -->
                    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center gap-2">
                        <svg class="w-7 h-7 text-emerald-300" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
                            <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
                            <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
                        </svg>
                        <span class="text-white text-xl font-semibold">
                            {{ Math.round(data.weather.current.wind_speed_10m) }}
                        </span>
                        <span class="text-white/45 text-xs text-center leading-tight">
                            km/h {{ getWindDir(data.weather.current.wind_direction_10m) }}
                        </span>
                    </div>

                    <!-- Precipitação -->
                    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center gap-2">
                        <svg class="w-7 h-7 text-sky-300" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                            <path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>
                        </svg>
                        <span class="text-white text-xl font-semibold">
                            {{ data.weather.current.precipitation }}<span class="text-sm font-normal">mm</span>
                        </span>
                        <span class="text-white/45 text-xs">Precipitação</span>
                    </div>

                    <!-- Índice UV -->
                    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center gap-2">
                        <svg class="w-7 h-7 text-yellow-300" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="4"/>
                            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41
                                    M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                        </svg>
                        <span :class="`text-xl font-semibold ${getUvColor(data.weather.current.uv_index)}`">
                            {{ data.weather.current.uv_index }}
                        </span>
                        <span class="text-white/45 text-xs text-center leading-tight">
                            UV · {{ getUvLabel(data.weather.current.uv_index) }}
                        </span>
                    </div>

                    <!-- Pressão -->
                    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center gap-2">
                        <svg class="w-7 h-7 text-violet-300" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2a10 10 0 1 0 10 10"/>
                            <path d="M12 6v6l4 2"/>
                            <path d="M22 2 12 12"/>
                        </svg>
                        <span class="text-white text-xl font-semibold">
                            {{ Math.round(data.weather.current.surface_pressure) }}
                        </span>
                        <span class="text-white/45 text-xs">hPa · Pressão</span>
                    </div>

                    <!-- Cobertura de Nuvens -->
                    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center gap-2">
                        <svg class="w-7 h-7 text-slate-300" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                        </svg>
                        <span class="text-white text-xl font-semibold">
                            {{ data.weather.current.cloud_cover }}%
                        </span>
                        <span class="text-white/45 text-xs text-center leading-tight">Cobertura de Nuvens</span>
                    </div>

                    <!-- Visibilidade -->
                    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center gap-2">
                        <svg class="w-7 h-7 text-cyan-300" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                        <span class="text-white text-xl font-semibold">
                            {{ (data.weather.current.visibility / 1000).toFixed(1) }}<span class="text-sm font-normal">km</span>
                        </span>
                        <span class="text-white/45 text-xs">Visibilidade</span>
                    </div>

                </div>

                <!-- Alertas Meteorológicos -->
                <div v-if="alerts.length" class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5">
                    <p class="text-white/45 text-xs font-semibold uppercase tracking-widest mb-4">
                        ⚠️ Alertas Meteorológicos
                    </p>
                    <div class="flex flex-col gap-2.5">
                        <div
                            v-for="(alert, i) in alerts"
                            :key="i"
                            :class="`flex items-start gap-3 border rounded-2xl px-4 py-3 ${alertStyles[alert.level]}`"
                        >
                            <span class="text-lg leading-none mt-0.5 shrink-0">{{ alert.icon }}</span>
                            <div class="flex items-start gap-2 flex-1 min-w-0">
                                <span :class="`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${alertDot[alert.level]}`"/>
                                <p class="text-sm leading-snug">{{ alert.message }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Previsão 7 dias -->
                <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5">
                    <p class="text-white/45 text-xs font-semibold uppercase tracking-widest mb-4">
                        Próximos 7 dias
                    </p>
                    <div class="flex flex-col divide-y divide-white/10">
                        <div
                            v-for="(time, i) in data.weather.daily.time"
                            :key="time"
                            class="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                        >
                            <!-- Dia -->
                            <span class="text-white/75 text-sm w-20 shrink-0">{{ formatDay(time, i) }}</span>

                            <!-- Ícone -->
                            <WeatherIcon :type="getIconType(data.weather.daily.weather_code[i])" :size="28"/>

                            <!-- Chance de chuva -->
                            <div class="flex items-center gap-1 text-sky-300 text-xs w-12 justify-center">
                                <svg class="w-5 h-5 text-sky-300" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                                    <path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>
                                </svg>
                                {{ data.weather.daily.precipitation_probability_max[i] ?? 0 }}%
                            </div>

                            <!-- Temp máx / mín -->
                            <div class="flex gap-2 text-sm shrink-0">
                                <span class="text-white font-semibold">
                                    {{ Math.round(data.weather.daily.temperature_2m_max[i]) }}°
                                </span>
                                <span class="text-white/35">
                                    {{ Math.round(data.weather.daily.temperature_2m_min[i]) }}°
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Rodapé -->
                <p class="text-center text-white/25 text-xs pb-2">
                    Dados: Open-Meteo &amp; OpenStreetMap
                </p>

            </div>
        </div>
    </div>
</template>