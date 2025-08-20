<template>
    <div class="border-2 border-green-500 h-screen">
        <slot></slot>
        <component v-for="window in windowsList" :key="window.getTitle()" :is="window.getWindowElement()">
        </component>
    </div>
</template>
<script setup lang="tsx">
import { listen } from '@tauri-apps/api/event';
import MainWindow from '~/core/window/MainWindow';
import type BaseSubWindow from '~/core/window/sub/BaseSubWindow';
import SubWindow from '~/core/window/sub/SubWindow';
import SubWindowManager from '~/core/window/sub/SubWindowManager';
const windowsList: Ref<BaseSubWindow[]> = ref([]);
const subWindowManager = SubWindowManager.getInstance();
subWindowManager.on('register', (window: BaseSubWindow) => {
    windowsList.value.push(window);
})
subWindowManager.on('unregister', (window: BaseSubWindow) => {
    windowsList.value = windowsList.value.filter(win => win.getTitle() !== window.getTitle());
})

const mainSubWindow = new SubWindow(
    "main",
    { height: 150, width: 120 },
    { x: 200, y: 110 },
    {
        allow_move: true,
        allow_resize: true
    },
    <div>test</div>
)

const subwindow2 = new SubWindow(
    "test",
    { height: 150, width: 120 },
    { x: 200, y: 410 },
    {
        allow_move: true,
        allow_resize: true
    },
    <div>test</div>
)

subWindowManager.register(mainSubWindow);
subWindowManager.register(subwindow2);

onMounted(async () => {
    initSetIgnoreEvent();
})

// 设置窗体事件透传
async function initSetIgnoreEvent() {
    let prePosition = { x: 0, y: 0 };
    const mainWindow = await MainWindow.getMainWindow();
    if (mainWindow == null) return;
    await listen<{ x: number; y: number }>('device-mouse-move', async (event) => {
        const { x, y } = event.payload;
        if (prePosition.x == x && prePosition.y == y) return;
        prePosition = { x, y };
        let ignore = true;
        for (let index = 0; index < windowsList.value.length; index++) {
            const window = windowsList.value[index];
            if (window == null) return;
            const { x1, x2, y1, y2 } = getWindowArea(window);
            if (x > x1 && x < x2 && y > y1 && y < y2) {
                ignore = false;
                break;
            } else {
                ignore = true;
            }
        }
        mainWindow.setIgnoreCursorEvents(ignore);
    })
}

// 获取子窗口的区域
function getWindowArea(window: BaseSubWindow) {
    const { width, height } = window.getSize();
    const { x, y } = window.getPosition();
    return {
        x1: x,
        y1: y,
        x2: x + width,
        y2: y + height
    }
}

</script>