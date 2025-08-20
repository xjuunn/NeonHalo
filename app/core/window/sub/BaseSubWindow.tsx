import type { ShallowRef } from "vue";
import type { JSX } from "vue/jsx-runtime";
import { animate } from 'animejs';

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
    protected content: ShallowRef<JSX.Element | null> = shallowRef(null);

    protected renderState = ref({
        x: 0, y: 0,
        width: 0, height: 0
    })

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
        this.content.value = content ?? null;
        this.renderState.value = {
            ...size, ...position
        }

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
        this.content.value = content;
    }

    /**
     * 获取窗体内容
     * @returns 窗体内容
     */
    getContent() {
        return this.content;
    }

    getWindowElement() {
        let status: any = this.renderState.value;
        if (status == undefined) status = this.renderState
        return (
            <div class="bg-base-100 rounded-md"
                style={{
                    position: "absolute",
                    top: `${status.y}px`,
                    left: `${status.x}px`,
                    width: `${status.width}px`,
                    height: `${status.height}px`,
                    overflow: "hidden"
                }}
            >
                {/* 内容 */}
                <div
                    style={{
                        width: "100%",
                        height: `100%`,
                        overflow: "auto",
                        padding: "8px"
                    }}
                >
                    {this.content}
                </div>
            </div>
        );
    }

    /**
     * 设置窗口尺寸
     * @param size 窗口尺寸
     */
    setSize(size: SubWindowSize) {
        if (!this.permissions.allow_resize) throw new Error(`当前窗口${this.title}，不允许设置尺寸`)
        this.size = size;
        this.renderState.value.width = size.width;
        this.renderState.value.height = size.height;
    }

    /**
     * 获取子窗口尺寸
     * @returns 子窗口尺寸
     */
    getSize() {
        return this.size;
    }

    /**
     * 设置窗口位置
     * @param position 窗口位置
     */
    setPosition(position: SubWindowPosition) {
        if (!this.permissions.allow_move) throw new Error(`当前窗口${this.title}，不允许移动`)
        this.position = position;
        this.renderState.value.x = position.x;
        this.renderState.value.y = position.y;
    }

    /**
     * 获取子窗口的位置
     * @returns 子窗口位置
     */
    getPosition() {
        return this.position;
    }

    /**
     * 动画过渡
     * @param target 目标状态
     * @param duration 动画时长
     */
    animateTo(target: Partial<SubWindowPosition & SubWindowSize>, duration = 300) {
        this.size = {
            width: target.width ?? this.size.width,
            height: target.height ?? this.size.height
        };
        this.position = {
            x: target.x ?? this.position.x,
            y: target.y ?? this.position.y
        };
        return animate(this.renderState.value, {
            ...target,
            duration,
            ease: 'inOutBack',
        })
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