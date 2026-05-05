<script setup lang="ts">
import WeatherIcon from '@/components/Weather/WeatherIcon.vue'
import { getIconType, formatDay } from '@/composables/useWeatherHelpers'

interface DailyWeather {
    time: string[]
    weather_code: number[]
    precipitation_probability_max: number[]
    precipitation_sum: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
}

defineProps<{
    daily: DailyWeather
}>()
</script>

<template>
    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5">
        <p class="text-white/45 text-xs font-semibold uppercase tracking-widest mb-4">
            Próximos 7 dias
        </p>
        <div class="flex flex-col divide-y divide-white/10">
            <div
                v-for="(time, i) in daily.time"
                :key="time"
                class="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
                <!-- Dia -->
                <span class="text-white/75 text-sm w-20 shrink-0">{{ formatDay(time, i) }}</span>

                <!-- Ícone -->
                <WeatherIcon :type="getIconType(daily.weather_code[i])" :size="28" />

                <!-- Chance de chuva + precipitação estimada -->
                <div class="flex items-center gap-1 text-sky-300 text-xs w-28 justify-center">
                    <svg class="w-5 h-5 text-sky-300 shrink-0" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                        <path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>
                    </svg>
                    {{ daily.precipitation_probability_max[i] ?? 0 }}%
                    <span class="text-white/30">|</span>
                    {{ (daily.precipitation_sum[i] ?? 0).toFixed(1) }}mm
                </div>

                <!-- Temp máx / mín -->
                <div class="flex gap-2 text-sm shrink-0">
                    <span class="text-white/35 flex items-center gap-0.5">
                        <!-- Seta azul para baixo -->
                        <svg class="w-3 h-3 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 20l-8-10h16z"/>
                        </svg>
                        {{ Math.round(daily.temperature_2m_min[i]) }}°
                    </span>
                    <span class="text-white font-semibold flex items-center gap-0.5">
                        <!-- Seta vermelha para cima -->
                        <svg class="w-3 h-3 text-red-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4l8 10H4z"/>
                        </svg>
                        {{ Math.round(daily.temperature_2m_max[i]) }}°
                    </span>                    
                </div>
            </div>
        </div>
    </div>
</template>