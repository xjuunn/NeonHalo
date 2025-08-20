import type BaseSubWindow from "./BaseSubWindow";

type EventCallback = (window: BaseSubWindow) => void;

export type EventName = "register" | "unregister";

export default class SubWindowManager {
    // 子窗口管理器示例
    private static instance: SubWindowManager | null = null;
    // 子窗口列表
    private windows: Map<string, BaseSubWindow> = new Map();
    // 事件列表
    private events: Map<string, Set<EventCallback>> = new Map();

    // 私有化构造器
    private constructor() { }

    /**
     * 获取子窗口管理器实例
     * @returns 子窗口管理器实例
     */
    public static getInstance(): SubWindowManager {
        if (!SubWindowManager.instance) {
            SubWindowManager.instance = new SubWindowManager();
        }
        return SubWindowManager.instance;
    }

    /**
     * 注册子窗口
     * @param window 子窗口
     */
    register(window: BaseSubWindow) {
        if (this.windows.has(window.getTitle())) throw new Error("已经有同名子窗口存在");
        this.windows.set(window.getTitle(), window);
        this.emit('register', window);
    }

    unregister(title: string) {
        const win = this.windows.get(title);
        if (win) {
            this.windows.delete(title);
            this.emit('unregister', win);
        }
    }

    /**
     * 获取所有的子窗口
     * @returns 子窗口列表
     */
    getWindows() {
        return this.windows
    }

    /**
     * 获取子窗口
     * @param title 子窗口标题
     * @returns 子窗口
     */
    getWindowByTitle(title: string) {
        return this.windows.get(title);
    }

    /**
     * 注册事件
     * @param event 事件名
     * @param callback 回调函数
     */
    on(event: EventName, callback: EventCallback) {
        if (!this.events.has(event)) this.events.set(event, new Set());
        this.events.get(event)!.add(callback);
    }

    /**
     * 注销事件
     * @param event 事件名
     * @param callback 回调函数
     */
    off(event: EventName, callback: EventCallback) {
        this.events.get(event)?.delete(callback);
    }

    /**
     * 触发事件
     * @param event 事件名
     * @param args 事件参数
     */
    emit(event: EventName, window: BaseSubWindow) {
        this.events.get(event)?.forEach(callback => {
            callback(window);
        })
    }

}