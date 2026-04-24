<script setup lang="ts">
import { computed } from 'vue'

interface CurrentWeather {
    uv_index: number
    apparent_temperature: number
    wind_speed_10m: number
    precipitation: number
    visibility: number
    surface_pressure: number
    weather_code: number
}

interface WeatherAlert {
    level: 'info' | 'warning' | 'danger'
    icon: string
    message: string
}

const props = defineProps<{
    current: CurrentWeather
}>()

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

const alerts = computed<WeatherAlert[]>(() => {
    const c = props.current
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
</script>

<template>
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
</template>