<script setup lang="ts">
import WeatherIcon from '@/components/Weather/WeatherIcon.vue'
import { getIconType, formatDay } from '@/composables/useWeatherHelpers'

interface DailyWeather {
    time: string[]
    weather_code: number[]
    precipitation_probability_max: number[]
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

                <!-- Chance de chuva -->
                <div class="flex items-center gap-1 text-sky-300 text-xs w-12 justify-center">
                    <svg class="w-5 h-5 text-sky-300" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                        <path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>
                    </svg>
                    {{ daily.precipitation_probability_max[i] ?? 0 }}%
                </div>

                <!-- Temp máx / mín -->
                <div class="flex gap-2 text-sm shrink-0">
                    <span class="text-white font-semibold">
                        {{ Math.round(daily.temperature_2m_max[i]) }}°
                    </span>
                    <span class="text-white/35">
                        {{ Math.round(daily.temperature_2m_min[i]) }}°
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>