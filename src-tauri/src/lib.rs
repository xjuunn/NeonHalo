#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use std::thread;
use std::time::Duration;
use tauri::{Emitter, Manager};
use windows::Win32::Foundation::POINT;
use windows::Win32::UI::WindowsAndMessaging::GetCursorPos;

#[derive(serde::Serialize, Copy, Clone)]
struct DeviceMouse {
    x: i32,
    y: i32,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle().clone();
            let window = app.get_webview_window("main").unwrap();
            window.open_devtools();
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            thread::spawn(move || loop {
                let mut point = POINT { x: 0, y: 0 };
                unsafe { GetCursorPos(&mut point) };

                app_handle
                    .emit(
                        "device-mouse-move",
                        DeviceMouse {
                            x: point.x,
                            y: point.y,
                        },
                    )
                    .ok();

                thread::sleep(Duration::from_millis(16));
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
