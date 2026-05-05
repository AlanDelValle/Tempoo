<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Head } from '@inertiajs/vue3'
import CitySearch from '@/components/Weather/CitySearch.vue'
import WeatherMainCard from '@/components/Weather/WeatherMainCard.vue'
import WeatherDetailsGrid from '@/components/Weather/WeatherDetailsGrid.vue'
import WeatherAlerts from '@/components/Weather/WeatherAlerts.vue'
import WeatherForecast from '@/components/Weather/WeatherForecast.vue'
import WeatherHourlyChart from '@/components/Weather/WeatherHourlyChart.vue'
import type { WeatherResponse, CityResult } from '@/types/weather'

defineOptions({ layout: undefined })

// ─── State ───────────────────────────────────────────────
const loading = ref(true)
const error   = ref<string | null>(null)
const data    = ref<WeatherResponse | null>(null)

// ─── Dynamic background ───────────────────────────────────
const bgGradient = computed(() => {
    if (!data.value) return 'from-slate-900 via-blue-950 to-slate-900'
    const c = data.value.weather.current.weather_code
    if (c === 0 || c === 1)              return 'from-sky-500 via-blue-700 to-indigo-900'
    if (c === 2 || c === 3)              return 'from-slate-500 via-slate-700 to-slate-900'
    if (c <= 48)                         return 'from-slate-400 via-slate-600 to-slate-800'
    if (c <= 67 || (c >= 80 && c <= 82)) return 'from-slate-700 via-blue-900 to-slate-950'
    if (c <= 77 || (c >= 85 && c <= 86)) return 'from-sky-300 via-slate-600 to-slate-800'
    return 'from-slate-800 via-zinc-900 to-slate-950'
})

// ─── Page title ───────────────────────────────────────────
const pageTitle = computed(() =>
    data.value ? `Tempoo - ${data.value.location.city}` : 'Tempoo'
)

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

                <!-- Card Principal -->
                <WeatherMainCard :current="data.weather.current" />

                <!-- Grid de Detalhes -->
                <WeatherDetailsGrid :current="data.weather.current" />

                <!-- Alertas Meteorológicos -->
                <WeatherAlerts :current="data.weather.current" />

                <!-- Gráficos horários -->
                <WeatherHourlyChart :hourly="data.weather.hourly" />

                <!-- Previsão 7 Dias -->
                <WeatherForecast :daily="data.weather.daily" />

                <!-- Rodapé -->
                <p class="text-center text-white/25 text-xs pb-2">
                    Dados: Open-Meteo &amp; OpenStreetMap
                </p>

            </div>
        </div>
    </div>
</template>