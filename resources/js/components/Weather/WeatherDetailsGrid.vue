<script setup lang="ts">
import { getWindDir, getUvLabel, getUvColor } from '@/composables/useWeatherHelpers'

interface CurrentWeather {
    apparent_temperature: number
    relative_humidity_2m: number
    wind_speed_10m: number
    wind_direction_10m: number
    precipitation: number
    uv_index: number
    surface_pressure: number
    cloud_cover: number
    visibility: number
}

defineProps<{
    current: CurrentWeather
}>()
</script>

<template>
    <div class="grid grid-cols-3 gap-3">

        <!-- Sensação Térmica -->
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center gap-2">
            <svg class="w-7 h-7 text-orange-300" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
            </svg>
            <span class="text-white text-xl font-semibold">
                {{ Math.round(current.apparent_temperature) }}°C
            </span>
            <span class="text-white/45 text-xs text-center leading-tight">Sensação Térmica</span>
        </div>

        <!-- Umidade -->
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center gap-2">
            <svg class="w-7 h-7 text-blue-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2S5 10 5 14a7 7 0 0 0 14 0C19 10 12 2 12 2z"/>
            </svg>
            <span class="text-white text-xl font-semibold">
                {{ current.relative_humidity_2m }}%
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
                {{ Math.round(current.wind_speed_10m) }}
            </span>
            <span class="text-white/45 text-xs text-center leading-tight">
                km/h {{ getWindDir(current.wind_direction_10m) }}
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
                {{ current.precipitation }}<span class="text-sm font-normal">mm</span>
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
            <span :class="`text-xl font-semibold ${getUvColor(current.uv_index)}`">
                {{ current.uv_index }}
            </span>
            <span class="text-white/45 text-xs text-center leading-tight">
                UV · {{ getUvLabel(current.uv_index) }}
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
                {{ Math.round(current.surface_pressure) }}
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
                {{ current.cloud_cover }}%
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
                {{ (current.visibility / 1000).toFixed(1) }}<span class="text-sm font-normal">km</span>
            </span>
            <span class="text-white/45 text-xs">Visibilidade</span>
        </div>

    </div>
</template>