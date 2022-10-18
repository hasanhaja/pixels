use crate::core::process;

use wasm_bindgen::prelude::*;

pub mod core;

#[wasm_bindgen]
pub fn grayscale(image_buffer: Vec<u8>) -> Vec<u8> {
  process(image_buffer, |image| image.grayscale())
}

#[wasm_bindgen]
pub fn blur(image_buffer: Vec<u8>, sigma: f32) -> Vec<u8> {
  process(image_buffer, |image| image.blur(sigma))
}

