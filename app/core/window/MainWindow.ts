import { getAllWindows, Window, getCurrentWindow, currentMonitor, LogicalPosition } from '@tauri-apps/api/window'

export default class MainWindow {
    // 主窗口
    static window: Window | null = null;

    static async init() {
        const windows = await getAllWindows();
        MainWindow.window = windows.find(item => item.label == 'main') ?? null;
        if (MainWindow.window == null) return;
        // 设置点击事件透传
        await MainWindow.window.setIgnoreCursorEvents(true);
        // 最大化窗口
        await MainWindow.window.maximize();
        // 设置非最大化的窗口状态和最大化窗口状态一致，防止用户点击 win+↓ 时引发窗口抖动
        const monitor = await currentMonitor();
        if (monitor == null) return;
        await MainWindow.window.setAlwaysOnTop(true);
        await MainWindow.window.setSize(monitor.workArea.size);
        await MainWindow.window.setPosition(new LogicalPosition(0, 0));
    }
}