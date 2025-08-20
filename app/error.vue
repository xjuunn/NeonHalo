<template>
    <div class="h-screen bg-base-100 rounded-md flex flex-col">
        <div class="h-10 border flex items-center p-2" data-tauri-drag-region>
            Error
        </div>
        <div class="p-4 overflow-auto flex-1">
            <NuxtLink to="/">Go back home</NuxtLink>
            <h1>{{ props.error?.statusCode }}</h1>
            <pre>{{ { ...props.error, stack: undefined } }}</pre>
            <pre v-html="props.error?.stack?.replaceAll('\n', '<br/>')"></pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
import { getAllWindows } from '@tauri-apps/api/window';
onMounted(async () => {
    const windows = await getAllWindows();
    const mainWindow = windows.find(window => window.label == 'main');
    if (mainWindow) {
        mainWindow.setAlwaysOnTop(false);
        mainWindow.setIgnoreCursorEvents(false);
        mainWindow.setResizable(true);
    }




})
const props = defineProps({
    error: Object as () => NuxtError
})
</script>