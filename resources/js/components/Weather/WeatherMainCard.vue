<script setup lang="ts">
import WeatherIcon from '@/components/Weather/WeatherIcon.vue'
import { getIconType, getDescription } from '@/composables/useWeatherHelpers'

interface CurrentWeather {
    weather_code: number
    temperature_2m: number
    apparent_temperature: number
}

defineProps<{
    current: CurrentWeather
}>()
</script>

<template>
    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex flex-col items-center gap-1">
        <WeatherIcon :type="getIconType(current.weather_code)" :size="120" />

        <div class="text-white text-7xl font-thin mt-3 leading-none">
            {{ Math.round(current.temperature_2m) }}<span class="text-4xl align-super ml-1">°C</span>
        </div>

        <p class="text-white/85 text-lg mt-1">
            {{ getDescription(current.weather_code) }}
        </p>

        <p class="text-white/45 text-sm">
            Sensação {{ Math.round(current.apparent_temperature) }}°C
        </p>
    </div>
</template>