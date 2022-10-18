use crate::core::process;

use wasm_bindgen::prelude::*;

use image::imageops::FilterType;

pub mod core;

#[wasm_bindgen]
pub fn grayscale(image_buffer: Vec<u8>) -> Vec<u8> {
  process(image_buffer, |image| image.grayscale())
}

#[wasm_bindgen]
pub fn blur_unscaled(image_buffer: Vec<u8>, sigma: f32) -> Vec<u8> {
  process(image_buffer, |image| image.blur(sigma))
}

#[wasm_bindgen]
pub fn blur(image_buffer: Vec<u8>, sigma: f32) -> Vec<u8> {
  process(image_buffer, |image| {
    let width = image.width();
    let height = image.height();
    let image = image.resize(width/10, height/10, FilterType::Nearest);
    let image = image.blur(sigma);

    image.resize(width, height, FilterType::Triangle)
  })
}
