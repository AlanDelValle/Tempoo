<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CityResult } from '@/types/weather'

const emit = defineEmits<{
    select: [city: CityResult]
}>()

const query      = ref('')
const results    = ref<CityResult[]>([])
const loading    = ref(false)
const showList   = ref(false)
const inputRef   = ref<HTMLInputElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout>

watch(query, (val) => {
    clearTimeout(debounceTimer)
    results.value = []

    if (val.trim().length < 2) {
        showList.value = false
        return
    }

    loading.value = true
    debounceTimer = setTimeout(async () => {
        try {
            const res  = await fetch(`/weather/search?q=${encodeURIComponent(val.trim())}`)
            const data = await res.json()
            results.value = data.results ?? []
            showList.value = true
        } catch {
            results.value = []
        } finally {
            loading.value = false
        }
    }, 400)
})

function select(city: CityResult) {
    query.value    = ''
    results.value  = []
    showList.value = false
    emit('select', city)
}

function onBlur() {
    // delay para permitir o click no item da lista
    setTimeout(() => { showList.value = false }, 150)
}
</script>

<template>
    <div class="relative w-full">
        <!-- Input -->
        <div class="relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>

            <input
                ref="inputRef"
                v-model="query"
                type="text"
                placeholder="Buscar cidade…"
                autocomplete="off"
                @blur="onBlur"
                class="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl
                       pl-11 pr-10 py-3 text-white placeholder-white/35 text-sm
                       focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15
                       transition-all"
            />

            <!-- Spinner / clear -->
            <div class="absolute right-4 top-1/2 -translate-y-1/2">
                <svg v-if="loading" class="w-4 h-4 text-white/40 animate-spin"
                     viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83
                             M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                <button v-else-if="query"
                        @mousedown.prevent="query = ''; results = []; showList = false"
                        class="text-white/35 hover:text-white/70 transition-colors">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round">
                        <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Dropdown -->
        <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
        >
            <ul v-if="showList && results.length"
                class="absolute top-full mt-2 w-full z-50
                       bg-slate-900/90 backdrop-blur-md border border-white/15
                       rounded-2xl overflow-hidden shadow-2xl">
                <li v-for="city in results" :key="`${city.latitude}-${city.longitude}`">
                    <button
                        @mousedown.prevent="select(city)"
                        class="w-full flex items-center gap-3 px-4 py-3
                               hover:bg-white/10 transition-colors text-left"
                    >
                        <svg class="w-4 h-4 text-white/35 shrink-0" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0
                                     C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <div class="min-w-0">
                            <span class="text-white text-sm font-medium">{{ city.name }}</span>
                            <span class="text-white/40 text-xs ml-1.5">
                                {{ [city.state, city.country].filter(Boolean).join(', ') }}
                            </span>
                        </div>
                    </button>
                </li>
            </ul>

            <!-- Nenhum resultado -->
            <div v-else-if="showList && !results.length && !loading"
                 class="absolute top-full mt-2 w-full z-50
                        bg-slate-900/90 backdrop-blur-md border border-white/15
                        rounded-2xl px-4 py-4 text-center shadow-2xl">
                <p class="text-white/40 text-sm">Nenhuma cidade encontrada.</p>
            </div>
        </Transition>
    </div>
</template>