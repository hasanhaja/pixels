use image::{load_from_memory, DynamicImage, ImageOutputFormat};
use std::io::{Cursor, Read, Seek, SeekFrom};

use wasm_bindgen::prelude::*;

fn to_image(buffer: Vec<u8>) -> DynamicImage {
  load_from_memory(&buffer).unwrap()
}

// source: https://github.com/peerigon/wasm-image/blob/master/rust-image-wrapper/src/lib.rs
fn to_buffer(image: DynamicImage) -> Vec<u8> {
  let mut cursor = Cursor::new(Vec::new());

  image
    .write_to(&mut cursor, ImageOutputFormat::Jpeg(80))
    .unwrap();

  cursor.seek(SeekFrom::Start(0)).unwrap();

  // Read the "file's" contents into a vector
  let mut buffer = Vec::new();
  cursor.read_to_end(&mut buffer).unwrap();

  buffer
}
fn process<F>(buffer: Vec<u8>, f: F) -> Vec<u8> 
where 
F: Fn(DynamicImage) -> DynamicImage {
  let image = to_image(buffer);
  let image = f(image);

  to_buffer(image)
}

#[wasm_bindgen]
pub fn grayscale(image_buffer: Vec<u8>) -> Vec<u8> {
  process(image_buffer, |image| image.grayscale())
}

#[wasm_bindgen]
pub fn blur(image_buffer: Vec<u8>, sigma: f32) -> Vec<u8> {
  process(image_buffer, |image| image.blur(sigma))
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn it_works() {
    // let result = add(1, 2);
    assert_eq!(3, 3);
  }
}
