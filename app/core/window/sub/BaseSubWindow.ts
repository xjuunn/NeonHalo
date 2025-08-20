import type { JSX } from "vue/jsx-runtime";

/** 抽象子窗口类 */
export default abstract class BaseSubWindow {
    // 窗口标题
    protected title: string = '';
    // 窗口尺寸
    protected size: SubWindowSize = { width: 0, height: 0 };
    // 窗口位置
    protected position: SubWindowPosition = { x: 0, y: 0 };
    // 窗口权限
    protected permissions: SubWindowPermissions;
    // 窗体内容
    protected content: JSX.Element | null = null;

    /**
     * @param title 窗口标题
     * @param size 窗口尺寸
     * @param position 窗口位置
     * @param permissions 权限
     * @param content 窗体内容
     */
    constructor(
        title: string,
        size: SubWindowSize,
        position: SubWindowPosition,
        permissions: SubWindowPermissions,
        content?: JSX.Element
    ) {
        this.title = title;
        this.size = size;
        this.position = position;
        this.permissions = permissions;
        this.content = content ?? null;
    }

    /**
     * 获取子窗口标题
     * @returns 子窗口标题
     */
    getTitle() {
        return this.title;
    }

    /**
     * 设置窗体内容
     * @param content 窗体内容
     */
    setContent(content: JSX.Element) {
        this.content = content;
    }

    /**
     * 获取窗体内容
     * @returns 窗体内容
     */
    getContent() {
        return this.content;
    }

    /**
     * 设置窗口尺寸
     * @param size 窗口尺寸
     */
    setSize(size: SubWindowSize) {
        if (!this.permissions.allow_resize) throw new Error(`当前窗口${this.title}，不允许设置尺寸`)
        this.size = size;
    }

    /**
     * 设置窗口位置
     * @param position 窗口位置
     */
    setPosition(position: SubWindowPosition) {
        if (!this.permissions.allow_move) throw new Error(`当前窗口${this.title}，不允许移动`)
        this.position = position;
    }

    /**
     * 更新权限
     * @param permission 权限名
     * @param value 权限值
     */
    updatePermission(permission: keyof SubWindowPermissions, value: boolean) {
        this.permissions = {
            ...this.permissions,
            [permission]: value
        }
    }



}

/** 子窗口尺寸 */
export type SubWindowSize = {
    width: number,
    height: number
}

/** 子窗口位置 */
export type SubWindowPosition = {
    x: number,
    y: number
}

/** 子窗口权限 */
export type SubWindowPermissions = {
    allow_move: boolean,
    allow_resize: boolean
}