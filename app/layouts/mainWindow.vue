<template>
    <div class="border-2 border-green-500 h-screen">
        <slot></slot>
        <component v-for="window in windowsList" :key="window.getTitle()" :is="window.getWindowElement()">
        </component>
        <button class="btn btn-primary" @click="test">test</button>
    </div>
</template>
<script setup lang="tsx">
import MainWindow from '~/core/window/MainWindow';
import type BaseSubWindow from '~/core/window/sub/BaseSubWindow';
import SubWindow from '~/core/window/sub/SubWindow';
import SubWindowManager from '~/core/window/sub/SubWindowManager';
const windowsList = ref<BaseSubWindow[]>([]);
const subWindowManager = SubWindowManager.getInstance();
subWindowManager.on('register', (window) => {
    windowsList.value.push(window);
})
subWindowManager.on('unregister', (window) => {
    windowsList.value = windowsList.value.filter(win => win.getTitle() !== window.getTitle());
})

const mainSubWindow = new SubWindow(
    "main",
    { height: 100, width: 100 },
    { x: 100, y: 100 },
    {
        allow_move: true,
        allow_resize: true
    },
    <div>test</div>
)

subWindowManager.register(mainSubWindow);

onMounted(async () => {
    const mainWindow = await MainWindow.getMainWindow();
    if (mainWindow) {
        mainWindow.setAlwaysOnTop(false);
        mainWindow.setIgnoreCursorEvents(false);
        mainWindow.setSkipTaskbar(false);
    }
})

function test() {
    mainSubWindow.animateTo({
        x: 400, y: 100
    })
}





</script>